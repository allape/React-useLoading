import React, {useCallback, useContext, useEffect, useRef} from 'react'
import NotImplementedError from '../error/NotImplementedError'
import useCounter from './useCounter'
import useProxy from './useProxy'

export type OnChangeFunc = (loading: boolean) => void

export type PushFunc = (key?: string) => string
export type FinishFunc = (key: string) => boolean
export type ExecFunc = <T> (runner: () => Promise<T>) => Promise<T>
export type IsLoadingFunc = () => boolean

export interface UseLoadingOptions {
  /**
   * delay for setLoading(false), prevent flashing; in unit `ms`
   * @default 100
   */
  delay?: number
  /**
   * emit immediately on loading state changed
   */
  onChange?: OnChangeFunc
}

export interface UseLoadingReturn {
  loading: boolean
  push: PushFunc
  finish: FinishFunc
  execute: ExecFunc
  isLoading: IsLoadingFunc
}

export const LoadingContext = React.createContext<UseLoadingReturn>({
  loading: false,
  execute: NotImplementedError,
  push: NotImplementedError,
  finish: NotImplementedError,
  isLoading: NotImplementedError,
})

export default function useLoading({ delay = 100, onChange }: UseLoadingOptions = {}): UseLoadingReturn {
  const [loading, loadingProxy, setLoading] = useProxy(false)
  const [count, tick] = useCounter()
  const { push: globalPush, finish: globalFinish } = useContext(LoadingContext)
  const queueRef = useRef<string[]>([])

  const push = useCallback<PushFunc>((key): string => {
    key = key || `${Date.now()}_${Math.random()}_${Math.random()}`

    if (globalPush && globalPush !== push && globalPush !== NotImplementedError) {
      try {
        globalPush(key)
      } catch (e) {
        console.error('failed to call "push" function in context')
      }
    }

    queueRef.current.push(key)

    tick()

    return key
  }, [tick, globalPush])

  const finish = useCallback<FinishFunc>((key): boolean => {
    if (globalFinish && globalFinish !== finish && globalFinish !== NotImplementedError) {
      try {
        globalFinish(key)
      } catch (e) {
        console.error('failed to call "finish" function in context:', e)
      }
    }

    const queue = queueRef.current
    const index = queue.indexOf(key)
    if (index !== -1) {
      queue.splice(index, 1)
      tick()

      if (
        onChange &&
        (
          (loadingProxy.current && queue.length === 0)
          ||
          (!loadingProxy.current && queue.length > 0)
        )
      ) {
        onChange(queue.length > 0)
      }

      return true
    }
    return false
  }, [onChange, tick, globalFinish])

  const execute = useCallback<ExecFunc>(async <T>(runner: () => Promise<T>): Promise<T> => {
    const lk = push()
    try {
      return await runner()
    } finally {
      finish(lk)
    }
  }, [push, finish])

  const isLoading = useCallback<IsLoadingFunc>((): boolean => queueRef.current.length > 0, [])

  useEffect(() => {
    const loading = queueRef.current.length > 0
    if (loading) {
      setLoading(loading)
    } else {
      const id = setTimeout(() => setLoading(queueRef.current.length > 0), delay)
      return () => clearTimeout(id)
    }
  }, [count, delay, setLoading])

  return {
    loading,
    push,
    finish,
    execute,
    isLoading,
  }
}
