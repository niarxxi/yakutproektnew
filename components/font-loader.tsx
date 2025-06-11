"use client";

import { useEffect, useState } from "react";

export function FontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Проверяем, поддерживает ли браузер Font Loading API
    if ("fonts" in document) {
      // Пытаемся загрузить шрифты Wremena
      const loadFonts = async () => {
        try {
          await Promise.all([
            document.fonts.load("400 16px Wremena"),
            document.fonts.load("700 16px Wremena"),
            document.fonts.load("300 16px Wremena"),
          ]);
          setFontsLoaded(true);
        } catch (error) {
          console.warn("Wremena fonts failed to load, using fallback fonts");
          setFontsLoaded(true); // Продолжаем с fallback шрифтами
        }
      };

      loadFonts();
    } else {
      // Для старых браузеров просто ждем немного
      setTimeout(() => setFontsLoaded(true), 1000);
    }
  }, []);

  // Добавляем класс к body когда шрифты загружены
  useEffect(() => {
    if (fontsLoaded) {
      document.body.classList.add("fonts-loaded");
    }
  }, [fontsLoaded]);

  return null;
}
