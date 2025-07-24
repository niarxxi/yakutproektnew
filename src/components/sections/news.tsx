"use client"

import { motion } from "framer-motion"
import {
  MessageCircle,
  ExternalLink,
  Clock,
  RefreshCw,
  AlertCircle,
  Play,
  Download,
  ChevronDown,
  Share2,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Badge } from "@/src/components/ui/badge"
import Image from "next/image"
import { useTelegramPosts } from "@/src/hooks/use-telegram-posts"
import type { TelegramMessage } from "@/src/types/telegram"
import { useState } from "react"

export function News() {
  const { posts, loading, error, lastUpdate, isRefreshing, retryCount, refreshPosts } = useTelegramPosts({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 минут
  })

  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set())
  const [showAllPosts, setShowAllPosts] = useState(false)

  const openTelegramChannel = () => {
    window.open("https://t.me/nrxtest", "_blank")
  }

  const togglePostExpansion = (postId: number) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const sharePost = async (post: TelegramMessage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Пост #${post.message_id}`,
          text: post.text?.substring(0, 100) + "...",
          url: `https://t.me/nrxtest/${post.message_id}`,
        })
      } catch (err) {
        console.log("Ошибка при попытке поделиться:", err)
      }
    } else {
      // Fallback для браузеров без поддержки Web Share API
      navigator.clipboard.writeText(`https://t.me/nrxtest/${post.message_id}`)
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Только что"
    } else if (diffInHours < 24) {
      return `${diffInHours}ч назад`
    } else if (diffInHours < 48) {
      return "Вчера"
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      })
    }
  }

  const formatText = (text: string, isExpanded = false) => {
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code class='bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm'>$1</code>")
      .replace(/\n/g, "<br />")

    // Обрезаем текст для мобильных устройств если не развернут
    if (!isExpanded && text.length > 150) {
      const truncated = text.substring(0, 150) + "..."
      return truncated
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code class='bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm'>$1</code>")
        .replace(/\n/g, "<br />")
    }

    return formattedText
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return ""
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const renderPost = (post: TelegramMessage) => {
    const isExpanded = expandedPosts.has(post.message_id)
    const hasLongText = post.text && post.text.length > 150

    return (
      <motion.div
        key={post.message_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-4"
      >
        {/* Заголовок поста */}
        <div className="flex justify-between items-center mb-3">
          <Badge variant="secondary" className="text-xs px-2 py-1">
            #{post.message_id}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.date)}</span>
            <Button variant="ghost" size="sm" onClick={() => sharePost(post)} className="h-6 w-6 p-0">
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Текст поста */}
        {post.text && (
          <div className="mb-3">
            <div
              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatText(post.text, isExpanded) }}
            />
            {hasLongText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePostExpansion(post.message_id)}
                className="mt-2 h-auto p-0 text-blue-600 dark:text-blue-400 text-xs"
              >
                {isExpanded ? "Свернуть" : "Показать полностью"}
                <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </Button>
            )}
          </div>
        )}

        {/* Фотографии */}
        {post.photo_urls && post.photo_urls.length > 0 && (
          <div className="mb-3">
            {post.photo_urls.map((photoUrl, index) => (
              <div key={index} className="relative group mb-2 last:mb-0">
                <div className="relative w-full h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <Image
                    src={photoUrl || "/placeholder.svg"}
                    alt={`Фото из поста #${post.message_id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=300&text=Изображение+недоступно"
                    }}
                  />
                  {/* Overlay для мобильных */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-active:opacity-100 sm:group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 right-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(photoUrl, "_blank")}
                        className="bg-white/90 hover:bg-white text-black text-xs px-2 py-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Открыть
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Информация о фото */}
                {post.photo && post.photo[index] && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                    📷 {post.photo[index].width}×{post.photo[index].height}
                    {post.photo[index].file_size &&
                      post.photo[index].file_size > 0 &&
                      ` • ${formatFileSize(post.photo[index].file_size)}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Видео */}
        {post.video_url && (
          <div className="mb-3">
            <div className="relative w-full h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
              {post.video_url.includes("placeholder.svg") ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                  <div className="text-center">
                    <Play className="h-12 w-12 mx-auto mb-2 opacity-70" />
                    <p className="text-sm">Видео контент</p>
                    {post.video && <p className="text-xs opacity-70 mt-1">{formatDuration(post.video.duration)}</p>}
                  </div>
                </div>
              ) : (
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  playsInline // Важно для мобильных
                  poster="/placeholder.svg?height=200&width=300&text=Видео"
                >
                  <source src={post.video_url} type="video/mp4" />
                  Ваш браузер не поддерживает воспроизведение видео.
                </video>
              )}

              {/* Длительность видео */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                🎥 {post.video && formatDuration(post.video.duration)}
              </div>
            </div>

            {/* Информация о видео */}
            {post.video && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                🎥 {post.video.width}×{post.video.height} • {formatDuration(post.video.duration)}
                {post.video.file_size && post.video.file_size > 0 && ` • ${formatFileSize(post.video.file_size)}`}
              </div>
            )}
          </div>
        )}

        {/* Документы */}
        {post.document_url && (
          <div className="mb-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                    <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {post.document?.file_name || "Документ"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {post.document?.mime_type}
                      {post.document?.file_size &&
                        post.document.file_size > 0 &&
                        ` • ${formatFileSize(post.document.file_size)}`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(post.document_url, "_blank")}
                  className="ml-2 flex-shrink-0"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Статистика поста */}
        {(post.views || post.forwards) && (
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
            {post.views && <span className="flex items-center gap-1">👁 {post.views.toLocaleString()}</span>}
            {post.forwards && <span className="flex items-center gap-1">↗️ {post.forwards.toLocaleString()}</span>}
          </div>
        )}
      </motion.div>
    )
  }

  // Показываем только первые 3 поста на мобильных, если не нажата кнопка "Показать все"
  const displayedPosts = showAllPosts ? posts : posts.slice(0, 3)

  return (
    <>
      {/* Кастомные стили для скроллбара */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.8);
        }
        
        .dark .custom-scrollbar {
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(75, 85, 99, 0.5);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(75, 85, 99, 0.8);
        }
      `}</style>

      <section id="news" className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Новости и обновления
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
              Следите за последними новостями в нашем Telegram канале
            </p>
          </motion.div>

          {/* Виджет */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            {/* Заголовок виджета */}
            <div className="bg-white dark:bg-gray-900 rounded-t-2xl p-4 sm:p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Обновлено: </span>
                  {lastUpdate ? lastUpdate.toLocaleTimeString("ru-RU") : "Загрузка..."}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshPosts}
                    disabled={isRefreshing}
                    className="flex items-center gap-1 bg-transparent h-8 px-2 sm:px-3"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Обновить</span>
                  </Button>
                  <Button size="sm" onClick={openTelegramChannel} className="flex items-center gap-1 h-8 px-2 sm:px-3">
                    <ExternalLink className="h-3 w-3" />
                    <span className="hidden sm:inline">Канал</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Контейнер постов */}
            <div className="bg-white dark:bg-gray-900 rounded-b-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 border-t-0">
              {/* Уведомление об ошибке */}
              {error && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                      {error}
                      {retryCount > 0 && ` (Попытка ${retryCount}/3)`}
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Посты с у��учшенным скроллбаром */}
              <div className="p-4 min-h-[400px] max-h-[70vh] overflow-y-auto custom-scrollbar">
                {loading && posts.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <motion.div
                        className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      />
                      <p className="text-gray-600 dark:text-gray-400">Загрузка постов...</p>
                    </div>
                  </div>
                ) : displayedPosts.length > 0 ? (
                  <>
                    <div>{displayedPosts.map(renderPost)}</div>

                    {/* Кнопка "Показать все" для мобильных */}
                    {posts.length > 3 && !showAllPosts && (
                      <div className="text-center mt-4">
                        <Button variant="outline" onClick={() => setShowAllPosts(true)} className="w-full sm:w-auto">
                          Показать все посты ({posts.length})
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">Нет доступных постов</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 px-4">
                        Убедитесь, что бот добавлен в канал как администратор
                      </p>
                      <Button variant="outline" size="sm" onClick={refreshPosts}>
                        Попробовать снова
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
