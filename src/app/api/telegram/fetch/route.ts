import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHANNEL_USERNAME = process.env.TELEGRAM_CHANNEL_USERNAME!;
const MONGODB_URI = process.env.MONGODB_URI!;

async function getFileUrl(file_id: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${file_id}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.ok) return null;
  return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${data.result.file_path}`;
}

async function processMedia(post: any) {
  if (post.photo && Array.isArray(post.photo) && post.photo.length > 0) {
    const bestPhoto = post.photo[post.photo.length - 1];
    post.photo_url = await getFileUrl(bestPhoto.file_id);
  }
  if (post.video && post.video.file_id) {
    post.video_url = await getFileUrl(post.video.file_id);
  }
  if (post.document && post.document.file_id) {
    post.document_url = await getFileUrl(post.document.file_id);
  }
  if (post.sticker && post.sticker.file_id) {
    post.sticker_url = await getFileUrl(post.sticker.file_id);
  }
  return post;
}

async function getUpdates(offset = 0) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?allowed_updates=["channel_post"]&offset=${offset}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.ok) throw new Error(data.description);
  return data.result;
}

let cachedClient: MongoClient | null = null;
async function getClient() {
  if (cachedClient) return cachedClient;
  cachedClient = new MongoClient(MONGODB_URI);
  await cachedClient.connect();
  return cachedClient;
}

export async function GET(request: NextRequest) {
  try {
    const client = await getClient();
    const db = client.db();
    const postsCollection = db.collection("posts");

    // Получаем последний update_id из базы (правильно через курсор, не через массив!)
    const lastPost = await postsCollection.find().sort({ update_id: -1 }).limit(1).next();
    let offset = lastPost ? lastPost.update_id + 1 : 0;

    const updates = await getUpdates(offset);
    let saved = 0;
    for (const update of updates) {
      if (
        update.channel_post &&
        update.channel_post.chat &&
        (
          update.channel_post.chat.username === TELEGRAM_CHANNEL_USERNAME ||
          `@${update.channel_post.chat.username}` === TELEGRAM_CHANNEL_USERNAME
        )
      ) {
        let post = update.channel_post;
        post = await processMedia(post);

        await postsCollection.updateOne(
          { message_id: post.message_id },
          { $set: { ...post, update_id: update.update_id } },
          { upsert: true }
        );
        saved++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fetched ${updates.length} updates, saved ${saved} posts`,
      saved,
      updates: updates.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}