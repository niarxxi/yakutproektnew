import type { 
  TelegramMessage, 
  TelegramResponse, 
  GetPostsOptions,
} from '@/src/types/telegram'

export class TelegramBot {
  private botToken: string
  private channelUsername: string
  private baseUrl: string

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || ""
    this.channelUsername = process.env.TELEGRAM_CHANNEL_USERNAME || "nrxtest"
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`
  }

  isConfigured(): boolean {
    return !!this.botToken && !!this.channelUsername
  }

  public async makeRequest(method: string, params: Record<string, any> = {}): Promise<any> {
    const url = `${this.baseUrl}/${method}`
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
    const data: TelegramResponse = await response.json()
    if (!data.ok) {
      const error = new Error(data.description || "Ошибка Telegram API")
      throw error
    }
    return data.result
  }

  async getFile(fileId: string): Promise<string> {
    const fileInfo = await this.makeRequest("getFile", { file_id: fileId })
    return `https://api.telegram.org/file/bot${this.botToken}/${fileInfo.file_path}`
  }

  private async processMediaFiles(message: TelegramMessage): Promise<TelegramMessage> {
    const processedMessage = { ...message }
    if (message.photo && message.photo.length > 0) {
      const bestPhoto = message.photo[message.photo.length - 1]
      try {
        const photoUrl = await this.getFile(bestPhoto.file_id)
        processedMessage.photo_urls = [photoUrl]
      } catch { processedMessage.photo_urls = [] }
    }
    if (message.video) {
      try {
        const videoUrl = await this.getFile(message.video.file_id)
        processedMessage.video_url = videoUrl
      } catch {}
    }
    if (message.document) {
      try {
        const documentUrl = await this.getFile(message.document.file_id)
        processedMessage.document_url = documentUrl
      } catch {}
    }
    return processedMessage
  }

  async getWebhookInfo(): Promise<any> {
    try {
      return await this.makeRequest("getWebhookInfo")
    } catch { return null }
  }

  async deleteWebhook(): Promise<boolean> {
    try {
      await this.makeRequest("deleteWebhook", { drop_pending_updates: true })
      return true
    } catch { return false }
  }

  async getChannelPosts(options: GetPostsOptions = {}): Promise<TelegramMessage[]> {
    const { limit = 20 } = options
    // Проверяем статус webhook
    const webhookInfo = await this.getWebhookInfo()
    if (webhookInfo && webhookInfo.url) {
      await this.deleteWebhook()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    // Получаем информацию о канале
    const chatInfo = await this.makeRequest("getChat", {
      chat_id: `@${this.channelUsername}`,
    })
    // Получаем посты через getUpdates
    const updates = await this.makeRequest("getUpdates", {
      limit: 100,
      allowed_updates: ["channel_post"],
    })
    const rawPosts = updates
      .filter((update: any) => {
        return (
          update.channel_post &&
          update.channel_post.chat &&
          (update.channel_post.chat.username === this.channelUsername ||
            update.channel_post.chat.id === chatInfo.id)
        )
      })
      .map((update: any) => update.channel_post)
      .sort((a: any, b: any) => b.date - a.date)
      .slice(0, limit)
    const channelPosts: TelegramMessage[] = []
    for (const post of rawPosts) {
      try {
        const processedPost = await this.processMediaFiles(post)
        channelPosts.push(processedPost)
      } catch {
        channelPosts.push(post)
      }
    }
    return channelPosts
  }

  async getChannelInfo() {
    const chatInfo = await this.makeRequest("getChat", {
      chat_id: `@${this.channelUsername}`,
    })
    return {
      id: chatInfo.id,
      title: chatInfo.title,
      username: chatInfo.username,
      description: chatInfo.description,
      member_count: chatInfo.member_count,
      type: chatInfo.type,
      permissions: chatInfo.permissions,
    }
  }

  async getChatAdministrators(): Promise<any[]> {
    return await this.makeRequest("getChatAdministrators", {
      chat_id: `@${this.channelUsername}`,
    })
  }

  async checkBotPermissions(): Promise<any> {
    const botInfo = await this.makeRequest("getMe")
    return await this.makeRequest("getChatMember", {
      chat_id: `@${this.channelUsername}`,
      user_id: botInfo.id,
    })
  }
}