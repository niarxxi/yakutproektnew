"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, User, Award, TrendingUp, Building2 } from "lucide-react"
import { useDepartments } from "@/hooks/use-departments"

export function Departments() {
  const departments = useDepartments()
  const [selectedDept, setSelectedDept] = useState(departments[0])

  // Разделяем отделы на проектные и административные
  const projectDepartments = departments.filter((dept) => dept.projects > 0)
  const administrativeDepartments = departments.filter((dept) => dept.projects === 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="departments" className="relative py-20 overflow-hidden">
      {/* Плавающие частицы - движутся плавно и независимо */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 dark:bg-cyan-500 rounded-full opacity-60"
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
            }}
          />
        ))}
      </div>

      {/* Динамические декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full border-2 border-cyan-200/30 dark:border-cyan-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-[20%] -left-[20%] w-[50%] h-[50%] rounded-full border-2 border-blue-200/30 dark:border-blue-500/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Плавающие архитектурные элементы */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-20 h-20 border border-sky-200/20 dark:border-sky-500/15 rotate-45"
          animate={{
            rotate: [45, 225, 45],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Наша команда</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            14 специализированных отделов объединяют более 150 профессионалов для комплексного подхода к проектированию
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Departments Navigation */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 space-y-4 sticky top-24 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 px-3">Отделы института</h3>

              {/* Проектные отделы */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 mb-2">Проектные отделы</h4>
                {projectDepartments.map((dept) => (
                  <Button
                    key={dept.id}
                    variant="ghost"
                    onClick={() => setSelectedDept(dept)}
                    className={`w-full justify-start p-3 h-auto transition-all duration-200 ${
                      selectedDept.id === dept.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-shrink-0">{dept.icon}</div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-2">{dept.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {dept.specialists} чел. • {dept.projects} проектов
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Административные отделы */}
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 mb-2">
                  Административные отделы
                </h4>
                {administrativeDepartments.map((dept) => (
                  <Button
                    key={dept.id}
                    variant="ghost"
                    onClick={() => setSelectedDept(dept)}
                    className={`w-full justify-start p-3 h-auto transition-all duration-200 ${
                      selectedDept.id === dept.id
                        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-l-4 border-purple-600"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-shrink-0">{dept.icon}</div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-2">{dept.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {dept.specialists} специалистов
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Department Details */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDept.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Main Department Card */}
                <Card className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-[250px] lg:h-[300px] overflow-hidden">
                    <img
                      src={
                        selectedDept.image || "/placeholder.svg?height=300&width=600&text=Отдел" || "/placeholder.svg"
                      }
                      alt={selectedDept.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(
                          selectedDept.name,
                        )}`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {selectedDept.icon}
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedDept.projects > 0
                              ? "bg-blue-500/20 text-white border-blue-300/30"
                              : "bg-purple-500/20 text-white border-purple-300/30"
                          }`}
                        >
                          {selectedDept.specialists} специалистов
                        </Badge>
                        {selectedDept.projects > 0 && (
                          <Badge variant="secondary" className="bg-green-500/20 text-white border-green-300/30">
                            {selectedDept.projects} проектов
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">{selectedDept.name}</CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedDept.description}
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Department Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Specializations */}
                  <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-600" />
                        Специализации
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedDept.specializations.map((spec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Badge
                              variant="outline"
                              className={`${
                                selectedDept.projects > 0
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                  : "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                              }`}
                            >
                              {spec}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Department Statistics */}
                  <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Информация об отделе
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Количество специалистов</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedDept.specialists} человек
                          </p>
                        </div>
                      </motion.div>

                      {selectedDept.projects > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                        >
                          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Реализованные проекты</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedDept.projects} проектов
                            </p>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Руководитель отдела</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{selectedDept.head}</p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
