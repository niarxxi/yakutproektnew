// Общие типы для Telegram интеграции

export interface TelegramPhoto {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  file_size?: number
}

export interface TelegramVideo {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  duration: number
  file_size?: number
}

export interface TelegramDocument {
  file_id: string
  file_unique_id: string
  file_name?: string
  mime_type?: string
  file_size?: number
}

export interface TelegramChat {
  id: number
  title?: string
  username?: string
  type: string
}

export interface TelegramMessage {
  message_id: number
  date: number
  text?: string
  caption?: string
  photo?: TelegramPhoto[]
  video?: TelegramVideo
  document?: TelegramDocument
  views?: number
  forwards?: number
  reply_markup?: any
  chat?: TelegramChat
  // Обработанные URL медиафайлов
  photo_url?: string
  video_url?: string
  document_url?: string
}

export interface TelegramResponse {
  ok: boolean
  result?: any
  error_code?: number
  description?: string
  parameters?: {
    retry_after?: number
  }
}

export interface GetPostsOptions {
  limit?: number
  offset?: number
}

export interface TelegramApiResponse {
  success: boolean
  posts?: TelegramMessage[]
  error?: string
  rate_limit?: {
    retry_after: number
  }
  meta?: {
    limit: number
    offset: number
    count: number
    timestamp: string
    channel_info?: any
    message?: string
  }
}
