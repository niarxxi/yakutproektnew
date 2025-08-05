import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB || "telegram";
const COLLECTION = "posts";

// Кэшируем клиент между вызовами (для serverless)
let cachedClient: MongoClient | null = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  cachedClient = new MongoClient(MONGODB_URI);
  await cachedClient.connect();
  return cachedClient;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "5"), 50);

    const client = await getClient();
    const db = client.db(DB_NAME);
    const posts = await db
      .collection(COLLECTION)
      .find({})
      .sort({ date: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      posts,
      meta: {
        limit,
        count: posts.length,
        timestamp: new Date().toISOString(),
        message: posts.length === 0
          ? "Посты не найдены."
          : `Успешно загружено ${posts.length} постов из канала.`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Не удалось получить посты: " + (error instanceof Error ? error.message : "Неизвестная ошибка"),
      },
      { status: 500 }
    );
  }
}