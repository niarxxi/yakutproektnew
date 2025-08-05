// fetch-telegram-posts.js
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
    if (update.channel_post && update.channel_post.chat && (
      update.channel_post.chat.username === TELEGRAM_CHANNEL_USERNAME ||
      `@${update.channel_post.chat.username}` === TELEGRAM_CHANNEL_USERNAME
    )) {
      const post = update.channel_post;
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