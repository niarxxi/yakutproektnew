"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="relative pt-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Main glass card with clean background */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative backdrop-blur-xl bg-white/10 dark:bg-[#0D2B52]/10 border-t border-r border-[#B9DDFF]/20 dark:border-[#B9DDFF]/20 rounded-t-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Clean gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#B9DDFF]/80 via-[#DEDEBE]/60 to-white/80 dark:from-[#1B3644]/60 dark:via-[#303030]/40 dark:to-[#0D2B52]/60 transition-colors duration-700" />

          {/* Content layer */}
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                      {/* Логотип для светлой темы */}
                      <Image
                        src="/images/logolight.svg"
                        alt="ЯКУТПРОЕКТ"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-6 w-auto block dark:hidden"
                        priority
                      />
                      {/* Логотип для темной темы */}
                      <Image
                        src="/images/logodark.svg"
                        alt="ЯКУТПРОЕКТ"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-6 w-auto hidden dark:block"
                        priority
                      />
                    </motion.div>
                    <span className="text-xl font-bold text-black dark:text-white brand-text">ЯКУТПРОЕКТ</span>
                  </Link>
                </div>
                <p className="text-black dark:text-white mb-6 text-sm leading-relaxed">
                  Ведущий проектный институт Республики Саха (Якутия) с более чем 20-летним опытом.
                </p>
                <div className="space-y-3 text-sm text-black dark:text-white">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 hover:text-[#0D2B52] dark:hover:text-[#B9DDFF] transition-colors"
                  >
                    <MapPin className="h-6 w-6 text-[#0D2B52] dark:text-[#B9DDFF]" />
                    <span className="text-xs">677000, Республика Саха (Якутия), г. Якутск, ул. Аммосова, 8</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 hover:text-[#0D2B52] dark:hover:text-[#B9DDFF] transition-colors"
                  >
                    <Phone className="h-4 w-4 text-[#0D2B52] dark:text-[#B9DDFF]" />
                    <span>+7 (4112) 34-15-09</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 hover:text-[#0D2B52] dark:hover:text-[#B9DDFF] transition-colors"
                  >
                    <Mail className="h-4 w-4 text-[#0D2B52] dark:text-[#B9DDFF]" />
                    <span>yakutproekt@mail.ru</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-black dark:text-white">Быстрые ссылки</h3>
                <ul className="space-y-3">
                  {[
                    { name: "Главная", href: "#home" },
                    { name: "О компании", href: "#about" },
                    { name: "Новости", href: "#news" },
                    { name: "Услуги", href: "#services" },
                    { name: "Проекты", href: "#projects" },
                    { name: "Отделы", href: "#departments" },
                    { name: "Контакты", href: "#contacts" },
                  ].map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.button
                        whileHover={{ x: 10, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection(link.href)}
                        className="text-black dark:text-white hover:text-[#0D2B52] dark:hover:text-[#B9DDFF] transition-all duration-200 relative group"
                      >
                        <span className="relative z-10">{link.name}</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#B9DDFF]/20 to-[#DEDEBE]/20 dark:from-[#1B3644]/20 dark:to-[#303030]/20 rounded-md -z-10"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.2 }}
                          style={{ originX: 0 }}
                        />
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-black dark:text-white">Социальные сети</h3>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a
                    href="https://t.me/yakutproekt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-black dark:text-white hover:text-[#0D2B52] dark:hover:text-[#B9DDFF] transition-all duration-300 group relative p-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5"
                  >
                    <motion.div whileHover={{ rotate: 15, scale: 1.2 }} transition={{ type: "spring", stiffness: 400 }}>
                      <Image
                        src="/images/telegram.svg"
                        alt="Telegram"
                        width={25}
                        height={25}
                        className="brightness-0 dark:brightness-0 dark:invert group-hover:brightness-200 transition-all duration-300"
                      />
                    </motion.div>
                    <span className="relative">
                      Telegram
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#0D2B52] to-[#1B3644] dark:from-[#B9DDFF] dark:to-white"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </a>
                </motion.div>
              </motion.div>

              {/* Working Hours */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-6 text-black dark:text-white">Режим работы</h3>
                <div className="space-y-3 text-black dark:text-white">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    <p className="text-sm">Понедельник - Пятница</p>
                    <p className="text-[#0D2B52] dark:text-[#B9DDFF] font-semibold text-lg">9:00 - 18:00</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    <p className="text-sm">Суббота - Воскресенье</p>
                    <p className="text-black/70 dark:text-white/70">Выходной</p>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 pt-8 border-t border-[#B9DDFF]/30 dark:border-[#B9DDFF]/20 text-center"
            >
              <p className="text-black dark:text-white text-sm">
                © {currentYear} ОАО РПИИ «ЯКУТПРОЕКТ». Все права защищены.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
