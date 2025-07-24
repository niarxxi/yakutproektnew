import { type NextRequest, NextResponse } from "next/server"

// Эта конечная точка обрабатывает webhook'и Telegram для обновлений в реальном времени
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Проверка подлинности webhook'а (опционально, но рекомендуется)
    const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET
    if (secretToken) {
      const providedToken = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
      if (providedToken !== secretToken) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
      }
    }

    // Обработка обновлений постов канала
    if (body.channel_post) {
      const channelPost = body.channel_post

      // Здесь вы можете:
      // 1. Сохранить пост в базе данных
      // 2. Запустить обновления в реальном времени через WebSocket
      // 3. Отправить уведомления подписчикам
      // 4. Обработать медиафайлы

      console.log("Получен новый пост канала:", {
        message_id: channelPost.message_id,
        date: channelPost.date,
        text: channelPost.text?.substring(0, 100) + "...",
        has_media: !!(channelPost.photo || channelPost.video || channelPost.document),
      })

      // Пока что просто подтверждаем получение
      return NextResponse.json({ ok: true })
    }

    // Обработка других типов обновлений при необходимости
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Ошибка webhook'а:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
