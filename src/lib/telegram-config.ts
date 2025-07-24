export interface TelegramConfig {
  botToken: string
  channelUsername: string
  webhookUrl?: string
  webhookSecret?: string
  updateInterval: number
  maxRetries: number
  rateLimit: {
    requests: number
    interval: number
  }
}

export const defaultTelegramConfig: Partial<TelegramConfig> = {
  updateInterval: 5 * 60 * 1000, // 5 minutes
  maxRetries: 3,
  rateLimit: {
    requests: 30,
    interval: 60 * 1000, // 1 minute
  },
}

export function validateTelegramConfig(): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    errors.push("Требуется переменная окружения TELEGRAM_BOT_TOKEN")
  }

  if (!process.env.TELEGRAM_CHANNEL_USERNAME) {
    errors.push("Требуется переменная окружения TELEGRAM_CHANNEL_USERNAME")
  }

  // Проверка формата токена бота
  if (process.env.TELEGRAM_BOT_TOKEN && !process.env.TELEGRAM_BOT_TOKEN.match(/^\d+:[A-Za-z0-9_-]+$/)) {
    errors.push("TELEGRAM_BOT_TOKEN имеет неверный формат")
  }

  // Проверка формата имени канала
  if (process.env.TELEGRAM_CHANNEL_USERNAME && !process.env.TELEGRAM_CHANNEL_USERNAME.match(/^[a-zA-Z0-9_]+$/)) {
    errors.push("TELEGRAM_CHANNEL_USERNAME имеет неверный формат (не должно включать @)")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
