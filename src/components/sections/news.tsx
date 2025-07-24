"use client"

import { motion } from "framer-motion"
import { MessageCircle, ExternalLink, Clock, RefreshCw, AlertCircle, Play, Download } from 'lucide-react'

import { Button } from "@/src/components/ui/button"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import Image from "next/image"
import { useTelegramPosts } from '@/src/hooks/use-telegram-posts'
import type { TelegramMessage } from '@/src/types/telegram'

export function News() {
  const {
    posts,
    loading,
    error,
    lastUpdate,
    isRefreshing,
    retryCount,
    refreshPosts,
  } = useTelegramPosts({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 минут
  })

  const openTelegramChannel = () => {
    window.open("https://t.me/nrxtest", "_blank")
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br />")
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return ""
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const renderPost = (post: TelegramMessage) => (
    <motion.div
      key={post.message_id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 last:border-b-0"
    >
      <div className="flex justify-between items-start mb-4">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          #{post.message_id}
        </Badge>
        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.date)}</span>
      </div>

      {post.text && (
        <div
          className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatText(post.text) }}
        />
      )}

      {/* Отображение фотографий */}
      {post.photo_urls && post.photo_urls.length > 0 && (
        <div className="mb-4">
          <div className="grid gap-3">
            {post.photo_urls.map((photoUrl, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <Image
                    src={photoUrl || "/placeholder.svg"}
                    alt={`Фото из поста #${post.message_id}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=256&width=400&text=Изображение+недоступно"
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(photoUrl, "_blank")}
                        className="bg-white/90 hover:bg-white text-black"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Открыть
                      </Button>
                    </div>
                  </div>
                </div>
                {post.photo && post.photo[index] && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    📷 {post.photo[index].width}×{post.photo[index].height}
                    {post.photo[index].file_size && post.photo[index].file_size > 0 && ` • ${formatFileSize(post.photo[index].file_size)}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Отображение видео */}
      {post.video_url && (
        <div className="mb-4">
          <div className="relative group">
            <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
              {post.video_url.includes("placeholder.svg") ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                  <div className="text-center">
                    <Play className="h-16 w-16 mx-auto mb-3 opacity-70" />
                    <p className="text-lg">Видео контент</p>
                    {post.video && (
                      <p className="text-sm opacity-70 mt-2">
                        {post.video.width}×{post.video.height} • {formatDuration(post.video.duration)}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  poster="/placeholder.svg?height=256&width=400&text=Видео"
                >
                  <source src={post.video_url} type="video/mp4" />
                  Ваш браузер не поддерживает воспроизведение видео.
                </video>
              )}
              
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-lg">
                🎥 {post.video && formatDuration(post.video.duration)}
              </div>
            </div>
            
            {post.video && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                🎥 {post.video.width}×{post.video.height} • {formatDuration(post.video.duration)}
                {post.video.file_size && post.video.file_size > 0 && ` • ${formatFileSize(post.video.file_size)}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Отображение документов */}
      {post.document_url && (
        <div className="mb-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {post.document?.file_name || "Документ"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.document?.mime_type}
                    {post.document?.file_size && post.document.file_size > 0 && ` • ${formatFileSize(post.document.file_size)}`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => window.open(post.document_url, "_blank")}
              >
                <Download className="h-4 w-4 mr-2" />
                Скачать
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Статистика поста */}
      {(post.views || post.forwards) && (
        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
          {post.views && (
            <span className="flex items-center gap-2">
              👁 {post.views.toLocaleString()}
            </span>
          )}
          {post.forwards && (
            <span className="flex items-center gap-2">
              ↗️ {post.forwards.toLocaleString()}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )

  return (
    <section id="news" className="py-20">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Новости и обновления
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Следите за последними новостями в нашем Telegram канале
          </p>
        </motion.div>

        {/* Увеличенный виджет постов */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            {/* Заголовок виджета */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Последние новости
                </h3>
                <div className="flex items-center text-base text-gray-500 dark:text-gray-400">
                  <Clock className="h-5 w-5 mr-2" />
                  {lastUpdate ? `Обновлено: ${lastUpdate.toLocaleTimeString("ru-RU")}` : "Загрузка..."}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={refreshPosts}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Обновить
                </Button>
                <Button
                  onClick={openTelegramChannel}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Открыть канал
                </Button>
              </div>
            </div>

            {/* Уведомление об ошибке */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200 text-base">
                  {error}
                  {retryCount > 0 && ` (Попытка ${retryCount}/3)`}
                </AlertDescription>
              </Alert>
            )}

            {/* Контейнер постов */}
            <div className="min-h-[600px] max-h-[800px] overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              {loading && posts.length === 0 ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <motion.div
                      className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <p className="text-lg text-gray-600 dark:text-gray-400">Загрузка постов из Telegram...</p>
                  </div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map(renderPost)}
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                      Нет доступных постов
                    </p>
                    <p className="text-base text-gray-500 dark:text-gray-500 mb-6">
                      Убедитесь, что бот добавлен в канал как администратор
                    </p>
                    <Button variant="outline" onClick={refreshPosts}>
                      Попробовать снова
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Нижняя информация */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <p className="text-base text-blue-800 dark:text-blue-200">
                <strong>Telegram канал:</strong> Данные автоматически обновляются каждые 5 минут.
                <button 
                  onClick={openTelegramChannel} 
                  className="underline hover:no-underline ml-2 font-medium"
                >
                  Перейти в канал →
                </button>
              </p>
            </div>
          </div>
        </motion.div>
        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-none">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Не пропустите важные обновления!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                В нашем Telegram канале мы публикуем новости о ходе проектов, анонсы мероприятий, фотоотчеты с объектов
                и другую актуальную информацию.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Фото и видео контент
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Реальные посты канала
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
