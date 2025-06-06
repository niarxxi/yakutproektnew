"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Симуляция прогресса загрузки
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
                  x: [
                    Math.random() * 1920,
                    Math.random() * 1920,
                  ],
                  y: [
                    Math.random() * 1080,
                    Math.random() * 1080,
                  ],
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

          {/* Основной контент */}
          <div className="relative text-center z-10">
            {/* Сложная анимация логотипа */}
            <motion.div
              className="relative mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.68, -0.55, 0.265, 1.55],
                delay: 0.2 
              }}
            >
              {/* Внешнее кольцо */}
              <motion.div
                className="w-32 h-32 border-4 border-cyan-400 rounded-full mx-auto relative"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                {/* Внутреннее кольцо */}
                <motion.div
                  className="absolute inset-4 border-2 border-blue-300 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  {/* Центральный элемент */}
                  <motion.div
                    className="absolute inset-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(34, 211, 238, 0.5)",
                        "0 0 40px rgba(34, 211, 238, 0.8)",
                        "0 0 20px rgba(34, 211, 238, 0.5)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <motion.div
                      className="w-6 h-6 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Орбитальные точки */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-cyan-300 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      transformOrigin: "0 0",
                    }}
                    animate={{
                      rotate: 360,
                      x: Math.cos((i * Math.PI * 2) / 6) * 50,
                      y: Math.sin((i * Math.PI * 2) / 6) * 50,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Название компании с эффектом печати */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mb-6"
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
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
            </motion.div>

            {/* Прогресс бар */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="w-64 mx-auto"
            >
              <div className="flex justify-between items-center mb-2">
                <motion.span
                  className="text-cyan-300 text-sm font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
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
                  {/* Анимированный блик */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 0.5,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Дополнительный текст */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                delay: 2,
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="text-slate-300 mt-4 text-sm"
            >
              Инициализация системы проектирования
            </motion.p>
          </div>

          {/* Декоративные элементы по углам */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 border-2 border-cyan-400/20 rounded-full"
              style={{
                top: i < 2 ? "10%" : "auto",
                bottom: i >= 2 ? "10%" : "auto",
                left: i % 2 === 0 ? "10%" : "auto",
                right: i % 2 === 1 ? "10%" : "auto",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}