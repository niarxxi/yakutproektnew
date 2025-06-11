"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/use-projects";
import { ProjectModal } from "./project-modal";
import type { ProjectImage } from "@/types/project";
import { Building2 } from "lucide-react";

export function Projects() {
  const { projectImages, projectCategories } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectImage | null>(
    null
  );
  const [visibleCount, setVisibleCount] = useState(8);
  const [mounted, setMounted] = useState(false);

  // Генерируем стабильные случайные значения только после монтирования
  const particleData = useMemo(() => {
    if (!mounted) return [];

    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 1920,
      initialY: Math.random() * 1080,
      targetX: Math.random() * 1920,
      targetY: Math.random() * 1080,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
  }, [mounted]);

  const buildingIconData = useMemo(() => {
    if (!mounted) return [];

    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 20 + i * 3,
      delay: i * 2,
    }));
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleCategorySelect = (event: CustomEvent) => {
      const { category } = event.detail;
      setSelectedCategory(category);
    };

    window.addEventListener(
      "selectProjectCategory",
      handleCategorySelect as EventListener
    );

    return () => {
      window.removeEventListener(
        "selectProjectCategory",
        handleCategorySelect as EventListener
      );
    };
  }, []);

  const filteredProjects =
    selectedCategory === "all"
      ? projectImages
      : projectImages.filter((project) => {
          const categoryMap: Record<string, string> = {
            living: "Жилые здания",
            public: "Общественные здания",
            health: "Медицинские учреждения",
            education: "Образовательные учреждения",
            sport: "Спортивные сооружения",
            plans: "Генеральные планы",
            agriculture: "Сельскохозяйственные объекты",
          };
          return project.category === categoryMap[selectedCategory];
        });

  const projectsToShow =
    selectedCategory === "all"
      ? filteredProjects.slice(0, visibleCount)
      : filteredProjects;
  const hasMoreProjects =
    selectedCategory === "all" && visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setVisibleCount(8);
    }
  };

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      {/* Плавающие частицы - рендерятся только после монтирования */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particleData.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-indigo-400 dark:bg-indigo-500 rounded-full opacity-60"
              initial={{
                x: particle.initialX,
                y: particle.initialY,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: [particle.initialX, particle.targetX],
                y: [particle.initialY, particle.targetY],
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Большие декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full border-2 border-indigo-200/30 dark:border-indigo-500/20"
          animate={{ rotate: 360 }}
          transition={{
            duration: 120,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-[15%] -left-[15%] w-[50%] h-[50%] rounded-full border-2 border-blue-200/30 dark:border-blue-500/20"
          animate={{ rotate: -360 }}
          transition={{
            duration: 150,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Архитектурные иконки - рендерятся только после монтирования */}
        {mounted &&
          buildingIconData.map((icon) => (
            <motion.div
              key={icon.id}
              className="absolute opacity-[0.05] dark:opacity-[0.1]"
              style={{
                top: `${icon.top}%`,
                left: `${icon.left}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: icon.duration,
                repeat: Number.POSITIVE_INFINITY,
                delay: icon.delay,
              }}
            >
              <Building2 className="w-12 h-12 text-indigo-500" />
            </motion.div>
          ))}
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
            Наши проекты
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Более 1000 реализованных проектов различной сложности и назначения
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => handleCategoryChange("all")}
            className="mb-2"
          >
            Все проекты
            <Badge variant="secondary" className="ml-2">
              {projectImages.length}
            </Badge>
          </Button>
          {projectCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              className="mb-2"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {projectsToShow.map((project, index) => (
              <motion.div
                key={project.src}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                  <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={project.src || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(
                          project.category
                        )}`;
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {project.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {hasMoreProjects && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={handleLoadMore}
              className="px-8 py-3"
            >
              Показать больше проектов
              <Badge variant="secondary" className="ml-2">
                +{Math.min(8, filteredProjects.length - visibleCount)}
              </Badge>
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Показано {visibleCount} из {filteredProjects.length} проектов
            </p>
          </motion.div>
        )}

        {projectsToShow.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-300">
              Проекты в данной категории не найдены
            </p>
          </motion.div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
