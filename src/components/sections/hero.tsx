"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play, ChevronDown, Compass, Building, Ruler } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { ContactModal } from "@/src/components/modals/contact-modal"
import { useIsMobile } from "@/src/hooks/use-mobile"

// Мемоизированный компонент для статистики
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
    className="text-center"
  >
    <div className="relative">
      <div className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-1">{stat.number}</div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "40%" }}
        transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
        className="h-0.5 bg-black dark:bg-white mx-auto"
      />
    </div>
    <div className="text-sm text-black dark:text-white font-medium">{stat.label}</div>
  </motion.div>
)

// Мемоизированный компонент для карточек проектов
const ProjectCard = ({
  card,
  index,
  activeIndex,
  hoveredCard,
  onHover,
  onLeave,
  onClick,
}: {
  card: any
  index: number
  activeIndex: number
  hoveredCard: number | null
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}) => (
  <motion.div
    className={`absolute inset-0 rounded-2xl rounded-tl-none rounded-bl-none overflow-hidden shadow-2xl cursor-pointer ${
      activeIndex === index ? "z-20" : "z-10"
    }`}
    initial={false}
    animate={{
      opacity: activeIndex === index ? 1 : 0,
      scale: activeIndex === index ? 1 : 0.8,
      rotateX: activeIndex === index ? 0 : -15,
      filter: activeIndex === index ? "blur(0px)" : "blur(4px)",
    }}
    transition={{
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    onClick={onClick}
    style={{
      willChange: "transform, opacity, filter",
      transformStyle: "preserve-3d",
    }}
  >
    {/* Фоновое изображение с параллакс эффектом */}
    <motion.div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${card.bgImage})` }}
      animate={{
        scale: hoveredCard === index ? 1.1 : 1,
      }}
      transition={{ duration: 0.6 }}
    />

    {/* Динамическое наложение */}
    <motion.div
      className="absolute inset-0"
      animate={{
        background:
          hoveredCard === index
            ? "linear-gradient(135deg, rgba(13,43,82,0.3) 0%, rgba(27,54,68,0.7) 50%, rgba(13,43,82,0.9) 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(13,43,82,0.7) 70%, rgba(13,43,82,0.9) 100%)",
      }}
      transition={{ duration: 0.4 }}
    />

    {/* Контент карточки */}
    <div className="relative h-full flex flex-col p-8 text-white">
      {/* Верхняя часть с иконкой */}
      <div className="mb-auto">
        <motion.div
          className={`p-4 rounded-xl bg-gradient-to-br ${card.color} w-16 h-16 flex items-center justify-center mb-6`}
          animate={{
            rotate: hoveredCard === index ? [0, -5, 5, 0] : 0,
            scale: hoveredCard === index ? 1.1 : 1,
            boxShadow: hoveredCard === index ? "0 20px 40px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.2)",
          }}
          transition={{
            rotate: { duration: 0.6, ease: "easeInOut" },
            scale: { duration: 0.3 },
            boxShadow: { duration: 0.3 },
          }}
        >
          {card.icon}
        </motion.div>
      </div>

      {/* Нижняя часть с текстом */}
      <motion.div
        animate={{
          y: hoveredCard === index ? -10 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.h3
          className="text-3xl font-bold mb-4"
          animate={{
            scale: hoveredCard === index ? 1.05 : 1,
            textShadow: hoveredCard === index ? "0 4px 8px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
          }}
          transition={{ duration: 0.3 }}
        >
          {card.title}
        </motion.h3>

        <motion.p
          className="text-white mb-6 text-lg"
          animate={{
            opacity: hoveredCard === index ? 1 : 0.9,
          }}
          transition={{ duration: 0.3 }}
        >
          {card.description}
        </motion.p>

        <motion.div
          className="flex items-center text-[#B9DDFF] font-medium cursor-pointer"
          animate={{
            x: hoveredCard === index ? 10 : 0,
            color: hoveredCard === index ? "#FFFFFF" : "#B9DDFF",
          }}
          transition={{ duration: 0.3 }}
        >
          Подробнее
          <motion.div
            animate={{
              x: hoveredCard === index ? 5 : 0,
              rotate: hoveredCard === index ? 45 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Анимированные частицы */}
      {hoveredCard === index && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#B9DDFF]"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </div>

    {/* Граница при наведении */}
    <motion.div
      className="absolute inset-0 rounded-2xl rounded-tl-none rounded-bl-none border-2 border-[#B9DDFF]"
      initial={{ opacity: 0 }}
      animate={{
        opacity: hoveredCard === index ? 0.6 : 0,
      }}
      transition={{ duration: 0.3 }}
    />
  </motion.div>
)

export function Hero() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const isMobile = useIsMobile()

  // Параллакс эффекты с оптимизацией
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])

  // Автоматическое переключение активного элемента
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Мемоизированные функции обработки событий
  const handleHover = useCallback((index: number) => {
    setHoveredCard(index)
  }, [])

  const handleLeave = useCallback(() => {
    setHoveredCard(null)
  }, [])

  // Мемоизированные функции навигации
  const scrollToProjects = useCallback(() => {
    const element = document.querySelector("#projects")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const scrollToNextSection = useCallback(() => {
    const element = document.querySelector("#about")
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

  // Мемоизированные данные для карточек проектов
  const projectCards = useMemo(
    () => [
      {
        title: "Жилые комплексы",
        description: "Современные жилые здания с комфортной средой",
        icon: <Building className="h-8 w-8" />,
        color: "from-[#0D2B52] to-[#1B3644]",
        bgImage: "/images/projects/LivingBuilding/LB1.webp",
        category: "living",
      },
      {
        title: "Общественные здания",
        description: "Функциональные пространства для общественной жизни",
        icon: <Compass className="h-8 w-8" />,
        color: "from-[#1B3644] to-[#303030]",
        bgImage: "/images/projects/PublicBuildings/PB1.webp",
        category: "public",
      },
      {
        title: "Генеральные планы",
        description: "Комплексное развитие территорий и инфраструктуры",
        icon: <Ruler className="h-8 w-8" />,
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

    // Animation variables
    let startTime = Date.now()
    const animationDuration = 3000 // 3 seconds

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      // Reset animation if completed
      if (elapsed > animationDuration + 2000) {
        startTime = currentTime
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

      // Vertical line (снизу вверх) - от "Узнать больше" до header
      const verticalProgress = Math.min((elapsed - 500) / 1500, 1)
      if (verticalProgress > 0) {
        const startY = canvas.height * 0.93 // Начать снизу от "Узнать больше"
        const endY = canvas.height * 0.1 // До header
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
  }, [scrollY])

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden md:pt-0 pt-20"
    >
      {/* Декоративные линии на Canvas - скрыты на экранах меньше 1024px */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block" />

      {/* Основной контент */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col h-full justify-center">
        <motion.div style={{ opacity, scale }} className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Левая колонка - текст */}
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
              className="text-lg md:text-xl text-black dark:text-white mb-8 max-w-lg mt-12"
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0D2B52] to-[#1B3644] dark:from-[#B9DDFF] dark:to-white rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
                <Button
                  size="lg"
                  onClick={() => setIsContactOpen(true)}
                  className="relative bg-white dark:bg-[#0D2B52] text-black dark:text-white hover:text-white dark:hover:text-white hover:bg-[#0D2B52] dark:hover:bg-[#B9DDFF] dark:hover:text-black border-0 px-8 py-6 text-lg font-medium"
                >
                  <span className="relative z-10 flex items-center">
                    Оставить заявку
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0D2B52] to-[#1B3644] dark:from-[#B9DDFF] dark:to-white rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
                <Button
                  size="lg"
                  onClick={scrollToProjects}
                  className="relative bg-white dark:bg-[#0D2B52] text-black dark:text-white hover:text-white dark:hover:text-white hover:bg-[#0D2B52] dark:hover:bg-[#B9DDFF] dark:hover:text-black border-0 px-8 py-6 text-lg font-medium"
                >
                  <span className="relative z-10 flex items-center">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Наши проекты
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Статистика */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-4"
            >
              {stats.map((stat, index) => (
                <StatItem key={index} stat={stat} index={index} />
              ))}
            </motion.div>
          </motion.div>

          {/* Правая колонка - карточки проектов */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Фиксированный контейнер под горизонтальной линией и впритык к вертикальной */}
            <div className="absolute top-[50%] -left-6 h-[375px] w-[500px] xl:w-[830px] xl:h-[405px]">
              <div className="relative h-full w-full">
                {projectCards.map((card, index) => (
                  <ProjectCard
                    key={index}
                    card={card}
                    index={index}
                    activeIndex={activeIndex}
                    hoveredCard={hoveredCard}
                    onHover={() => handleHover(index)}
                    onLeave={handleLeave}
                    onClick={() => scrollToProjectsWithCategory(card.category)}
                  />
                ))}

                {/* Индикаторы справа от контейнера */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-16 flex flex-col space-y-4">
                  {projectCards.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        activeIndex === index ? "bg-[#0D2B52] dark:bg-[#B9DDFF]" : "bg-black/30 dark:bg-white/30"
                      }`}
                      animate={{
                        scale: activeIndex === index ? 1.25 : 1,
                      }}
                      whileHover={{ scale: activeIndex === index ? 1.4 : 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      aria-label={`Показать проект ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Скролл вниз */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-1 left-0 right-0 mx-auto w-full flex justify-center items-center"
        onClick={scrollToNextSection}
      >
        <div className="flex flex-col items-center cursor-pointer">
          <span className="text-sm text-black/70 dark:text-white/70 mb-2">Узнать больше</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="will-change-transform"
          >
            <ChevronDown className="h-6 w-6 text-black/70 dark:text-white/70" />
          </motion.div>
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