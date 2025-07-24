"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative pt-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400 dark:bg-teal-500 rounded-full opacity-60"
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Main glass card with enhanced dynamic background */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border-t border-r border-teal-200/20 dark:border-cyan-400/20 rounded-t-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Dynamic Background Layer 1 - Theme-aware gradients */}
          <div className="absolute inset-0 opacity-30 dark:opacity-40 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-100/60 via-cyan-50/40 to-sky-100/60 dark:from-teal-900/40 dark:via-cyan-900/30 dark:to-sky-900/40 transition-colors duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-900/20 dark:via-transparent dark:to-indigo-900/20 transition-colors duration-700" />
          </div>

          {/* Dynamic Background Layer 2 - Animated wave patterns */}
          <div className="absolute inset-0 opacity-10 dark:opacity-15">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,30 C20,20 40,40 60,30 C80,20 100,30 100,30 L100,100 L0,100 Z"
                fill="url(#footer-wave-gradient1)"
                initial={{ y: 100 }}
                animate={{ y: [100, 70, 100] }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
              <motion.path
                d="M0,60 C30,50 50,70 80,60 C90,55 100,60 100,60 L100,100 L0,100 Z"
                fill="url(#footer-wave-gradient2)"
                initial={{ y: 100 }}
                animate={{ y: [100, 85, 100] }}
                transition={{
                  duration: 16,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 3,
                  ease: "easeInOut",
                }}
              />
              <defs>
                <linearGradient
                  id="footer-wave-gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    className="text-teal-400 dark:text-teal-600 transition-colors duration-700"
                    stopColor="currentColor"
                    stopOpacity="0.3"
                  />
                  <stop
                    offset="50%"
                    className="text-cyan-400 dark:text-cyan-600 transition-colors duration-700"
                    stopColor="currentColor"
                    stopOpacity="0.2"
                  />
                  <stop
                    offset="100%"
                    className="text-sky-400 dark:text-sky-600 transition-colors duration-700"
                    stopColor="currentColor"
                    stopOpacity="0.3"
                  />
                </linearGradient>
                <linearGradient
                  id="footer-wave-gradient2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    className="text-cyan-400 dark:text-cyan-600 transition-colors duration-700"
                    stopColor="currentColor"
                    stopOpacity="0.2"
                  />
                  <stop
                    offset="50%"
                    className="text-sky-400 dark:text-sky-600 transition-colors duration-700"
                    stopColor="currentColor"
                    stopOpacity="0.15"
                  />
                  <stop
                    offset="100%"
                    className="text-blue-400 dark:text-blue-600 transition-colors duration-700"
                    stopColor="currentColor"
                    stopOpacity="0.2"
                  />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Dynamic Background Layer 3 - Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-8">
            <motion.div
              className="w-full h-full"
              animate={{ rotate: [0, 0.5, 0], scale: [1, 1.02, 1] }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "linear",
              }}
            >
              <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                  <pattern
                    id="footer-enhanced-grid"
                    width="80"
                    height="80"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 80 0 L 0 0 0 80"
                      fill="none"
                      className="stroke-teal-500 dark:stroke-teal-400 transition-colors duration-700"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M 40 0 L 40 80 M 0 40 L 80 40"
                      fill="none"
                      className="stroke-cyan-500 dark:stroke-cyan-400 transition-colors duration-700"
                      strokeWidth="0.2"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="url(#footer-enhanced-grid)"
                />
              </svg>
            </motion.div>
          </div>

          {/* Content layer - positioned above all backgrounds */}
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
                  <Link href="/" className="flex items-center -space-x-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Image
                        src="/images/minilogo.svg"
                        alt="ЯКУТПРОЕКТ"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="dark:brightness-110 h-10 w-auto"
                        priority
                      />
                    </motion.div>
                    <span className="text-xl font-bold text-slate-800 dark:text-white brand-text">
                      ЯКУТПРОЕКТ
                    </span>
                  </Link>
                </div>
                <p className="text-slate-700 dark:text-gray-200 mb-6 text-sm leading-relaxed">
                  Ведущий проектный институт Республики Саха (Якутия) с более
                  чем 20-летним опытом.
                </p>
                <div className="space-y-3 text-sm text-slate-600 dark:text-gray-300">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <MapPin className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs">
                      677000, Республика Саха (Якутия), г. Якутск, ул. Аммосова,
                      8
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    <span>+7 (4112) 34-15-09</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4 text-sky-600 dark:text-sky-400" />
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
                <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">
                  Быстрые ссылки
                </h3>
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
                        className="text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-white transition-all duration-200 relative group"
                      >
                        <span className="relative z-10">{link.name}</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-md -z-10"
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
                <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">
                  Социальные сети
                </h3>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="https://t.me/yakutproekt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-white transition-all duration-300 group relative p-3 rounded-xl hover:bg-white/10 dark:hover:bg-white/5"
                  >
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
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
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400"
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
                <h3 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">
                  Режим работы
                </h3>
                <div className="space-y-3 text-slate-600 dark:text-gray-300">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    <p className="text-sm">Понедельник - Пятница</p>
                    <p className="text-teal-600 dark:text-teal-400 font-semibold text-lg">
                      9:00 - 18:00
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    <p className="text-sm">Суббота - Воскресенье</p>
                    <p className="text-slate-500 dark:text-gray-400">
                      Выходной
                    </p>
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
              className="mt-12 pt-8 border-t border-teal-200/30 dark:border-cyan-400/20 text-center"
            >
              <p className="text-slate-600 dark:text-gray-300 text-sm">
                © {currentYear} ОАО РПИИ «ЯКУТПРОЕКТ». Все права защищены.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
