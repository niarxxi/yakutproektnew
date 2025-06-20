"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Главная", href: "#home" },
  { name: "О компании", href: "#about" },
  { name: "Услуги", href: "#services" },
  { name: "Проекты", href: "#projects" },
  { name: "Отделы", href: "#departments" },
  { name: "Контакты", href: "#contacts" },
];

export function Header() {
  const [menuState, setMenuState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const checkScrollPosition = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      if (!isHydrated) {
        setIsHydrated(true);
      }
    };

    // Check immediately after hydration
    if (typeof window !== "undefined") {
      checkScrollPosition();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle potential scroll restoration
    const handleLoad = () => {
      checkScrollPosition();
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuState(false);
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        // Only delay if we're hydrated and at the top
        delay: isHydrated && !isScrolled ? 0.2 : 0,
      }}
    >
      <nav
        data-state={menuState && "active"}
        className="fixed z-40 w-full px-2 group"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-white/20 dark:bg-gray-900/20 max-w-4xl rounded-2xl border border-white/20 dark:border-gray-700/30 backdrop-blur-xl shadow-lg lg:px-5 lg:backdrop-blur-xl"
          )}
          data-scrolled={isScrolled}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            {/* Logo Section */}
            <div className="flex w-full justify-between lg:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <Link href="/" className="flex items-center -space-x-2">
                  <Image
                    src="/images/minilogo.svg"
                    alt="ЯКУТПРОЕКТ"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="dark:brightness-110 h-10 w-auto"
                    priority
                  />
                  <span className="text-xl font-bold text-gray-900 dark:text-white brand-text">
                    ЯКУТПРОЕКТ
                  </span>
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:ml-8">
              <ul className="flex gap-8 text-sm">
                {navigation.map((item, index) => (
                  <li key={index}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => scrollToSection(item.href)}
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                    >
                      <span>{item.name}</span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side Actions */}
            <div className="bg-white/10 dark:bg-gray-900/10 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl backdrop-blur-xl p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-3 lg:space-y-0 lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent lg:backdrop-blur-none">
              {/* Mobile Navigation Menu */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {navigation.map((item, index) => (
                    <li key={index}>
                      <motion.button
                        whileHover={{ x: 10 }}
                        onClick={() => scrollToSection(item.href)}
                        className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                      >
                        <span>{item.name}</span>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full items-center justify-center gap-4 lg:w-auto lg:justify-end">
                {/* Telegram Link with Enhanced Animation */}
                <motion.a
                  href="https://t.me/yakutproekt"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -10, 10, -5, 0],
                    transition: {
                      scale: { duration: 0.2 },
                      rotate: { duration: 0.6, ease: "easeInOut" },
                    },
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md group"
                >
                  <motion.div
                    whileHover={{
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-md"
                  />
                  <motion.div
                    whileHover={{
                      rotate: 360,
                      transition: { duration: 0.8, ease: "easeInOut" },
                    }}
                  >
                    <Image
                      src="/images/telegram.svg"
                      alt="Telegram"
                      width={20}
                      height={20}
                      className="dark:brightness-0 dark:invert relative z-10"
                    />
                  </motion.div>
                </motion.a>

                {/* Theme Toggle with Enhanced Animation */}
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, 15, -15, 0],
                    transition: {
                      scale: { duration: 0.2 },
                      rotate: { duration: 0.5, ease: "easeInOut" },
                    },
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{
                      boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)",
                      backgroundColor: "rgba(168, 85, 247, 0.1)",
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 rounded-md -m-1"
                  />
                  <div className="relative z-10">
                    <ThemeToggle />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* CSS Custom Properties for Theme-Aware Styling */}
      <style jsx>{`
        :global(:root) {
          --header-bg: rgba(255, 255, 255, 0.2);
          --header-border: rgba(255, 255, 255, 0.2);
        }
        :global([data-theme="dark"]) {
          --header-bg: rgba(17, 24, 39, 0.2);
          --header-border: rgba(55, 65, 81, 0.3);
        }
        :global(.dark) {
          --header-bg: rgba(17, 24, 39, 0.2);
          --header-border: rgba(55, 65, 81, 0.3);
        }
      `}</style>
    </motion.header>
  );
}
