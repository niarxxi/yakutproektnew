"use client";

import { memo, useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Award, Users, Target, Lightbulb } from "lucide-react";
import { GlassCard } from "@/src/components/common/glass-card";
import * as THREE from "three";

const advantages = [
  {
    icon: <Award className="h-8 w-8 text-blue-600" />,
    title: "Опыт и экспертиза",
    description:
      "Более 20 лет успешной работы в области проектирования и строительства",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Профессиональная команда",
    description:
      "150+ высококвалифицированных специалистов в 14 профильных отделах",
  },
  {
    icon: <Target className="h-8 w-8 text-blue-600" />,
    title: "Комплексный подход",
    description:
      "Полный цикл проектирования от идеи до сдачи объекта в эксплуатацию",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
    title: "Инновационные решения",
    description:
      "Применение современных технологий и материалов в суровых климатических условиях",
  },
];

// STL Loader - упрощенная версия для загрузки STL файлов
class STLLoader {
  load(url: string, onLoad: (geometry: THREE.BufferGeometry) => void, onError?: (error: any) => void) {
    const loader = new THREE.FileLoader();
    loader.setResponseType('arraybuffer');
    
    loader.load(
      url,
      (data) => {
        try {
          const geometry = this.parse(data as ArrayBuffer);
          onLoad(geometry);
        } catch (error) {
          if (onError) onError(error);
        }
      },
      undefined,
      onError
    );
  }

  parse(data: ArrayBuffer): THREE.BufferGeometry {
    const view = new DataView(data);
    const isLittleEndian = true;

    // Пропускаем заголовок (80 байт)
    let offset = 80;
    
    // Читаем количество треугольников
    const triangles = view.getUint32(offset, isLittleEndian);
    offset += 4;

    const vertices = [];
    const normals = [];

    for (let i = 0; i < triangles; i++) {
      // Нормаль треугольника
      const nx = view.getFloat32(offset, isLittleEndian);
      const ny = view.getFloat32(offset + 4, isLittleEndian);
      const nz = view.getFloat32(offset + 8, isLittleEndian);
      offset += 12;

      // Три вершины треугольника
      for (let j = 0; j < 3; j++) {
        const vx = view.getFloat32(offset, isLittleEndian);
        const vy = view.getFloat32(offset + 4, isLittleEndian);
        const vz = view.getFloat32(offset + 8, isLittleEndian);
        offset += 12;
        
        vertices.push(vx, vy, vz);
        normals.push(nx, ny, nz);
      }

      // Пропускаем атрибуты (2 байта)
      offset += 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    
    return geometry;
  }
}

// 3D Logo Component
const STLLogo = memo(({ stlPath = "/models/logo.stl" }: { stlPath?: string }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const modelRef = useRef<THREE.Object3D>();
  const frameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Адаптивные размеры в зависимости от экрана
    const size = Math.min(containerWidth, containerHeight, window.innerWidth < 768 ? 280 : 400);
    
    setDimensions({ width: size, height: size });
    
    // Обновляем размеры рендерера и камеры
    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.setSize(size, size);
      cameraRef.current.aspect = 1;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Инициализация сцены
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    // Яркое освещение для светлого цвета #b9ddff
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4, 100);
    pointLight.position.set(-10, 10, 10);
    scene.add(pointLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-1, -1, -1);
    scene.add(fillLight);

    // Позиция камеры
    camera.position.z = 5;

    // Сохраняем ссылки
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Функция создания fallback модели (красивый логотип)
    const createFallbackModel = () => {
      const group = new THREE.Group();
      
      // Основание логотипа - цилиндр с цветом #b9ddff
      const baseGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.3, 8);
      const baseMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xb9ddff
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -1;
      group.add(base);
      
      // Центральная часть - призма
      const prismGeometry = new THREE.CylinderGeometry(1, 1.3, 1.5, 6);
      const prismMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xb9ddff
      });
      const prism = new THREE.Mesh(prismGeometry, prismMaterial);
      group.add(prism);
      
      // Верхняя часть - пирамида
      const topGeometry = new THREE.ConeGeometry(0.8, 1, 6);
      const topMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xb9ddff
      });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 1.25;
      group.add(top);
      
      // Добавляем декоративные элементы
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const decorGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const decorMaterial = new THREE.MeshLambertMaterial({ 
          color: 0xb9ddff
        });
        const decor = new THREE.Mesh(decorGeometry, decorMaterial);
        decor.position.x = Math.cos(angle) * 1.2;
        decor.position.z = Math.sin(angle) * 1.2;
        decor.position.y = 0.5;
        group.add(decor);
      }
      
      group.castShadow = true;
      group.receiveShadow = true;
      
      return group;
    };

    // Пытаемся загрузить STL, если не получается - используем fallback
    const loader = new STLLoader();
    
    loader.load(
      stlPath,
      (geometry) => {
        // Центрируем и масштабируем геометрию
        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const center = box.getCenter(new THREE.Vector3());
        
        geometry.translate(-center.x, -center.y, -center.z);
        
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5.3 / maxDim;
        geometry.scale(scale, scale, scale);

        const material = new THREE.MeshLambertMaterial({
          color: 0xb9ddff
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        scene.add(mesh);
        modelRef.current = mesh;
        setIsLoaded(true);
        setError(null);
      },
      (error) => {
        console.warn('STL файл не найден, используется стандартная модель');
        
        const fallbackModel = createFallbackModel();
        scene.add(fallbackModel);
        modelRef.current = fallbackModel;
        setIsLoaded(true);
        setError('Используется стандартная модель логотипа');
      }
    );

    // Анимационный цикл
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      if (modelRef.current) {
        const targetRotationY = mouseRef.current.x * 0.5;
        const targetRotationX = mouseRef.current.y * 0.3;
        
        modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.05;
        modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Добавляем обработчик движения мыши к контейнеру
    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }
    const currentContainer = containerRef.current;
    const currentMount = mountRef.current;

    // Очистка
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      if (scene) {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [stlPath, handleMouseMove, dimensions]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-80 md:h-96 flex items-center justify-center p-4"
    >
      <div 
        ref={mountRef} 
        className="relative cursor-pointer transition-transform hover:scale-105 flex items-center justify-center"
        style={{ 
          width: dimensions.width,
          height: dimensions.height,
          filter: 'drop-shadow(0 10px 20px rgba(59, 130, 246, 0.3))',
        }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-4 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center px-2">
              Загрузка 3D модели...
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute bottom-2 left-2 right-2 text-xs text-yellow-600 dark:text-yellow-400 text-center px-2">
          {error}
        </div>
      )}
    </div>
  );
});

