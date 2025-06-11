"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Award, Users, Target, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const advantages = [
  {
    icon: <Award className="h-8 w-8 text-blue-600" />,
    title: "Опыт и экспертиза",
    description: "Более 20 лет успешной работы в области проектирования и строительства",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Профессиональная команда",
    description: "150+ высококвалифицированных специалистов в 14 профильных отделах",
  },
  {
    icon: <Target className="h-8 w-8 text-blue-600" />,
    title: "Комплексный подход",
    description: "Полный цикл проектирования от идеи до сдачи объекта в эксплуатацию",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-blue-600" />,
    title: "Инновационные решения",
    description: "Применение современных технологий и материалов в суровых климатических условиях",
  },
]

// Мемоизированный компонент карточки преимущества
const AdvantageCard = memo(({ advantage, index }: { advantage: (typeof advantages)[0]; index: number }) => (
  <motion.div
    key={index}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="will-change-transform"
  >
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        <div className="mb-4 flex justify-center">{advantage.icon}</div>
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{advantage.title}</h4>
        <p className="text-gray-600 dark:text-gray-300">{advantage.description}</p>
      </CardContent>
    </Card>
  </motion.div>
))

AdvantageCard.displayName = "AdvantageCard"

// Оптимизированный компонент частиц
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
))

OptimizedParticles.displayName = "OptimizedParticles"

export const About = memo(() => {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <OptimizedParticles />

      {/* Большие декоративные круги */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full border-2 border-blue-200/30 dark:border-blue-500/20 will-change-transform"
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-[15%] -left-[15%] w-[50%] h-[50%] rounded-full border-2 border-purple-200/30 dark:border-purple-500/20 will-change-transform"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">О компании</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            ОАО РПИИ «ЯКУТПРОЕКТ» — ведущий проектный институт Республики Саха (Якутия), специализирующийся на
            комплексном проектировании объектов различного назначения.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Наша миссия</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Создание качественной архитектурной среды, способствующей социально-экономическому развитию Республики
              Саха (Якутия) и повышению качества жизни населения.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Мы проектируем не просто здания — мы создаем пространства для жизни, работы, образования и культурного
              развития, учитывая уникальные климатические условия и культурные особенности региона.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="/images/logo.svg?height=400&width=600&text=ЯКУТПРОЕКТ"
              alt="ЯКУТПРОЕКТ"
              className="object-contain"
              loading="lazy"
            />
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
            <AdvantageCard key={index} advantage={advantage} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
})

About.displayName = "About"
