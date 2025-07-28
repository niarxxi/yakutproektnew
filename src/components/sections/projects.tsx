"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { useProjects } from "@/src/hooks/use-projects"
import { ProjectModal } from "@/src/components/modals/project-modal"
import type { ProjectImage } from "@/src/types/project"
import { ChevronDown, Grid3x3, List } from "lucide-react"

export function Projects() {
  const { projectImages, projectCategories } = useProjects()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProject, setSelectedProject] = useState<ProjectImage | null>(null)
  const [visibleCount, setVisibleCount] = useState(8)
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Генерируем стабильные случайные значения только после монтирования
  const particleData = useMemo(() => {
    if (!mounted) return []

    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 1920,
      initialY: Math.random() * 1080,
      targetX: Math.random() * 1920,
      targetY: Math.random() * 1080,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }))
  }, [mounted])

  const buildingIconData = useMemo(() => {
    if (!mounted) return []

    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 20 + i * 3,
      delay: i * 2,
    }))
  }, [mounted])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleCategorySelect = (event: CustomEvent) => {
      const { category } = event.detail
      setSelectedCategory(category)
    }

    window.addEventListener("selectProjectCategory", handleCategorySelect as EventListener)

    return () => {
      window.removeEventListener("selectProjectCategory", handleCategorySelect as EventListener)
    }
  }, [])

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
          }
          return project.category === categoryMap[selectedCategory]
        })

  const projectsToShow = selectedCategory === "all" ? filteredProjects.slice(0, visibleCount) : filteredProjects
  const hasMoreProjects = selectedCategory === "all" && visibleCount < filteredProjects.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsMobileMenuOpen(false) // Закрываем мобильное меню при выборе категории
    if (categoryId === "all") {
      setVisibleCount(8)
    }
  }

  const getCurrentCategoryName = () => {
    if (selectedCategory === "all") return "Все проекты"
    const category = projectCategories.find((cat) => cat.id === selectedCategory)
    return category ? category.name : "Все проекты"
  }

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      {/* Убираем все декоративные анимации */}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Наши проекты</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Более 1000 реализованных проектов различной сложности и назначения
          </p>
        </motion.div>

        {/* Desktop Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="hidden md:flex flex-wrap justify-center gap-2 mb-12"
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

        {/* Mobile Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="md:hidden mb-8"
        >
          <div className="relative">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-lg"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <Grid3x3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium text-gray-900 dark:text-white">{getCurrentCategoryName()}</span>
                <Badge variant="secondary">
                  {selectedCategory === "all"
                    ? projectImages.length
                    : projectCategories.find((cat) => cat.id === selectedCategory)?.count || 0}
                </Badge>
              </div>
              <motion.div animate={{ rotate: isMobileMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                    transition: {
                      height: { duration: 0.4, ease: "easeOut" },
                      opacity: { duration: 0.3, delay: 0.1 },
                      y: { duration: 0.3, delay: 0.1 },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    y: -10,
                    transition: {
                      height: { duration: 0.3, ease: "easeIn" },
                      opacity: { duration: 0.2 },
                      y: { duration: 0.2 },
                    },
                  }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-2 space-y-1">
                    <motion.button
                      onClick={() => handleCategoryChange("all")}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === "all"
                          ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <List className="w-4 h-4" />
                        <span>Все проекты</span>
                      </div>
                      <Badge variant={selectedCategory === "all" ? "default" : "secondary"}>
                        {projectImages.length}
                      </Badge>
                    </motion.button>

                    {projectCategories.map((category, index) => (
                      <motion.button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { delay: index * 0.05 },
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-left">{category.name}</span>
                        </div>
                        <Badge variant={selectedCategory === category.id ? "default" : "secondary"}>
                          {category.count}
                        </Badge>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img
                      src={project.src || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(
                          project.category,
                        )}`
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {project.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{project.description}</p>
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
            <Button size="lg" variant="outline" onClick={handleLoadMore} className="px-8 py-3 bg-transparent">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Проекты в данной категории не найдены</p>
          </motion.div>
        )}
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}
