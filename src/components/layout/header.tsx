"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/src/components/common/theme-toggle";
import { cn } from "@/src/lib/utils";

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
        className="fixed z-40 w-full px-4 group"
      >
        <div
          className={cn(
            "container mx-auto transition-all duration-300",
            isScrolled &&
              "bg-white/20 dark:bg-gray-900/20 max-w-4xl rounded-2xl border border-white/20 dark:border-gray-700/30 backdrop-blur-xl shadow-lg px-6 mt-2"
          )}
          data-scrolled={isScrolled}
        >
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Logo Section - Left */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 flex-shrink-0"
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

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex flex-1 justify-center px-8">
              <ul className="flex gap-8 text-sm whitespace-nowrap">
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
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Desktop Action Buttons */}
              <div className="hidden lg:flex items-center gap-3">
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className="group-data-[state=active]:block mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl backdrop-blur-xl p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:hidden absolute top-full left-0 right-0 mt-4 bg-white/90 dark:bg-gray-900/90 border border-white/30 dark:border-gray-700/40">
              {/* Mobile Navigation Menu */}
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

              {/* Mobile Action Buttons */}
              <div className="flex w-full items-center justify-center gap-4 pt-6 border-t border-gray-200/30 dark:border-gray-700/30">
                {/* Telegram Link */}
                <motion.a
                  href="https://t.me/yakutproekt"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center p-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md bg-white/40 dark:bg-gray-800/40"
                >
                  <Image
                    src="/images/telegram.svg"
                    alt="Telegram"
                    width={20}
                    height={20}
                    className="dark:brightness-0 dark:invert"
                  />
                </motion.a>

                {/* Theme Toggle */}
                <div className="p-1 bg-white/40 dark:bg-gray-800/40 rounded-md">
                  <ThemeToggle />
                </div>
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