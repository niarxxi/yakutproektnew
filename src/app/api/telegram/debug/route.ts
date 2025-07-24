import { type NextRequest, NextResponse } from "next/server"
import { TelegramBot } from "@/src/lib/telegram-bot"

export async function GET(request: NextRequest) {
  try {
    console.log("=== Диагностика Telegram бота ===")

    const bot = new TelegramBot()

    if (!bot.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Бот не настроен",
        },
        { status: 500 },
      )
    }

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      bot_configured: true,
    }

    // Проверяем информацию о боте
    try {
      const botInfo = await bot.makeRequest("getMe")
      diagnostics.bot_info = {
        id: botInfo.id,
        username: botInfo.username,
        first_name: botInfo.first_name,
        can_join_groups: botInfo.can_join_groups,
        can_read_all_group_messages: botInfo.can_read_all_group_messages,
        supports_inline_queries: botInfo.supports_inline_queries,
      }
    } catch (error) {
      diagnostics.bot_info_error = error instanceof Error ? error.message : "Неизвестная ошибка"
    }

    // Проверяем информацию о канале
    try {
      const channelInfo = await bot.getChannelInfo()
      diagnostics.channel_info = channelInfo
    } catch (error) {
      diagnostics.channel_info_error = error instanceof Error ? error.message : "Неизвестная ошибка"
    }

    // Проверяем права бота
    try {
      const permissions = await bot.checkBotPermissions()
      diagnostics.bot_permissions = permissions
    } catch (error) {
      diagnostics.bot_permissions_error = error instanceof Error ? error.message : "Неизвестная ошибка"
    }

    // Проверяем администраторов
    try {
      const admins = await bot.getChatAdministrators()
      diagnostics.administrators = admins.map((admin: any) => ({
        username: admin.user.username,
        first_name: admin.user.first_name,
        status: admin.status,
        is_bot: admin.user.is_bot,
      }))
    } catch (error) {
      diagnostics.administrators_error = error instanceof Error ? error.message : "Неизвестная ошибка"
    }

    // Проверяем webhook
    try {
      const webhookInfo = await bot.getWebhookInfo()
      diagnostics.webhook_info = webhookInfo
    } catch (error) {
      diagnostics.webhook_info_error = error instanceof Error ? error.message : "Неизвестная ошибка"
    }

    return NextResponse.json({
      success: true,
      diagnostics,
    })
  } catch (error) {
    console.error("Ошибка диагностики:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 },
    )
  }
}
