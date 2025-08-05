require('dotenv').config();
const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_USERNAME = process.env.TELEGRAM_CHANNEL_USERNAME;
const MONGODB_URI = process.env.MONGODB_URI;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_USERNAME || !MONGODB_URI) {
  console.error('Set TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_USERNAME, MONGODB_URI');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

async function getFileUrl(file_id) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${file_id}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.ok) return null;
  return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${data.result.file_path}`;
}

async function processMedia(post) {
  // Фото: сохраняем только лучшее (последний элемент массива)
  if (post.photo && Array.isArray(post.photo) && post.photo.length > 0) {
    const bestPhoto = post.photo[post.photo.length - 1];
    post.photo_url = await getFileUrl(bestPhoto.file_id);
  }

  // Видео
  if (post.video && post.video.file_id) {
    post.video_url = await getFileUrl(post.video.file_id);
  }

  // Документ
  if (post.document && post.document.file_id) {
    post.document_url = await getFileUrl(post.document.file_id);
  }

  // Аудио
  if (post.audio && post.audio.file_id) {
    post.audio_url = await getFileUrl(post.audio.file_id);
  }

  // Голосовое сообщение
  if (post.voice && post.voice.file_id) {
    post.voice_url = await getFileUrl(post.voice.file_id);
  }

  // Стикер
  if (post.sticker && post.sticker.file_id) {
    post.sticker_url = await getFileUrl(post.sticker.file_id);
  }

  // Видео заметка
  if (post.video_note && post.video_note.file_id) {
    post.video_note_url = await getFileUrl(post.video_note.file_id);
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

async function main() {
  await client.connect();
  const db = client.db();
  const posts = db.collection('posts');

  // Получаем последний update_id из базы
  const lastPost = await posts.find().sort({ update_id: -1 }).limit(1).next();
  let offset = lastPost ? lastPost.update_id + 1 : 0;

  const updates = await getUpdates(offset);

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

      await posts.updateOne(
        { message_id: post.message_id },
        { $set: { ...post, update_id: update.update_id } },
        { upsert: true }
      );
    }
  }

  console.log(`Fetched ${updates.length} updates`);
  await client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});