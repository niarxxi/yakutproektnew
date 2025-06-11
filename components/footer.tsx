"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/" className="flex items-center -space-x-2">
                <Image
                  src="/images/minilogo.svg"
                  alt="ЯКУТПРОЕКТ"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="dark:brightness-110 h-10 w-auto"
                  priority // Добавлен атрибут priority для оптимизации LCP
                />
                <span className="text-xl font-bold text-gray-300">
                  ЯКУТПРОЕКТ
                </span>
              </Link>
            </div>
            <p className="text-gray-300 mb-4">
              Ведущий проектный институт Республики Саха (Якутия) с более чем
              20-летним опытом.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-6 w-6" />
                <span>
                  677000, Республика Саха (Якутия), г. Якутск, ул. Аммосова, 8
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+7 (4112) 34-15-09</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>yakutproekt@mail.ru</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              {[
                { name: "Главная", href: "#home" },
                { name: "О компании", href: "#about" },
                { name: "Услуги", href: "#services" },
                { name: "Проекты", href: "#projects" },
                { name: "Отделы", href: "#departments" },
                { name: "Контакты", href: "#contacts" },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Социальные сети</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://t.me/yakutproekt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors group"
                >
                  <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Telegram</span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Режим работы</h3>
            <div className="space-y-2 text-gray-300">
              <p>Понедельник - Пятница</p>
              <p className="text-blue-400 font-semibold">9:00 - 18:00</p>
              <p>Суббота - Воскресенье</p>
              <p>Выходной</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>© {currentYear} ОАО РПИИ «ЯКУТПРОЕКТ». Все права защищены.</p>
        </motion.div>
      </div>
    </footer>
  );
}
