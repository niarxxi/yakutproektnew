"use client";

import { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Ruler,
  FileSpreadsheet,
  Compass,
  Lightbulb,
  Workflow,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: <Building2 className="h-10 w-10 text-blue-600" />,
    title: "Архитектурное проектирование",
    description:
      "Разработка архитектурных концепций и проектной документации для зданий различного назначения",
    details:
      "Наша команда архитекторов разрабатывает уникальные проекты, учитывающие все пожелания заказчика, особенности участка и климатические условия региона. Мы создаем функциональные и эстетически привлекательные решения для жилых, общественных и промышленных зданий.",
  },
  {
    icon: <Ruler className="h-10 w-10 text-blue-600" />,
    title: "Конструктивные решения",
    description:
      "Проектирование конструктивных элементов зданий с учетом климатических и сейсмических особенностей",
    details:
      "Наши инженеры-конструкторы разрабатывают надежные и экономичные конструктивные решения, учитывающие особенности вечной мерзлоты и сейсмической активности региона. Мы используем современные методы расчета и моделирования для обеспечения безопасности и долговечности зданий.",
  },
  {
    icon: <FileSpreadsheet className="h-10 w-10 text-blue-600" />,
    title: "Инженерные системы",
    description:
      "Проектирование инженерных сетей: отопление, вентиляция, водоснабжение, канализация, электроснабжение",
    details:
      "Мы проектируем все виды инженерных систем для зданий и сооружений: отопление, вентиляцию и кондиционирование, водоснабжение и канализацию, электроснабжение и освещение, слаботочные системы. Наши решения обеспечивают комфорт, энергоэффективность и надежность.",
  },
  {
    icon: <Compass className="h-10 w-10 text-blue-600" />,
    title: "Генеральное планирование",
    description:
      "Разработка генеральных планов территорий, планировка земельных участков",
    details:
      "Наши специалисты разрабатывают генеральные планы территорий различного назначения, от частных участков до крупных промышленных комплексов. Мы учитываем особенности рельефа, инженерно-геологические условия, существующую застройку и инфраструктуру.",
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-blue-600" />,
    title: "Энергоэффективность",
    description:
      "Проектирование с учетом современных требований энергоэффективности и экологичности",
    details:
      "Мы разрабатываем энергоэффективные решения, позволяющие снизить эксплуатационные расходы и уменьшить негативное воздействие на окружающую среду. Наши проекты соответствуют современным требованиям по энергосбережению и могут быть сертифицированы по стандартам зеленого строительства.",
  },
  {
    icon: <Workflow className="h-10 w-10 text-blue-600" />,
    title: "Авторский надзор",
    description:
      "Контроль соответствия выполняемых строительных работ проектной документации",
    details:
      "Наши специалисты осуществляют авторский надзор на всех этапах строительства, контролируя соответствие выполняемых работ проектной документации. Мы оперативно решаем возникающие вопросы, вносим необходимые корректировки и обеспечиваем высокое качество реализации проекта.",
  },
];

interface ServiceModalProps {
  service: (typeof services)[0] | null;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceModal = memo(({ service, isOpen, onClose }: ServiceModalProps) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  {service.icon}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>{service.details}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ServiceModal.displayName = "ServiceModal";

interface AllServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AllServicesModal = memo(({ isOpen, onClose }: AllServicesModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Наши услуги
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Полный комплекс услуг по проектированию объектов различного
                    назначения
                  </p>
                </div>

                <div className="overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                  <div className="space-y-8">
                    {services.map((service, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">{service.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                              {service.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {service.description}
                            </p>
                            <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                              {service.details}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AllServicesModal.displayName = "AllServicesModal";

// Мемоизированный компонент карточки услуги
const ServiceCard = memo(
  ({
    service,
    index,
    onClick,
  }: {
    service: (typeof services)[0];
    index: number;
    onClick: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="cursor-pointer will-change-transform"
      onClick={onClick}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 group border-blue-100 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <div className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 will-change-transform">
            {service.icon}
          </div>
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            {service.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            {service.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
);

ServiceCard.displayName = "ServiceCard";

// Оптимизированный компонент частиц
const OptimizedParticles = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 15 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-purple-400 dark:bg-purple-500 rounded-full opacity-60 will-change-transform"
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

export const Services = memo(() => {
  const [selectedService, setSelectedService] = useState<
    (typeof services)[0] | null
  >(null);
  const [isAllServicesOpen, setIsAllServicesOpen] = useState(false);

  const handleServiceClick = useCallback((service: (typeof services)[0]) => {
    setSelectedService(service);
  }, []);

  const handleMoreServicesClick = useCallback(() => {
    setIsAllServicesOpen(true);
  }, []);

  const handleCloseServiceModal = useCallback(() => {
    setSelectedService(null);
  }, []);

  const handleCloseAllServicesModal = useCallback(() => {
    setIsAllServicesOpen(false);
  }, []);

  return (
    <section id="services" className="relative py-20 overflow-hidden">
      <OptimizedParticles />

      {/* Большие декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[15%] -right-[15%] w-[50%] h-[50%] rounded-full border-2 border-purple-200/30 dark:border-purple-500/20 will-change-transform"
          animate={{ rotate: 360 }}
          transition={{
            duration: 120,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full border-2 border-pink-200/30 dark:border-pink-500/20 will-change-transform"
          animate={{ rotate: -360 }}
          transition={{
            duration: 100,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Геометрические фигуры */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-24 h-24 border-2 border-purple-200/20 dark:border-purple-400/15 rotate-45 will-change-transform"
          animate={{
            rotate: [45, 225, 45],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/5 w-16 h-16 rounded-full border-2 border-pink-200/20 dark:border-pink-400/15 will-change-transform"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 15,
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
            Наши услуги
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Предоставляем полный комплекс услуг по проектированию объектов
            различного назначения, от концепции до реализации
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
              onClick={() => handleServiceClick(service)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" variant="outline" onClick={handleMoreServicesClick}>
            Узнать больше о наших услугах
          </Button>
        </motion.div>
      </div>

      <ServiceModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={handleCloseServiceModal}
      />

      <AllServicesModal
        isOpen={isAllServicesOpen}
        onClose={handleCloseAllServicesModal}
      />

      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #a0aec0;
        }

        .dark .custom-scrollbar {
          scrollbar-color: #4a5568 transparent;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a5568;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #718096;
        }
      `}</style>
    </section>
  );
});

Services.displayName = "Services";
