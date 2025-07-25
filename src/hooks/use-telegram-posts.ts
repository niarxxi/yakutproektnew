import { useState, useEffect, useCallback, useRef } from 'react'
import { usePersistentState } from './use-persistent-state'
import { postsCache } from '@/src/lib/cache'
import type { TelegramMessage, TelegramApiResponse } from '@/src/types/telegram'

const APP_VERSION = '1.0.1' // меняйте при деплое новой версии
const CACHE_TTL = 10 * 60 * 1000 // 10 минут

interface UseTelegramPostsOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  cacheKey?: string
  limit?: number
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
    refreshInterval = 5 * 60 * 1000,
    cacheKey = 'telegram-posts',
    limit = 5,
  } = options

  // persistent state
  const [persistentPosts, setPersistentPosts] = usePersistentState<TelegramMessage[]>({
    key: `${cacheKey}-data`,
    defaultValue: [],
    ttl: CACHE_TTL,
  })

  const [persistentChannelInfo, setPersistentChannelInfo] = usePersistentState({
    key: `${cacheKey}-channel-info`,
    defaultValue: null,
    ttl: 60 * 60 * 1000,
  })

  const [persistentLastUpdate, setPersistentLastUpdate] = usePersistentState<string | null>({
    key: `${cacheKey}-last-update`,
    defaultValue: null,
    ttl: CACHE_TTL,
  })

  // version check
  useEffect(() => {
    const savedVersion = localStorage.getItem('app-version')
    if (savedVersion !== APP_VERSION) {
      postsCache.clear()
      setPersistentPosts([])
      setPersistentChannelInfo(null)
      setPersistentLastUpdate(null)
      localStorage.setItem('app-version', APP_VERSION)
    }
  }, [setPersistentPosts, setPersistentChannelInfo, setPersistentLastUpdate])

  // local state
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

  // "умный" сброс кэша если устарел
  useEffect(() => {
    const lastUpdate = persistentLastUpdate ? new Date(persistentLastUpdate).getTime() : 0
    if (Date.now() - lastUpdate > CACHE_TTL) {
      postsCache.clear()
      setPersistentPosts([])
      setPersistentChannelInfo(null)
      setPersistentLastUpdate(null)
    }
    // eslint-disable-next-line
  }, [])

  // fetchPosts с limit
  const fetchPosts = useCallback(async (isManualRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setState(prev => ({
      ...prev,
      loading: !isManualRefresh && prev.posts.length === 0,
      isRefreshing: isManualRefresh,
      error: null,
    }))

    try {
      const response = await fetch(`/api/telegram/posts?limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
      })

      const data: TelegramApiResponse = await response.json()

      if (!response.ok) throw new Error(data.error || `HTTP error! status: ${response.status}`)

      if (data.success) {
        const newPosts = data.posts || []
        const now = new Date()

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

        postsCache.set(cacheKey, newPosts)
        setPersistentPosts(newPosts)
        setPersistentLastUpdate(now.toISOString())
        if (data.meta?.channel_info) setPersistentChannelInfo(data.meta.channel_info)
      } else {
        throw new Error(data.error || 'Не удалось загрузить посты')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return

      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка'
      setState(prev => {
        const newRetryCount = prev.retryCount + 1
        if (newRetryCount < 3) {
          const delay = Math.pow(2, newRetryCount - 1) * 1000
          setTimeout(() => { fetchPosts(isManualRefresh) }, delay)
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
  }, [cacheKey, setPersistentPosts, setPersistentLastUpdate, setPersistentChannelInfo, limit])

  const refreshPosts = useCallback(() => {
    postsCache.delete(cacheKey)
    setPersistentPosts([])
    setPersistentLastUpdate(null)
    fetchPosts(true)
  }, [cacheKey, fetchPosts, setPersistentPosts, setPersistentLastUpdate])

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
    setPersistentPosts([])
    setPersistentChannelInfo(null)
    setPersistentLastUpdate(null)
  }, [setPersistentPosts, setPersistentChannelInfo, setPersistentLastUpdate])

  // Инициализация: показываем кэш, параллельно обновляем
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      fetchPosts()
    }
    // eslint-disable-next-line
  }, [])

  // Автообновление
  useEffect(() => {
    if (!autoRefresh) return
    intervalRef.current = setInterval(() => { fetchPosts() }, refreshInterval)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoRefresh, refreshInterval, fetchPosts])

  // Обновление состояния при изменении persistent данных
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (abortControllerRef.current) abortControllerRef.current.abort()
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