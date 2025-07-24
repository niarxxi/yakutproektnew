import { useState, useEffect, useCallback, useRef } from 'react'
import { usePersistentState } from './use-persistent-state'
import { postsCache } from '@/src/lib/cache'
import type { TelegramMessage, TelegramApiResponse } from '@/src/types/telegram'

interface UseTelegramPostsOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  cacheKey?: string
}

interface TelegramPostsState {
  posts: TelegramMessage[]
  loading: boolean
  error: string | null
  lastUpdate: Date | null
  isRefreshing: boolean
  channelInfo: any
  retryCount: number
}

const getCachedPosts = (key: string): TelegramMessage[] | null => {
  return postsCache.get(key) as TelegramMessage[] | null
}

export function useTelegramPosts(options: UseTelegramPostsOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 5 * 60 * 1000, // 5 минут
    cacheKey = 'telegram-posts'
  } = options

  // Персистентное состояние
  const [persistentPosts, setPersistentPosts] = usePersistentState<TelegramMessage[]>({
    key: `${cacheKey}-data`,
    defaultValue: [],
    ttl: 10 * 60 * 1000, // 10 минут в localStorage
  })

  const [persistentChannelInfo, setPersistentChannelInfo] = usePersistentState({
    key: `${cacheKey}-channel-info`,
    defaultValue: null,
    ttl: 60 * 60 * 1000, // 1 час
  })

  const [persistentLastUpdate, setPersistentLastUpdate] = usePersistentState<string | null>({
    key: `${cacheKey}-last-update`,
    defaultValue: null,
    ttl: 10 * 60 * 1000,
  })

  // Локальное состояние
  const [state, setState] = useState<TelegramPostsState>({
    posts: persistentPosts,
    loading: persistentPosts.length === 0,
    error: null,
    lastUpdate: persistentLastUpdate ? new Date(persistentLastUpdate) : null,
    isRefreshing: false,
    channelInfo: persistentChannelInfo,
    retryCount: 0,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  // Функция для получения постов - убираем state.retryCount из зависимостей
  const fetchPosts = useCallback(async (isManualRefresh = false) => {
    // Отменяем предыдущий запрос если он есть
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    // Проверяем кэш сначала
    const cachedPosts = getCachedPosts(cacheKey)
    if (cachedPosts && !isManualRefresh) {
      console.log('Загружаем посты из кэша')
      setState(prev => ({
        ...prev,
        posts: cachedPosts,
        loading: false,
        error: null,
      }))
      return
    }

    setState(prev => ({
      ...prev,
      loading: !isManualRefresh && prev.posts.length === 0,
      isRefreshing: isManualRefresh,
      error: null,
    }))

    try {
      console.log('Загружаем посты с сервера...')

      const response = await fetch('/api/telegram/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
      })

      const data: TelegramApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        const newPosts = data.posts || []
        const now = new Date()

        // Обновляем состояние
        setState(prev => ({
          ...prev,
          posts: newPosts,
          loading: false,
          isRefreshing: false,
          error: null,
          lastUpdate: now,
          retryCount: 0,
          channelInfo: data.meta?.channel_info || prev.channelInfo,
        }))

        // Сохраняем в кэш и persistent storage
        postsCache.set(cacheKey, newPosts)
        setPersistentPosts(newPosts)
        setPersistentLastUpdate(now.toISOString())
        
        if (data.meta?.channel_info) {
          setPersistentChannelInfo(data.meta.channel_info)
        }

        console.log(`Успешно загружено ${newPosts.length} постов`)
      } else {
        throw new Error(data.error || 'Не удалось загрузить посты')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Запрос был отменен')
        return
      }

      console.error('Ошибка при загрузке постов:', err)
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка'
      
      setState(prev => {
        const newRetryCount = prev.retryCount + 1
        
        // Автоматический повтор с экспоненциальной задержкой
        if (newRetryCount < 3) {
          const delay = Math.pow(2, newRetryCount - 1) * 1000
          console.log(`Повтор через ${delay}мс (попытка ${newRetryCount}/3)`)
          
          setTimeout(() => {
            fetchPosts(isManualRefresh)
          }, delay)
        }

        return {
          ...prev,
          loading: false,
          isRefreshing: false,
          error: errorMessage,
          retryCount: newRetryCount,
        }
      })
    }
  }, [cacheKey, setPersistentPosts, setPersistentLastUpdate, setPersistentChannelInfo])

  // Функция для принудительного обновления
  const refreshPosts = useCallback(() => {
    postsCache.delete(cacheKey) // Очищаем кэш
    fetchPosts(true)
  }, [cacheKey, fetchPosts])

  // Функция для очистки всех данных
  const clearData = useCallback(() => {
    postsCache.clear()
    setState({
      posts: [],
      loading: true,
      error: null,
      lastUpdate: null,
      isRefreshing: false,
      channelInfo: null,
      retryCount: 0,
    })
    // Очищаем persistent storage
    setPersistentPosts([])
    setPersistentChannelInfo(null)
    setPersistentLastUpdate(null)
  }, [setPersistentPosts, setPersistentChannelInfo, setPersistentLastUpdate])

  // Инициализация - выполняется только один раз
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      
      // Первоначальная загрузка только если нет данных
      if (persistentPosts.length === 0) {
        fetchPosts()
      }
    }
  }, []) // Пустой массив зависимостей

  // Автообновление - отдельный useEffect
  useEffect(() => {
    if (!autoRefresh) return

    intervalRef.current = setInterval(() => {
      fetchPosts()
    }, refreshInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh, refreshInterval, fetchPosts])

  // Обновление состояния при изменении persistent данных - только один раз при инициализации
  useEffect(() => {
    if (isInitializedRef.current) {
      setState(prev => ({
        ...prev,
        posts: persistentPosts,
        channelInfo: persistentChannelInfo,
        lastUpdate: persistentLastUpdate ? new Date(persistentLastUpdate) : null,
        loading: persistentPosts.length === 0 && !prev.error,
      }))
    }
  }, [persistentPosts, persistentChannelInfo, persistentLastUpdate])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    ...state,
    fetchPosts,
    refreshPosts,
    clearData,
    cacheStats: postsCache.getStats(),
  }
}
