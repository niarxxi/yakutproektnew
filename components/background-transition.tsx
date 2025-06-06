"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function BackgroundTransition() {
  const [sectionHeights, setSectionHeights] = useState({
    hero: 0,
    about: 0,
    services: 0,
    projects: 0,
    departments: 0,
    partners: 0,
    contacts: 0,
  })

  const { scrollY } = useScroll()

  // Мемоизируем функцию обновления высот
  const updateSectionHeights = useCallback(() => {
    const sections = {
      hero: document.getElementById("home"),
      about: document.getElementById("about"),
      services: document.getElementById("services"),
      projects: document.getElementById("projects"),
      departments: document.getElementById("departments"),
      partners: document.getElementById("partners"),
      contacts: document.getElementById("contacts"),
    }

    const heights: any = {}
    Object.entries(sections).forEach(([key, element]) => {
      if (element) {
        heights[key] = element.offsetHeight
      }
    })

    setSectionHeights(heights)
  }, [])

  useEffect(() => {
    updateSectionHeights()

    // Дебаунс для resize события
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateSectionHeights, 150)
    }

    window.addEventListener("resize", debouncedResize)
    return () => {
      window.removeEventListener("resize", debouncedResize)
      clearTimeout(timeoutId)
    }
  }, [updateSectionHeights])

  // Мемоизируем вычисления кумулятивных высот
  const cumulativeHeights = useMemo(
    () => ({
      hero: 0,
      about: sectionHeights.hero,
      services: sectionHeights.hero + sectionHeights.about,
      projects: sectionHeights.hero + sectionHeights.about + sectionHeights.services,
      departments: sectionHeights.hero + sectionHeights.about + sectionHeights.services + sectionHeights.projects,
      partners:
        sectionHeights.hero +
        sectionHeights.about +
        sectionHeights.services +
        sectionHeights.projects +
        sectionHeights.departments,
      contacts:
        sectionHeights.hero +
        sectionHeights.about +
        sectionHeights.services +
        sectionHeights.projects +
        sectionHeights.departments +
        sectionHeights.partners,
    }),
    [sectionHeights],
  )

  // Мемоизируем функцию создания переходов
  const createTransition = useCallback(
    (fromSection: keyof typeof cumulativeHeights, toSection: keyof typeof cumulativeHeights) => {
      const start = cumulativeHeights[fromSection] + sectionHeights[fromSection] * 0.5
      const end = cumulativeHeights[toSection] + sectionHeights[toSection] * 0.3
      return { start, end }
    },
    [cumulativeHeights, sectionHeights],
  )

  // Мемоизируем переходы
  const transitions = useMemo(
    () => ({
      heroToAbout: createTransition("hero", "about"),
      aboutToServices: createTransition("about", "services"),
      servicesToProjects: createTransition("services", "projects"),
      projectsToDepartments: createTransition("projects", "departments"),
      departmentsToPartners: createTransition("departments", "partners"),
      partnersToContacts: createTransition("partners", "contacts"),
    }),
    [createTransition],
  )

  // Оптимизированные opacity transforms
  const heroOpacity = useTransform(scrollY, [0, transitions.heroToAbout.end], [1, 0])
  const aboutOpacity = useTransform(
    scrollY,
    [
      transitions.heroToAbout.start,
      transitions.heroToAbout.end,
      transitions.aboutToServices.start,
      transitions.aboutToServices.end,
    ],
    [0, 1, 1, 0],
  )
  const servicesOpacity = useTransform(
    scrollY,
    [
      transitions.aboutToServices.start,
      transitions.aboutToServices.end,
      transitions.servicesToProjects.start,
      transitions.servicesToProjects.end,
    ],
    [0, 1, 1, 0],
  )
  const projectsOpacity = useTransform(
    scrollY,
    [
      transitions.servicesToProjects.start,
      transitions.servicesToProjects.end,
      transitions.projectsToDepartments.start,
      transitions.projectsToDepartments.end,
    ],
    [0, 1, 1, 0],
  )
  const departmentsOpacity = useTransform(
    scrollY,
    [
      transitions.projectsToDepartments.start,
      transitions.projectsToDepartments.end,
      transitions.departmentsToPartners.start,
      transitions.departmentsToPartners.end,
    ],
    [0, 1, 1, 0],
  )
  const partnersOpacity = useTransform(
    scrollY,
    [
      transitions.departmentsToPartners.start,
      transitions.departmentsToPartners.end,
      transitions.partnersToContacts.start,
      transitions.partnersToContacts.end,
    ],
    [0, 1, 1, 0],
  )
  const contactsOpacity = useTransform(
    scrollY,
    [transitions.partnersToContacts.start, transitions.partnersToContacts.end],
    [0, 1],
  )

  const radialGradientOpacity = useTransform(scrollY, [0, transitions.heroToAbout.end * 0.8], [1, 0])

  // Оптимизированное отслеживание мыши с throttling
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    let animationFrameId: number

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        })
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <>
      {/* Hero фон */}
      <motion.div
        className="fixed inset-0 z-[-2] pointer-events-none will-change-transform"
        style={{ opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/10 to-indigo-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/20" />
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#smallGrid)" />
          </svg>
        </div>
      </motion.div>

      {/* About фон */}
      <motion.div
        className="fixed inset-0 z-[-2] pointer-events-none will-change-transform"
        style={{ opacity: aboutOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]">
          <motion.div
            className="w-full h-full will-change-transform"
            animate={{ rotate: [0, 1, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="about-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#about-grid)" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Services фон */}
      <motion.div
        className="fixed inset-0 z-[-2] pointer-events-none will-change-transform"
        style={{ opacity: servicesOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/80 dark:from-gray-900 dark:via-indigo-900/30 dark:to-purple-900/40" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.15]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,30 C30,50 70,10 100,30 L100,100 L0,100 Z"
            fill="url(#services-gradient1)"
            initial={{ y: 100 }}
            animate={{ y: [100, 70, 100] }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
            style={{ willChange: "transform" }}
          />
          <motion.path
            d="M0,60 C20,80 50,40 80,60 C90,70 100,60 100,60 L100,100 L0,100 Z"
            fill="url(#services-gradient2)"
            initial={{ y: 100 }}
            animate={{ y: [100, 80, 100] }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 1,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
          <defs>
            <linearGradient id="services-gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#D946EF" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="services-gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#D946EF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Projects фон */}
      <motion.div
        className="fixed inset-0 z-[-2] pointer-events-none will-change-transform"
        style={{ opacity: projectsOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-violet-50/80 dark:from-gray-900 dark:via-blue-900/30 dark:to-indigo-900/40" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.15]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,40 C20,20 40,60 60,40 C80,20 100,40 100,40 L100,100 L0,100 Z"
            fill="url(#projects-gradient1)"
            initial={{ y: 100 }}
            animate={{ y: [100, 60, 100] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
            style={{ willChange: "transform" }}
          />
          <motion.path
            d="M0,70 C30,50 60,90 90,70 C95,65 100,70 100,70 L100,100 L0,100 Z"
            fill="url(#projects-gradient2)"
            initial={{ y: 100 }}
            animate={{ y: [100, 85, 100] }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 2,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
          <defs>
            <linearGradient id="projects-gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#6366F1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="projects-gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#818CF8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Departments фон */}
      <motion.div
        className="fixed inset-0 z-[-2] pointer-events-none will-change-transform"
        style={{ opacity: departmentsOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/80 via-sky-50/60 to-blue-50/80 dark:from-gray-900 dark:via-cyan-900/30 dark:to-sky-900/40" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.15]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,35 C10,45 30,25 50,35 C70,45 90,25 100,35 L100,100 L0,100 Z"
            fill="url(#departments-gradient1)"
            initial={{ y: 100 }}
            animate={{ y: [100, 65, 100] }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
            style={{ willChange: "transform" }}
          />
          <motion.path
            d="M0,65 C20,55 40,75 60,65 C80,55 100,65 100,65 L100,100 L0,100 Z"
            fill="url(#departments-gradient2)"
            initial={{ y: 100 }}
            animate={{ y: [100, 80, 100] }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 1.5,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
          <defs>
            <linearGradient id="departments-gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="departments-gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Partners фон */}
      <motion.div
        className="fixed inset-0 z-[-2] pointer-events-none will-change-transform"
        style={{ opacity: partnersOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-red-50/40 dark:from-gray-900 dark:via-amber-900/20 dark:to-orange-900/25" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-300/10 via-transparent to-orange-300/10" />
          <div className="absolute top-0 left-1/3 w-2/3 h-full bg-gradient-to-bl from-yellow-200/8 via-transparent to-red-200/8" />
          <div className="absolute bottom-1/3 right-0 w-1/2 h-2/3 bg-gradient-to-tl from-orange-200/6 to-transparent" />
        </div>
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="partners-grid" width="90" height="90" patternUnits="userSpaceOnUse">
                <path d="M 90 0 L 0 0 0 90" fill="none" stroke="currentColor" strokeWidth="0.4" />
                <path d="M 45 0 L 45 90 M 0 45 L 90 45" fill="none" stroke="currentColor" strokeWidth="0.15" />
                <circle cx="45" cy="45" r="1.5" fill="currentColor" opacity="0.25" />
                <circle cx="22.5" cy="22.5" r="0.8" fill="currentColor" opacity="0.2" />
                <circle cx="67.5" cy="67.5" r="0.8" fill="currentColor" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#partners-grid)" />
          </svg>
        </div>
      </motion.div>

      {/* Contacts фон */}
      <motion.div
        className="fixed inset-0 z-[-2] pointer-events-none will-change-transform"
        style={{ opacity: contactsOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-cyan-50/60 to-sky-50/80 dark:from-gray-900 dark:via-teal-900/30 dark:to-cyan-900/40" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.15]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,45 C25,25 50,65 75,45 C87.5,35 100,45 100,45 L100,100 L0,100 Z"
            fill="url(#contacts-gradient1)"
            initial={{ y: 100 }}
            animate={{ y: [100, 75, 100] }}
            transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
            style={{ willChange: "transform" }}
          />
          <motion.path
            d="M0,75 C15,85 35,65 55,75 C75,85 95,65 100,75 L100,100 L0,100 Z"
            fill="url(#contacts-gradient2)"
            initial={{ y: 100 }}
            animate={{ y: [100, 85, 100] }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 1,
              ease: "linear",
            }}
            style={{ willChange: "transform" }}
          />
          <defs>
            <linearGradient id="contacts-gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="contacts-gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]">
          <motion.div
            className="w-full h-full will-change-transform"
            animate={{ rotate: [0, 0.3, 0], scale: [1, 1.01, 1] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "linear" }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="contact-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                  <path d="M 120 0 L 0 0 0 120" fill="none" stroke="currentColor" strokeWidth="0.3" />
                  <path d="M 60 0 L 60 120 M 0 60 L 120 60" fill="none" stroke="currentColor" strokeWidth="0.1" />
                  <circle cx="60" cy="60" r="1.5" fill="currentColor" opacity="0.2" />
                  <circle cx="30" cy="30" r="0.5" fill="currentColor" opacity="0.15" />
                  <circle cx="90" cy="90" r="0.5" fill="currentColor" opacity="0.15" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#contact-grid)" />
            </svg>
          </motion.div>
        </div>
      </motion.div>


      <motion.div
        className="fixed inset-0 z-[-1] pointer-events-none will-change-transform"
        style={{
          opacity: radialGradientOpacity,
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 25%, rgba(236, 72, 153, 0.05) 50%, transparent 70%)`,
        }}
      />
    </>
  )
}
