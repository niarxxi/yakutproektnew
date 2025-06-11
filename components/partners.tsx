"use client";

import { motion } from "framer-motion";

const partners = [
  {
    name: "Правительство РС(Я)",
    logo: "/placeholder.svg?height=80&width=120&text=Правительство",
  },
  { name: "Алроса", logo: "/placeholder.svg?height=80&width=120&text=Алроса" },
  {
    name: "Якутскэнерго",
    logo: "/placeholder.svg?height=80&width=120&text=Якутскэнерго",
  },
  { name: "СВФУ", logo: "/placeholder.svg?height=80&width=120&text=СВФУ" },
  {
    name: "Сахатранснефтегаз",
    logo: "/placeholder.svg?height=80&width=120&text=СТНГ",
  },
  {
    name: "Якутстрой",
    logo: "/placeholder.svg?height=80&width=120&text=Якутстрой",
  },
];

export function Partners() {
  return (
    <section id="partners" className="relative py-20 overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -right-20 w-40 h-40 rounded-full border border-amber-200/30 dark:border-amber-500/20"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{
            duration: 100,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 -left-20 w-32 h-32 rounded-full border border-orange-200/30 dark:border-orange-500/20"
          animate={{ rotate: -360 }}
          transition={{
            duration: 80,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Плавающие геометрические фигуры */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-16 h-16 border-2 border-yellow-200/20 dark:border-yellow-400/15 rotate-45"
          animate={{ rotate: [45, 225, 45], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-12 h-12 rounded-full border-2 border-red-200/20 dark:border-red-400/15"
          animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
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
            Наши партнеры
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Мы сотрудничаем с ведущими организациями и предприятиями региона
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center justify-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/50 dark:border-gray-700/50"
            >
              <img
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                className="max-h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
