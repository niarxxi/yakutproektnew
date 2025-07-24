interface RateLimitOptions {
  interval: number
  uniqueTokenPerInterval: number
}

interface RateLimitData {
  count: number
  resetTime: number
}

export function rateLimit(options: RateLimitOptions) {
  const { interval, uniqueTokenPerInterval } = options
  const cache = new Map<string, RateLimitData>()

  return {
    check: async (request: Request, limit: number, token: string) => {
      const now = Date.now()
      const key = `${token}_${Math.floor(now / interval)}`

      // Очистка старых записей
      for (const [cacheKey, data] of cache.entries()) {
        if (data.resetTime < now) {
          cache.delete(cacheKey)
        }
      }

      // Проверка превышения лимита уникальных токенов
      if (cache.size >= uniqueTokenPerInterval) {
        throw new Error("Слишком много уникальных токенов")
      }

      const current = cache.get(key) || { count: 0, resetTime: now + interval }

      if (current.count >= limit) {
        throw new Error("Превышен лимит скорости")
      }

      current.count++
      cache.set(key, current)
    },
  }
}