STLLogo.displayName = "STLLogo";

const OptimizedParticles = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 15 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full opacity-60 will-change-transform"
        animate={{
          x: [Math.random() * 1920, Math.random() * 1920],
          y: [Math.random() * 1080, Math.random() * 1080],
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: Math.random() * 3 + 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: Math.random() * 2,
          ease: "linear",
        }}
      />
    ))}
  </div>
));

OptimizedParticles.displayName = "OptimizedParticles";

export const About = memo(() => {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <OptimizedParticles />

      {/* Декоративные круги */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full border-2 border-blue-200/30 dark:border-blue-500/20 will-change-transform"
          animate={{ rotate: 360 }}
          transition={{
            duration: 100,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-[15%] -left-[15%] w-[50%] h-[50%] rounded-full border-2 border-purple-200/30 dark:border-purple-500/20 will-change-transform"
          animate={{ rotate: -360 }}
          transition={{
            duration: 120,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            О компании
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ОАО РПИИ «ЯКУТПРОЕКТ» — ведущий проектный институт Республики Саха
            (Якутия), специализирующийся на комплексном проектировании объектов
            различного назначения.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Наша миссия
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Создание качественной архитектурной среды, способствующей
              социально-экономическому развитию Республики Саха (Якутия) и
              повышению качества жизни населения.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Мы проектируем не просто здания — мы создаем пространства для
              жизни, работы, образования и культурного развития, учитывая
              уникальные климатические условия и культурные особенности региона.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <STLLogo stlPath="/models/yakutproekt-logo.stl" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {advantages.map((advantage, index) => (
            <GlassCard
              key={index}
              icon={advantage.icon}
              title={advantage.title}
              description={advantage.description}
              index={index}
              variant="blue"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
});

About.displayName = "About";