"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play, ChevronDown, Compass, Building, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactModal } from "./contact-modal"
import { useIsMobile } from "@/hooks/use-mobile"

// Мемоизированный компонент для статистики
const StatItem = ({ stat, index }: { stat: { number: string; label: string }; index: number }) => (
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
      <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "40%" }}
        transition={{ duration: 1, delay: 1.5 + index * 0.1 }}
        className="h-0.5 bg-blue-500 mx-auto"
      />
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
  </motion.div>
)

// Мемоизированный компонент для карточек проектов
const ProjectCard = ({
  card,
  index,
  activeIndex,
  hoveredCard,
  mousePosition,
  onHover,
  onLeave,
  onClick,
}: {
  card: any
  index: number
  activeIndex: number
  hoveredCard: number | null
  mousePosition: { x: number; y: number }
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}) => (
  <motion.div
    className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 will-change-transform ${
      activeIndex === index ? "z-20 opacity-100" : "z-10 opacity-0"
    }`}
    initial={false}
    animate={{
      rotateY: activeIndex === index ? 0 : 30,
      scale: activeIndex === index ? 1 : 0.9,
      x: activeIndex === index ? mousePosition.x * 20 - 10 : 0,
      y: activeIndex === index ? mousePosition.y * 20 - 10 : 0,
    }}
    transition={{ duration: 0.7 }}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    style={{ willChange: "transform" }}
  >
    {/* Фоновое изображение с наложением */}
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${card.bgImage})` }} />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/70 to-gray-900/90" />

    {/* Контент карточки */}
    <div className="relative h-full flex flex-col p-8 text-white">
      {/* Верхняя часть с иконкой */}
      <div className="mb-auto">
        <motion.div
          className={`p-4 rounded-xl bg-gradient-to-br ${card.color} w-16 h-16 flex items-center justify-center mb-6 will-change-transform`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          animate={
            hoveredCard === index
              ? { y: [0, -10, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 } }
              : {}
          }
        >
          {card.icon}
        </motion.div>
      </div>

      {/* Нижняя часть с текстом */}
      <div>
        <motion.h3 className="text-3xl font-bold mb-4" animate={hoveredCard === index ? { scale: 1.05 } : { scale: 1 }}>
          {card.title}
        </motion.h3>
        <p className="text-gray-200 mb-6 text-lg">{card.description}</p>

        <motion.div
          className="flex items-center text-blue-300 font-medium cursor-pointer"
          initial={{ x: 0 }}
          animate={hoveredCard === index ? { x: 10 } : { x: 0 }}
          onClick={onClick}
        >
          Подробнее
          <ArrowRight className="ml-2 h-4 w-4" />
        </motion.div>
      </div>

      {/* Декоративные элементы */}
      <motion.div
        className="absolute top-6 right-6 w-20 h-20 rounded-full border-2 border-dashed border-white/30 will-change-transform"
        animate={hoveredCard === index ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-16 h-16 rounded-full border border-white/20 will-change-transform"
        animate={hoveredCard === index ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Интерактивные точки */}
      {hoveredCard === index && (
        <>
          <motion.div
            className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-blue-400 will-change-transform"
            animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-1/3 left-8 w-3 h-3 rounded-full bg-purple-400 will-change-transform"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          />
        </>
      )}
    </div>
  </motion.div>
)

export function Hero() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const isMobile = useIsMobile()

  // Параллакс эффекты с оптимизацией
  const y1 = useTransform(scrollY, [0, 500], [0, -150])
  const y2 = useTransform(scrollY, [0, 500], [0, -50])
  const y3 = useTransform(scrollY, [0, 500], [0, -200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.9])

  // Оптимизированное отслеживание движения мыши
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (container && !isMobile) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true })
      return () => container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleMouseMove, isMobile])

  // Автоматическое переключение активного элемента
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
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
        color: "from-blue-500 to-cyan-500",
        bgImage: "/images/projects/LivingBuilding/LB1.webp",
        category: "living",
      },
      {
        title: "Общественные здания",
        description: "Функциональные пространства для общественной жизни",
        icon: <Compass className="h-8 w-8" />,
        color: "from-purple-500 to-pink-500",
        bgImage: "/images/projects/PublicBuildings/PB1.webp",
        category: "public",
      },
      {
        title: "Генеральные планы",
        description: "Комплексное развитие территорий и инфраструктуры",
        icon: <Ruler className="h-8 w-8" />,
        color: "from-amber-500 to-orange-500",
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

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden md:pt-0 pt-16"
    >
      {/* Оптимизированные декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Большой круг */}
        <motion.div
          className="absolute -right-[20%] -top-[10%] w-[60%] h-[60%] rounded-full border border-blue-200/20 dark:border-blue-500/10 will-change-transform"
          style={{ y: y1 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Средний круг */}
        <motion.div
          className="absolute -left-[10%] -bottom-[20%] w-[40%] h-[40%] rounded-full border border-purple-200/20 dark:border-purple-500/10 will-change-transform"
          style={{ y: y2 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Маленький круг */}
        <motion.div
          className="absolute right-[10%] bottom-[20%] w-[20%] h-[20%] rounded-full border border-amber-200/20 dark:border-amber-500/10 will-change-transform"
          style={{ y: y3 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Архитектурные линии */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 Q25,30 50,50 T100,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", repeatDelay: 2 }}
          />
          <motion.path
            d="M0,30 Q40,60 60,30 T100,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", repeatDelay: 1 }}
          />
          <motion.path
            d="M0,70 Q50,40 70,70 T100,70"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", repeatDelay: 3 }}
          />
        </svg>
      </div>

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
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full -top-4 left-0"
              />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm uppercase tracking-widest text-blue-600 dark:text-blue-400 font-medium"
              >
                Республиканский проектно-изыскательский институт
              </motion.h2>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="block">Проектируем</span>
              <span className="relative">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 animate-gradient pb-4">
                  будущее Якутии
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 origin-left"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mt-4"
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
                <Button
                  size="lg"
                  onClick={() => setIsContactOpen(true)}
                  className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:text-white dark:hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 border-0 px-8 py-6 text-lg font-medium"
                >
                  <span className="relative z-10 flex items-center">
                    Оставить заявку
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToProjects}
                  className="px-8 py-6 text-lg font-medium border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Наши проекты
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
            className="relative h-[500px] hidden lg:block"
          >
            <div className="relative h-full w-full">
              {/* Карточки проектов с новыми эффектами */}
              <div className="relative h-full w-full">
                {projectCards.map((card, index) => (
                  <ProjectCard
                    key={index}
                    card={card}
                    index={index}
                    activeIndex={activeIndex}
                    hoveredCard={hoveredCard}
                    mousePosition={mousePosition}
                    onHover={() => setHoveredCard(index)}
                    onLeave={() => setHoveredCard(null)}
                    onClick={() => scrollToProjectsWithCategory(card.category)}
                  />
                ))}
              </div>

              {/* Индикаторы */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {projectCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeIndex === index ? "bg-blue-600 dark:bg-blue-400 scale-125" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    aria-label={`Показать проект ${index + 1}`}
                  />
                ))}
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
        className="absolute bottom-8 left-0 right-0 mx-auto w-full flex justify-center items-center"
        onClick={scrollToNextSection}
      >
        <div className="flex flex-col items-center cursor-pointer">
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Узнать больше</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="will-change-transform"
          >
            <ChevronDown className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </motion.div>
        </div>
      </motion.div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Стили для анимации градиента */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
