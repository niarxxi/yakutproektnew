"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { ContactModal } from "@/src/components/modals/contact-modal"

const contactInfo = [
  {
    icon: <MapPin className="h-6 w-6 text-blue-600" />,
    title: "Адрес",
    content: "677000, Республика Саха (Якутия), г. Якутск, ул. Аммосова, 8",
  },
  {
    icon: <Phone className="h-6 w-6 text-blue-600" />,
    title: "Телефон",
    content: "+7 (4112) 34-15-09",
  },
  {
    icon: <Mail className="h-6 w-6 text-blue-600" />,
    title: "Email",
    content: "yakutproekt@mail.ru",
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-600" />,
    title: "Режим работы",
    content: "Пн-Пт: 9:00-18:00",
  },
]

export function Contacts() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  const openInMaps = () => {
    window.open(
      "https://yandex.ru/map-widget/v1/?ll=129.733857%2C62.027739&z=17&pt=129.733857,62.027739,pm2rdm",
      "_blank",
    )
  }

  return (
    <section id="contacts" className="relative py-20 overflow-hidden">
      {/* Убираем плавающие частицы */}

      {/* Убираем декоративные элементы */}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Контакты</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Свяжитесь с нами для обсуждения вашего проекта
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Свяжитесь с нами</h3>

            <div className="grid sm:grid-cols-1 gap-6 mb-8 cursor-pointer">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="hover:shadow-lg transition-shadow bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {item.icon}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Button size="lg" onClick={() => setIsContactOpen(true)} className="w-full sm:w-auto">
              Оставить заявку
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
              {/* Яндекс.Карты виджет */}
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=129.733857%2C62.027739&z=17&pt=129.733857,62.027739,pm2rdm"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                title="Карта расположения офиса ЯкутПроект"
              />

              {/* Overlay с информацией и кнопкой */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Наш офис</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">г. Якутск, ул. Аммосова, 8</p>
                    </div>
                    <Button
                      onClick={openInMaps}
                      variant="outline"
                      size="sm"
                      className="ml-2 flex-shrink-0 bg-transparent"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  )
}
