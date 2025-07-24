// Добавим импорт типа в начало файла
import type { TelegramMessage } from '@/src/types/telegram'

// Система кэширования для Telegram постов

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheOptions {
  ttl?: number // время жизни в миллисекундах
  maxSize?: number // максимальный размер кэша
}

export class Cache<T> {
  private cache = new Map<string, CacheItem<T>>()
  private defaultTTL: number
  private maxSize: number

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000 // 5 минут по умолчанию
    this.maxSize = options.maxSize || 100
  }

  set(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl || this.defaultTTL)

    // Очищаем старые записи если кэш переполнен
    if (this.cache.size >= this.maxSize) {
      this.cleanup()
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Проверяем не истек ли срок
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Очистка истекших записей
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  // Получение статистики кэша
  getStats() {
    const now = Date.now()
    let expired = 0
    let valid = 0

    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expired++
      } else {
        valid++
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
      maxSize: this.maxSize,
    }
  }
}

// Глобальные кэши с типизацией
export const postsCache = new Cache<TelegramMessage[]>({
  ttl: 5 * 60 * 1000, // 5 минут для постов
  maxSize: 50,
})

export const mediaCache = new Cache<string>({
  ttl: 30 * 60 * 1000, // 30 минут для медиафайлов
  maxSize: 200,
})

export const channelInfoCache = new Cache<any>({
  ttl: 60 * 60 * 1000, // 1 час для информации о канале
  maxSize: 10,
})
