"use client";

import type React from "react";

import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useDepartments } from "@/hooks/use-departments";
import { Badge } from "@/components/ui/badge";

// Константы для лучшей читаемости и поддержки
const AUTOPLAY_INTERVAL = 5000;
const ANIMATION_DURATION = 0.4;
const TEXT_ANIMATION_DELAY = 0.02;
const MAX_ROTATION = 10;

// Компонент для кнопок навигации
const NavigationButton = ({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
      "flex items-center justify-center group/button transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
      className
    )}
  >
    {children}
  </button>
);

// Компонент для индикаторов точек
const DotIndicator = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "h-2 rounded-full transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
      isActive
        ? "bg-blue-600 dark:bg-blue-400 w-6"
        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2"
    )}
  />
);

// Компонент для анимированных частиц фона
const BackgroundParticles = ({ mounted }: { mounted: boolean }) => {
  // Фиксированные позиции для частиц, чтобы избежать разных значений на сервере и клиенте
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        initialX: (i * 127) % 1920, // Детерминированные позиции
        initialY: (i * 211) % 1080,
        duration: 3 + (i % 4),
        delay: (i % 3) * 0.5,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-cyan-400 dark:bg-cyan-500 rounded-full opacity-40"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            x: [particle.initialX, (particle.initialX + 200) % 1920],
            y: [particle.initialY, (particle.initialY + 150) % 1080],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

// Компонент для анимированного текста с фиксированной высотой
const AnimatedText = ({ text, active }: { text: string; active: number }) => {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <div className="min-h-[120px] flex items-start">
      <motion.p
        key={active}
        className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{
              filter: "blur(10px)",
              opacity: 0,
              y: 5,
            }}
            animate={{
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
              delay: TEXT_ANIMATION_DELAY * index,
            }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
};

export const Departments = ({
  autoplay = true,
  className,
}: {
  autoplay?: boolean;
  className?: string;
}) => {
  const departments = useDepartments();
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [mounted, setMounted] = useState(false);

  // Предопределенные углы поворота для избежания различий между сервером и клиентом
  const rotationAngles = useMemo(
    () => departments.map((_, index) => ((index * 37) % 21) - 10), // Детерминированные углы от -10 до 10
    [departments]
  );

  // Установка mounted флага
  useEffect(() => {
    setMounted(true);
  }, []);

  // Мемоизированные функции для навигации
  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % departments.length);
  }, [departments.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + departments.length) % departments.length);
  }, [departments.length]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActive(index);
  }, []);

  // Эффект для автопрокрутки
  useEffect(() => {
    if (!isPlaying || departments.length <= 1 || !mounted) return;

    const interval = setInterval(handleNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isPlaying, handleNext, departments.length, mounted]);

  // Обработка клавиатурных событий
  useEffect(() => {
    if (!mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          handlePrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case " ":
          e.preventDefault();
          togglePlayPause();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, togglePlayPause, mounted]);

  // Мемоизированные компоненты навигации
  const navigationButtons = useMemo(
    () => (
      <>
        <NavigationButton onClick={handlePrev}>
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/button:rotate-12 transition-transform duration-300" />
        </NavigationButton>
        <NavigationButton onClick={togglePlayPause}>
          {isPlaying ? (
            <Pause className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/button:scale-110 transition-transform duration-300" />
          ) : (
            <Play className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/button:scale-110 transition-transform duration-300 ml-0.5" />
          )}
        </NavigationButton>
        <NavigationButton onClick={handleNext}>
          <ArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover/button:-rotate-12 transition-transform duration-300" />
        </NavigationButton>
      </>
    ),
    [handlePrev, togglePlayPause, handleNext, isPlaying]
  );

  const currentDepartment = departments[active];

  if (!departments.length) {
    return null;
  }

  // Показываем loading состояние до завершения гидрации
  if (!mounted) {
    return (
      <section
        id="departments"
        className="relative py-20 overflow-hidden"
        role="region"
        aria-label="Отделы компании"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Наша команда
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              14 специализированных отделов объединяют более 150 профессионалов
              для комплексного подхода к проектированию
            </p>
          </div>
          <div className="max-w-sm md:max-w-6xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="h-80 md:h-96 w-full bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
              <div className="flex justify-between flex-col py-4">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="departments"
      className="relative py-20 overflow-hidden"
      role="region"
      aria-label="Отделы компании"
    >
      <BackgroundParticles mounted={mounted} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Наша команда
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            14 специализированных отделов объединяют более 150 профессионалов
            для комплексного подхода к проектированию
          </p>
        </motion.div>

        <div
          className={cn(
            "max-w-sm md:max-w-6xl mx-auto px-4 md:px-8 lg:px-12",
            className
          )}
        >
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Section */}
            <div>
              <div className="relative h-80 md:h-96 w-full">
                <AnimatePresence mode="sync">
                  {departments.map((department, index) => (
                    <motion.div
                      key={department.id}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        z: -100,
                        rotate: rotationAngles[index],
                      }}
                      animate={{
                        opacity: index === active ? 1 : 0.7,
                        scale: index === active ? 1 : 0.95,
                        z: index === active ? 0 : -100,
                        rotate: index === active ? 0 : rotationAngles[index],
                        zIndex:
                          index === active
                            ? 999
                            : departments.length + 2 - index,
                        y: index === active ? [0, -20, 0] : 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        z: 100,
                        rotate: rotationAngles[index],
                      }}
                      transition={{
                        duration: ANIMATION_DURATION,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 origin-bottom"
                    >
                      <div className="relative h-full w-full rounded-3xl overflow-hidden">
                        <Image
                          src={
                            department.image ||
                            `/placeholder.svg?height=400&width=600&text=${
                              encodeURIComponent(department.name) ||
                              "/placeholder.svg"
                            }`
                          }
                          alt={`Отдел ${department.name}`}
                          width={600}
                          height={400}
                          draggable={false}
                          className="h-full w-full object-cover object-center"
                          loading={index === active ? "eager" : "lazy"}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(
                              department.name
                            )}`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            {department.icon}
                            <Badge
                              variant="secondary"
                              className="bg-white/20 text-white border-white/30"
                            >
                              {department.specialists} специалистов
                            </Badge>
                            {department.projects > 0 && (
                              <Badge
                                variant="secondary"
                                className="bg-green-500/20 text-white border-green-300/30"
                              >
                                {department.projects} проектов
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Mobile Navigation */}
              <div className="flex lg:hidden justify-center gap-4 mt-6">
                {navigationButtons}
              </div>
            </div>

            {/* Content Section with Fixed Height Container */}
            <div className="py-4">
              <div className="min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-1"
                  >
                    {/* Header Section with Fixed Height */}
                    <div className="min-h-[100px] mb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                          {currentDepartment.name}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Руководитель: {currentDepartment.head}
                      </p>
                    </div>

                    {/* Description with Fixed Height Container */}
                    <AnimatedText
                      text={currentDepartment.description}
                      active={active}
                    />

                    {/* Specializations with Fixed Height Container */}
                    <div className="min-h-[200px]">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Специализации:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentDepartment.specializations.map(
                          (spec, index) => (
                            <motion.div
                              key={`${active}-${index}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Badge
                                variant="outline"
                                className={cn(
                                  currentDepartment.projects > 0
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                    : "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                                )}
                              >
                                {spec}
                              </Badge>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Fixed Position Navigation Controls */}
          <div className="mt-8 lg:mt-12">
            {/* Desktop Navigation - независимая позиция */}
            <div className="hidden lg:flex justify-center gap-4 mb-6">
              {navigationButtons}
            </div>

            {/* Dots indicator - независимая позиция */}
            <div className="flex justify-center gap-2" role="tablist">
              {departments.map((_, index) => (
                <DotIndicator
                  key={index}
                  isActive={index === active}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
