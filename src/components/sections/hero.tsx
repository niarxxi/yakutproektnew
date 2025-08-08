"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Play, Compass, Building, Ruler } from 'lucide-react'
import { Button } from "@/src/components/ui/button"
import { ContactModal } from "@/src/components/modals/contact-modal"
import { useIsMobile } from "@/src/hooks/use-mobile"

// Мемоизированный компонент для статистики с адаптивными размерами
const StatItem = ({
  stat,
  index,
}: {
  stat: { number: string; label: string }
  index: number
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      delay: 1.2 + index * 0.1,
      duration: 0.6,
      type: "spring",
      stiffness: 200,
    }}
    whileHover={{ y: -5 }}
    className="text-center min-w-0 flex-1"
  >
    <div className="relative">
      <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white mb-1 leading-tight">
        {stat.number}
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "40%" }}
        transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
        className="h-0.5 bg-black dark:bg-white mx-auto"
      />
    </div>
    <div className="text-xs xs:text-sm text-black dark:text-white font-medium mt-1 leading-tight">
      {stat.label}
    </div>
  </motion.div>
)

// Карточка проекта без закруглений и индикаторов
const ProjectCard = ({
  card,
  index,
  activeIndex,
  onClick,
}: {
  card: any
  index: number
  activeIndex: number
  onClick: () => void
}) => {
  // Определяем иконку внутри компонента
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'building':
        return <Building className="h-6 w-6" />
      case 'compass':
        return <Compass className="h-6 w-6" />
      case 'ruler':
        return <Ruler className="h-6 w-6" />
      default:
        return <Building className="h-6 w-6" />
    }
  }

  const isActive = activeIndex === index

  return (
    <motion.div
      key={`card-${index}`}
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        rotateY: -15,
        z: -100
      }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.9,
        rotateY: isActive ? 0 : 15,
        z: isActive ? 0 : -50,
        zIndex: isActive ? 20 : 10
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8,
        rotateY: 15,
        z: -100
      }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
        scale: { duration: 0.6 },
        rotateY: { duration: 0.7 },
      }}
      whileHover={{
        scale: isActive ? 1.02 : 0.9,
        rotateY: isActive ? -2 : 15,
        transition: { duration: 0.3 }
      }}
      className="absolute inset-0 overflow-hidden shadow-2xl cursor-pointer"
      style={{
        borderRadius: 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onClick={onClick}
    >
      {/* Фоновое изображение с анимацией */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${card.bgImage})`, borderRadius: 0 }}
        initial={{ scale: 1.1 }}
        animate={{ 
          scale: isActive ? 1 : 1.1,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Анимированное наложение */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0.6 }}
        animate={{ 
          opacity: isActive ? 0.8 : 0.6,
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Контент карточки с анимацией */}
      <div className="relative h-full flex flex-col p-6 text-white">
        {/* Верхняя часть с иконкой */}
        <motion.div 
          className="mb-auto"
          initial={{ y: -20, opacity: 0 }}
          animate={{ 
            y: isActive ? 0 : -10, 
            opacity: isActive ? 1 : 0.7 
          }}
          transition={{ 
            duration: 0.6, 
            delay: isActive ? 0.3 : 0,
            ease: "easeOut" 
          }}
        >
          <motion.div 
            className={`p-3 bg-gradient-to-br ${card.color} w-12 h-12 flex items-center justify-center mb-4`}
            style={{ borderRadius: 0 }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              transition: { duration: 0.2 }
            }}
            animate={{
              rotate: isActive ? [0, 2, -2, 0] : 0,
            }}
            transition={{
              rotate: { 
                duration: 2, 
                repeat: isActive ? Infinity : 0, 
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          >
            {getIcon(card.iconType)}
          </motion.div>
        </motion.div>

        {/* Нижняя часть с текстом */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: isActive ? 0 : 10, 
            opacity: isActive ? 1 : 0.8 
          }}
          transition={{ 
            duration: 0.6, 
            delay: isActive ? 0.4 : 0,
            ease: "easeOut" 
          }}
        >
          <motion.h3 
            className="text-2xl font-bold mb-3"
            animate={{
              scale: isActive ? 1 : 0.95,
            }}
            transition={{ duration: 0.4 }}
          >
            {card.title}
          </motion.h3>
          <motion.p 
            className="text-white/90 mb-4 text-base"
            animate={{
              opacity: isActive ? 1 : 0.8,
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {card.description}
          </motion.p>
          <motion.div 
            className="flex items-center text-[#B9DDFF] font-medium"
            whileHover={{ x: 5 }}
            animate={{
              x: isActive ? [0, 3, 0] : 0,
            }}
            transition={{
              x: { 
                duration: 1.5, 
                repeat: isActive ? Infinity : 0, 
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          >
            Подробнее
            <motion.div
              animate={{
                x: isActive ? [0, 3, 0] : 0,
              }}
              transition={{
                duration: 1.5, 
                repeat: isActive ? Infinity : 0, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const isMobile = useIsMobile()

  // Для синхронизации смены карточки с canvas
  const hasSwitchedRef = useRef(false)
  const projectCards = useMemo(
    () => [
      {
        title: "Жилые комплексы",
        description: "Современные жилые здания с комфортной средой",
        iconType: "building",
        color: "from-[#0D2B52] to-[#1B3644]",
        bgImage: "/images/projects/LivingBuilding/LB1.webp",
        category: "living",
      },
      {
        title: "Общественные здания",
        description: "Функциональные пространства для общественной жизни",
        iconType: "compass",
        color: "from-[#1B3644] to-[#303030]",
        bgImage: "/images/projects/PublicBuildings/PB1.webp",
        category: "public",
      },
      {
        title: "Генеральные планы",
        description: "Комплексное развитие территорий и инфраструктуры",
        iconType: "ruler",
        color: "from-[#303030] to-[#0D2B52]",
        bgImage: "/images/projects/GeneralPlans/GP1.webp",
        category: "plans",
      },
    ],
    [],
  )

  // Мемоизированные статистические данные
  const stats = useMemo(
    () => [
      { number: "20+", label: "Лет опыта" },
      { number: "1000+", label: "Проектов" },
      { number: "14", label: "Отделов" },
      { number: "150+", label: "Специалистов" },
    ],
    [],
  )

  // Параллакс эффекты
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])

  const scrollToProjects = useCallback(() => {
    const element = document.querySelector("#projects")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const scrollToProjectsWithCategory = useCallback((categoryType: string) => {
    const element = document.querySelector("#projects")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setTimeout(() => {
        const event = new CustomEvent("selectProjectCategory", {
          detail: { category: categoryType },
        })
        window.dispatchEvent(event)
      }, 1000)
    }
  }, [])

  // CANVAS анимация и синхронизация смены карточки
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let startTime = Date.now()
    const animationDuration = 3000 // 3 seconds

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      // Reset animation if completed
      if (elapsed > animationDuration + 2000) {
        startTime = currentTime
        hasSwitchedRef.current = false // сбрасываем флаг на новый цикл
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Light theme colors
      const lightColors = ["#0D2B52", "#1B3644", "#303030"]
      // Dark theme colors
      const darkColors = ["#F5F5F7", "#B9DDFF", "#DEDEBE"]

      // Check if dark mode
      const isDark = document.documentElement.classList.contains("dark")
      const colors = isDark ? darkColors : lightColors

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, colors[0])
      gradient.addColorStop(0.5, colors[1])
      gradient.addColorStop(1, colors[2])

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2

      // Получить текущее значение opacity из scrollY
      const currentOpacity = Math.max(0, 1 - scrollY.get() / 300)
      ctx.globalAlpha = currentOpacity * 0.6 // 0.6 - базовая прозрачность

      // Центральная точка пересечения
      const centerX = canvas.width * 0.5
      const centerY = canvas.height * 0.5

      // Horizontal line (left to right) - через весь компонент
      const horizontalProgress = Math.min((elapsed - 0) / 1500, 1)
      if (horizontalProgress > 0) {
        const startX = 0
        const endX = canvas.width
        const currentX = startX + (endX - startX) * horizontalProgress

        ctx.beginPath()
        ctx.moveTo(startX, centerY)
        ctx.lineTo(currentX, centerY)
        ctx.stroke()
      }

      // Vertical line (сверху вниз) - на всю высоту компонента
      const verticalProgress = Math.min((elapsed - 500) / 1500, 1)
      if (verticalProgress > 0) {
        const startY = canvas.height // С самого верха
        const endY = canvas.height * 0.05 // До самого низа
        const currentY = startY + (endY - startY) * verticalProgress

        ctx.beginPath()
        ctx.moveTo(centerX, startY)
        ctx.lineTo(centerX, currentY)
        ctx.stroke()
      }

      // Diagonal line (bottom-left to top-right) - через весь компонент
      const diagonalProgress = Math.min((elapsed - 1000) / 2000, 1)
      if (diagonalProgress > 0) {
        const startX = 0
        const startY = canvas.height
        const endX = canvas.width
        const endY = 0

        const currentX = startX + (endX - startX) * diagonalProgress
        const currentY = startY + (endY - startY) * diagonalProgress

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(currentX, currentY)
        ctx.stroke()
      }

      // === СИНХРОНИЗАЦИЯ ===
      // Когда горизонтальная и вертикальная линии доходят до конца (progress >= 1)
      if (
        horizontalProgress >= 1 &&
        verticalProgress >= 1 &&
        !hasSwitchedRef.current
      ) {
        setActiveIndex((prev) => (prev + 1) % projectCards.length)
        hasSwitchedRef.current = true
      }

      // Сбросить globalAlpha
      ctx.globalAlpha = 1

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
    // eslint-disable-next-line
  }, [scrollY, projectCards.length])

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden md:pt-0 pt-20"
    >
      {/* Декоративные линии на Canvas - скрыты на экранах меньше 1024px */}
      <motion.canvas 
        ref={canvasRef} 
        style={{ opacity, scale }}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block" 
      />

      {/* Основной контент */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col h-full justify-center mt-16">
        {/* Левая часть с текстом */}
        <motion.div 
          style={{ opacity, scale }} 
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-center"
          >
            <div className="relative mb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm uppercase tracking-widest text-[#0D2B52] dark:text-[#B9DDFF] font-medium"
              >
                Республиканский проектно-изыскательский институт
              </motion.h2>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 mt-4"
            >
              <span className="block brand-text text-dark-2 dark:text-white">Проектируем</span>
              <span className="relative">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0D2B52] via-[#1B3644] to-[#0D2B52] dark:from-[#B9DDFF] dark:via-white dark:to-[#B9DDFF] bg-size-200 animate-gradient pb-4 brand-text">
                  будущее Якутии
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-black dark:text-white mb-8 max-w-lg mt-16"
            >
              Ведущий проектный институт с более чем 20-летним опытом. Создаем архитектурные решения, которые формируют
              облик региона.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0D2B52] to-[#1B3644] dark:from-[#B9DDFF] dark:to-white blur opacity-60 group-hover:opacity-100 transition duration-200" style={{ borderRadius: 0 }} />
                <Button
                  size="lg"
                  onClick={() => setIsContactOpen(true)}
                  className="relative bg-white dark:bg-[#0D2B52] text-black dark:text-white hover:text-white dark:hover:text-white hover:bg-[#0D2B52] dark:hover:bg-[#B9DDFF] dark:hover:text-black border-0 px-8 py-6 text-lg font-medium"
                  style={{ borderRadius: 0 }}
                >
                  <span className="relative z-10 flex items-center">
                    Оставить заявку
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0D2B52] to-[#1B3644] dark:from-[#B9DDFF] dark:to-white blur opacity-60 group-hover:opacity-100 transition duration-200" style={{ borderRadius: 0 }} />
                <Button
                  size="lg"
                  onClick={scrollToProjects}
                  className="relative bg-white dark:bg-[#0D2B52] text-black dark:text-white hover:text-white dark:hover:text-white hover:bg-[#0D2B52] dark:hover:bg-[#B9DDFF] dark:hover:text-black border-0 px-8 py-6 text-lg font-medium"
                  style={{ borderRadius: 0 }}
                >
                  <span className="relative z-10 flex items-center">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Наши проекты
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Статистика с адаптивной сеткой и ограниченной шириной */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 md:gap-6 mt-4 w-full max-w-lg lg:max-w-md xl:max-w-lg"
            >
              {stats.map((stat, index) => (
                <StatItem key={index} stat={stat} index={index} />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Контейнер с проектами */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ opacity, scale }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-1/2 left-1/2 right-0 bottom-0 hidden lg:block z-20"
      >
        <div className="relative h-full w-full" style={{ borderRadius: 0, perspective: "1000px" }}>
          {/* Карточки проектов с AnimatePresence */}
          <AnimatePresence mode="wait">
            {projectCards.map((card, index) => (
              <ProjectCard
                key={`${index}-${activeIndex}`}
                card={card}
                index={index}
                activeIndex={activeIndex}
                onClick={() => scrollToProjectsWithCategory(card.category)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Стили для анимации градиента */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .bg-size-200 {
          background-size: 200% auto;
        }

        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </section>
  )
}
