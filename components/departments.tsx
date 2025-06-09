"use client"

import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useEffect, useState, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import { useDepartments } from "@/hooks/use-departments"
import { Badge } from "@/components/ui/badge"

// Константы для лучшей читаемости и поддержки
const AUTOPLAY_INTERVAL = 5000
const ANIMATION_DURATION = 0.4
const TEXT_ANIMATION_DELAY = 0.02
const MAX_ROTATION = 10

// Компонент для кнопок навигации
const NavigationButton = ({ 
  onClick, 
  children, 
  className = "" 
}: { 
  onClick: () => void
  children: React.ReactNode
  className?: string 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
      "flex items-center justify-center group/button transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
      className
    )}
  >
    {children}
  </button>
)

// Компонент для индикаторов точек
const DotIndicator = ({ 
  isActive, 
  onClick 
}: { 
  isActive: boolean
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "h-2 rounded-full transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
      isActive
        ? "bg-blue-600 dark:bg-blue-400 w-6"
        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2"
    )}
  />
)

// Компонент для анимированных частиц фона
const BackgroundParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 15 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-cyan-400 dark:bg-cyan-500 rounded-full opacity-40"
        animate={{
          x: [Math.random() * 1920, Math.random() * 1920],
          y: [Math.random() * 1080, Math.random() * 1080],
          scale: [0, 1, 0],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: Math.random() * 4 + 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>
)

// Компонент для анимированного текста
const AnimatedText = ({ text, active }: { text: string, active: number }) => {
  const words = useMemo(() => text.split(" "), [text])
  
  return (
    <motion.p 
      key={active}
      className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{
            filter: "blur(10px)",
            opacity: 0,
            y: 5,
          }}
          animate={{
            filter: "blur(0px)",
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
            delay: TEXT_ANIMATION_DELAY * index,
          }}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.p>
  )
}

export const Departments = ({
  autoplay = true,
  className,
}: {
  autoplay?: boolean
  className?: string
}) => {
  const departments = useDepartments()
  const [active, setActive] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)

  // Мемоизированные функции для навигации
  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % departments.length)
  }, [departments.length])

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + departments.length) % departments.length)
  }, [departments.length])

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setActive(index)
  }, [])

  // Функция для генерации случайного угла поворота
  const randomRotateY = useCallback(() => {
    return Math.floor(Math.random() * (MAX_ROTATION * 2 + 1)) - MAX_ROTATION
  }, [])

  // Эффект для автопрокрутки
  useEffect(() => {
    if (!isPlaying || departments.length <= 1) return

    const interval = setInterval(handleNext, AUTOPLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [isPlaying, handleNext, departments.length])

  // Обработка клавиатурных событий
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handlePrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNext()
          break
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, togglePlayPause])

  // Мемоизированные компоненты навигации
  const navigationButtons = useMemo(() => (
    <>
      <NavigationButton onClick={handlePrev}>
        <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/button:rotate-12 transition-transform duration-300" />
      </NavigationButton>
      <NavigationButton onClick={togglePlayPause}>
        {isPlaying ? (
          <Pause className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/button:scale-110 transition-transform duration-300" />
        ) : (
          <Play className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/button:scale-110 transition-transform duration-300 ml-0.5" />
        )}
      </NavigationButton>
      <NavigationButton onClick={handleNext}>
        <ArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/button:-rotate-12 transition-transform duration-300" />
      </NavigationButton>
    </>
  ), [handlePrev, togglePlayPause, handleNext, isPlaying])

  const currentDepartment = departments[active]

  if (!departments.length) {
    return null
  }

  return (
    <section 
      id="departments" 
      className="relative py-20 overflow-hidden"
      role="region"
      aria-label="Отделы компании"
    >
      <BackgroundParticles />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Наша команда
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            14 специализированных отделов объединяют более 150 профессионалов для комплексного подхода к проектированию
          </p>
        </motion.div>

        <div className={cn("max-w-sm md:max-w-6xl mx-auto px-4 md:px-8 lg:px-12", className)}>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Section */}
            <div>
              <div className="relative h-80 md:h-96 w-full">
                <AnimatePresence mode="wait">
                  {departments.map((department, index) => (
                    <motion.div
                      key={department.id}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        z: -100,
                        rotate: randomRotateY(),
                      }}
                      animate={{
                        opacity: index === active ? 1 : 0.7,
                        scale: index === active ? 1 : 0.95,
                        z: index === active ? 0 : -100,
                        rotate: index === active ? 0 : randomRotateY(),
                        zIndex: index === active ? 999 : departments.length + 2 - index,
                        y: index === active ? [0, -20, 0] : 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        z: 100,
                        rotate: randomRotateY(),
                      }}
                      transition={{
                        duration: ANIMATION_DURATION,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 origin-bottom"
                    >
                      <div className="relative h-full w-full rounded-3xl overflow-hidden">
                        <Image
                          src={
                            department.image ||
                            `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(department.name)}`
                          }
                          alt={`Отдел ${department.name}`}
                          width={600}
                          height={400}
                          draggable={false}
                          className="h-full w-full object-cover object-center"
                          loading={index === active ? "eager" : "lazy"}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(department.name)}`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            {department.icon}
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              {department.specialists} специалистов
                            </Badge>
                            {department.projects > 0 && (
                              <Badge variant="secondary" className="bg-green-500/20 text-white border-green-300/30">
                                {department.projects} проектов
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Mobile Navigation */}
              <div className="flex lg:hidden justify-center gap-4 mt-6">
                {navigationButtons}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex justify-between flex-col py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {currentDepartment.name}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Руководитель: {currentDepartment.head}
                  </p>

                  <AnimatedText text={currentDepartment.description} active={active} />

                  {/* Specializations */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Специализации:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentDepartment.specializations.map((spec, index) => (
                        <motion.div
                          key={`${active}-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Badge
                            variant="outline"
                            className={cn(
                              currentDepartment.projects > 0
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                : "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                            )}
                          >
                            {spec}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex gap-4 pt-8">
                {navigationButtons}
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-6" role="tablist">
                {departments.map((_, index) => (
                  <DotIndicator
                    key={index}
                    isActive={index === active}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}