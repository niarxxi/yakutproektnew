"use client"

import { useEffect, useState } from "react"

export function FontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    // Проверяем, поддерживает ли браузер Font Loading API
    if ("fonts" in document) {
      // Загружаем Akzidenz Grotesk Pro
      const loadFonts = async () => {
        try {
          await Promise.all([
            document.fonts.load("400 16px 'Akzidenz Grotesk Pro'"),
            document.fonts.load("300 16px 'Akzidenz Grotesk Pro'"),
            document.fonts.load("700 16px 'Akzidenz Grotesk Pro'"),
          ])
          setFontsLoaded(true)
          console.log("✅ Akzidenz Grotesk Pro loaded successfully")
        } catch (error) {
          console.warn("Akzidenz Grotesk Pro failed to load, using fallback fonts")
          setFontsLoaded(true) // Продолжаем с fallback шрифтами
        }
      }

      loadFonts()
    } else {
      // Для старых браузеров просто ждем немного
      setTimeout(() => setFontsLoaded(true), 1000)
    }
  }, [])

  // Добавляем класс к body когда шрифты загружены
  useEffect(() => {
    if (fontsLoaded) {
      document.body.classList.add("fonts-loaded")
    }
  }, [fontsLoaded])

  return null
}
