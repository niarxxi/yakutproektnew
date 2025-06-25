"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden"
        >
          {/* Анимированный фон с частицами */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
                animate={{
                  x: [Math.random() * 1920, Math.random() * 1920],
                  y: [Math.random() * 1080, Math.random() * 1080],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Основной контент */}
          <div className="relative text-center z-10">
            {/* Анимированный логотип */}
            <motion.img
              src="/images/minilogo.svg"
              alt="Логотип"
              className="w-28 md:w-36 h-auto mx-auto mb-6 drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              animate={{
                opacity: 1,
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />

            {/* Название компании */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent brand-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              ЯКУТПРОЕКТ
            </motion.h1>

            {/* Подчеркивание */}
            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.5, duration: 1 }}
            />

            {/* Прогресс бар */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="w-64 mx-auto mt-6"
            >
              <div className="flex justify-between items-center mb-2">
                <motion.span
                  className="text-cyan-300 text-sm font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  Загрузка проекта...
                </motion.span>
                <span className="text-cyan-300 text-sm font-mono">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Подпись */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                delay: 2,
                duration: 2,
                repeat: Infinity,
              }}
              className="text-slate-300 mt-4 text-sm"
            >
              Инициализация системы проектирования
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
