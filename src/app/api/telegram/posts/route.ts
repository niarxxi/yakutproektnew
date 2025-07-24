import { type NextRequest, NextResponse } from "next/server"
import { TelegramBot } from "@/src/lib/telegram-bot"
import { rateLimit } from "@/src/lib/rate-limit"

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

export async function GET(request: NextRequest) {
  try {
    await limiter.check(request, 30, "TELEGRAM_API")

    const bot = new TelegramBot()
    if (!bot.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Telegram бот не настроен правильно. Проверьте переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHANNEL_USERNAME.",
        },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 50)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let botPermissions = null
    try { botPermissions = await bot.checkBotPermissions() } catch {}

    const posts = await bot.getChannelPosts({ limit, offset })

    let channelInfo = null
    try { channelInfo = await bot.getChannelInfo() } catch {}

    let administrators = null
    try { administrators = await bot.getChatAdministrators() } catch {}

    return NextResponse.json({
      success: true,
      posts,
      meta: {
        limit,
        offset,
        count: posts.length,
        timestamp: new Date().toISOString(),
        channel_info: channelInfo,
        bot_permissions: botPermissions,
        administrators_count: administrators?.length || 0,
        message:
          posts.length === 0
            ? "Посты не найдены. Возможно, в канале нет сообщений или бот не может получить к ним доступ."
            : `Успешно загружено ${posts.length} постов из канала.`,
      },
    })
  } catch (error) {
    console.error("=== Ошибка в API /api/telegram/posts ===")
    console.error("Детали ошибки:", error)

    if (error instanceof Error) {
      if (error.message.includes("конфликт webhook")) {
        return NextResponse.json(
          {
            success: false,
            error: "Обнаружен активный webhook. Запустите скрипт удаления webhook.",
            webhook_conflict: true,
          },
          { status: 409 },
        )
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            success: false,
            error: "Превышен лимит Telegram API. Попробуйте позже.",
            rate_limit: { retry_after: 60 },
          },
          { status: 429 },
        )
      }

      if (error.message.includes("unauthorized")) {
        return NextResponse.json(
          {
            success: false,
            error: "Бот не авторизован. Проверьте токен бота.",
          },
          { status: 401 },
        )
      }

      if (error.message.includes("forbidden")) {
        return NextResponse.json(
          {
            success: false,
            error: "Бот не имеет доступа к каналу. Добавьте бота как администратора.",
          },
          { status: 403 },
        )
      }

      if (error.message.includes("not found")) {
        return NextResponse.json(
          {
            success: false,
            error: "Канал не найден. Проверьте имя канала.",
          },
          { status: 404 },
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Не удалось получить посты из Telegram канала: " + 
               (error instanceof Error ? error.message : "Неизвестная ошибка"),
      },
      { status: 500 },
    )
  }
}