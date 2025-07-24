import { type NextRequest, NextResponse } from "next/server"
import { TelegramBot } from "@/src/lib/telegram-bot"
import { rateLimit } from "@/src/lib/rate-limit"

// Ограничение скорости: 30 запросов в минуту
const limiter = rateLimit({
  interval: 60 * 1000, // 1 минута
  uniqueTokenPerInterval: 500, // Максимум 500 уникальных токенов за интервал
})

export async function GET(request: NextRequest) {
  try {
    console.log("=== Начало обработки запроса /api/telegram/posts ===")

    // Применение ограничения скорости
    try {
      await limiter.check(request, 30, "TELEGRAM_API") // 30 запросов в минуту
    } catch {
      console.log("Превышен лимит запросов")
      return NextResponse.json(
        {
          success: false,
          error: "Превышен лимит запросов. Попробуйте позже.",
          rate_limit: { retry_after: 60 },
        },
        { status: 429 },
      )
    }

    const bot = new TelegramBot()

    // Проверка правильности настройки бота
    if (!bot.isConfigured()) {
      console.error("Бот не настроен правильно")
      return NextResponse.json(
        {
          success: false,
          error:
            "Telegram бот не настроен правильно. Проверьте переменные окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHANNEL_USERNAME.",
        },
        { status: 500 },
      )
    }

    // Получение параметров запроса
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 50) // Максимум 50 постов
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    console.log(`Параметры запроса: limit=${limit}, offset=${offset}`)

    // Проверяем права бота в канале
    let botPermissions = null
    try {
      botPermissions = await bot.checkBotPermissions()
      console.log("Права бота проверены успешно")
    } catch (permError) {
      console.log("Не удалось проверить права бота:", permError)
    }

    // Получение постов из Telegram канала
    console.log("Начинаем получение постов из канала...")
    const posts = await bot.getChannelPosts({
      limit,
      offset,
    })

    console.log(`Получено постов: ${posts.length}`)

    // Получаем информацию о канале
    let channelInfo = null
    try {
      channelInfo = await bot.getChannelInfo()
      console.log("Информация о канале получена:", channelInfo)
    } catch (channelError) {
      console.log("Не удалось получить информацию о канале:", channelError)
    }

    // Получаем список администраторов
    let administrators = null
    try {
      administrators = await bot.getChatAdministrators()
      console.log("Список администраторов получен")
    } catch (adminError) {
      console.log("Не удалось получить администраторов:", adminError)
    }

    console.log("=== Успешно завершена обработка запроса ===")

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

    // Обработка специфических ошибок Telegram API
    if (error instanceof Error) {
      if (error.message.includes("конфликт webhook")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Обнаружен активный webhook. Запустите скрипт удаления webhook: node src/scripts/delete-webhook.js",
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

      if (error.message.includes("unauthorized") || error.message.includes("не авторизован")) {
        return NextResponse.json(
          {
            success: false,
            error: "Бот не авторизован. Проверьте токен бота в переменных окружения.",
          },
          { status: 401 },
        )
      }

      if (error.message.includes("forbidden") || error.message.includes("запрещено")) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Бот не имеет доступа к каналу. Убедитесь, что бот добавлен в канал как администратор с правами на чтение сообщений.",
          },
          { status: 403 },
        )
      }

      if (error.message.includes("not found") || error.message.includes("не найдено")) {
        return NextResponse.json(
          {
            success: false,
            error: "Канал не найден. Проверьте имя канала в переменных окружения.",
          },
          { status: 404 },
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Не удалось получить посты из Telegram канала: " +
          (error instanceof Error ? error.message : "Неизвестная ошибка"),
      },
      { status: 500 },
    )
  }
}
