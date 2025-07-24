import { NextResponse } from "next/server"

export async function GET() {
  console.log("Тестовый API вызван")

  return NextResponse.json({
    message: "API работает!",
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? "установлен" : "НЕ УСТАНОВЛЕН",
      TELEGRAM_CHANNEL_USERNAME: process.env.TELEGRAM_CHANNEL_USERNAME || "НЕ УСТАНОВЛЕН",
    },
  })
}
