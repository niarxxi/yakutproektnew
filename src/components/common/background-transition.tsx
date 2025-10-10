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
      // Устанавливаем 0 если элемент не найден
      heights[key] = element ? element.offsetHeight : 0
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
      const fromHeight = sectionHeights[fromSection]
      const toHeight = sectionHeights[toSection]
      
      // Если секции не существуют, возвращаем нулевые значения
      if (fromHeight === 0 && toHeight === 0) {
        return { start: 0, end: 0 }
      }
      
      const start = cumulativeHeights[fromSection] + fromHeight * 0.5
      const end = cumulativeHeights[toSection] + toHeight * 0.3
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

  return (
    <>
      {/* Hero фон - основной цвет */}
      <motion.div className="fixed inset-0 z-[-2] pointer-events-none" style={{ opacity: heroOpacity }}>
        <div className="absolute inset-0 bg-white dark:bg-[#0D2B52]" />
      </motion.div>

      {/* About фон - дополнительный цвет 1 */}
      <motion.div className="fixed inset-0 z-[-2] pointer-events-none" style={{ opacity: aboutOpacity }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white to-[#B9DDFF] dark:from-[#0D2B52] dark:to-[#1B3644]" />
      </motion.div>

      {/* Services фон - дополнительный цвет 2 */}
      <motion.div className="fixed inset-0 z-[-2] pointer-events-none" style={{ opacity: servicesOpacity }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#B9DDFF] to-[#DEDEBE] dark:from-[#1B3644] dark:to-[#303030]" />
      </motion.div>

      {/* Projects фон - основной с дополнительным */}
      <motion.div className="fixed inset-0 z-[-2] pointer-events-none" style={{ opacity: projectsOpacity }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#DEDEBE] to-white dark:from-[#303030] dark:to-[#0D2B52]" />
      </motion.div>

      {/* Departments фон - дополнительный цвет 1 */}
      <motion.div className="fixed inset-0 z-[-2] pointer-events-none" style={{ opacity: departmentsOpacity }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white to-[#B9DDFF] dark:from-[#0D2B52] dark:to-[#1B3644]" />
      </motion.div>

      {/* Partners фон - дополнительный цвет 2 */}
      {sectionHeights.partners > 0 && (
        <motion.div className="fixed inset-0 z-[-2] pointer-events-none" style={{ opacity: partnersOpacity }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#B9DDFF] to-[#DEDEBE] dark:from-[#1B3644] dark:to-[#303030]" />
        </motion.div>
      )}

      {/* Contacts фон - основной цвет */}
      <motion.div className="fixed inset-0 z-[-2] pointer-events-none" style={{ opacity: contactsOpacity }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#DEDEBE] to-white dark:from-[#303030] dark:to-[#0D2B52]" />
      </motion.div>
    </>
  )
}