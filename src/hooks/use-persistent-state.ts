import { useState, useEffect, useRef, useCallback } from 'react'

interface PersistentStateOptions<T> {
  key: string
  defaultValue: T
  ttl?: number // время жизни в миллисекундах
  storage?: 'localStorage' | 'sessionStorage'
}

interface StoredData<T> {
  value: T
  timestamp: number
  expiresAt?: number
}

export function usePersistentState<T>({
  key,
  defaultValue,
  ttl,
  storage = 'localStorage'
}: PersistentStateOptions<T>): [T, (value: T) => void, () => void] {
  const [state, setState] = useState<T>(defaultValue)
  const isInitialized = useRef(false)
  const lastSavedValue = useRef<T>(defaultValue)

  // Загрузка из storage при инициализации
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return

    try {
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage
      const stored = storageObj.getItem(key)
      
      if (stored) {
        const parsedData: StoredData<T> = JSON.parse(stored)
        
        // Проверяем не истек ли срок
        if (parsedData.expiresAt && Date.now() > parsedData.expiresAt) {
          storageObj.removeItem(key)
          setState(defaultValue)
          lastSavedValue.current = defaultValue
        } else {
          setState(parsedData.value)
          lastSavedValue.current = parsedData.value
        }
      } else {
        setState(defaultValue)
        lastSavedValue.current = defaultValue
      }
    } catch (error) {
      console.warn(`Ошибка загрузки из ${storage}:`, error)
      setState(defaultValue)
      lastSavedValue.current = defaultValue
    }
    
    isInitialized.current = true
  }, [key, defaultValue, storage, ttl])

  // Сохранение в storage при изменении состояния
  useEffect(() => {
    if (!isInitialized.current || typeof window === 'undefined') return

    // Проверяем, изменилось ли значение
    if (JSON.stringify(state) === JSON.stringify(lastSavedValue.current)) {
      return
    }

    try {
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage
      const dataToStore: StoredData<T> = {
        value: state,
        timestamp: Date.now(),
        expiresAt: ttl ? Date.now() + ttl : undefined,
      }
      
      storageObj.setItem(key, JSON.stringify(dataToStore))
      lastSavedValue.current = state
    } catch (error) {
      console.warn(`Ошибка сохранения в ${storage}:`, error)
    }
  }, [key, state, storage, ttl])

  // Функция для обновления состояния
  const updateState = useCallback((value: T) => {
    setState(value)
  }, [])

  // Функция для очистки данных
  const clearState = useCallback(() => {
    if (typeof window === 'undefined') return
    
    try {
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage
      storageObj.removeItem(key)
      setState(defaultValue)
      lastSavedValue.current = defaultValue
    } catch (error) {
      console.warn(`Ошибка очистки ${storage}:`, error)
    }
  }, [key, defaultValue, storage])

  return [state, updateState, clearState]
}
