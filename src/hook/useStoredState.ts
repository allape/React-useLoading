import {Dispatch, SetStateAction, useCallback, useState} from 'react'

function jsonSafeParse<T>(value: string): T | undefined {
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}

export default function useStoredState<T>(key: string, defaultValue?: T, storage: Storage = window.localStorage): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => jsonSafeParse<T>(key) || defaultValue as T)
  const setStateProxy = useCallback((value: T | ((old: T) => T)) => {
    setState(old => {
      const v = value instanceof Function ? value(old) : value
      if (v === undefined) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, JSON.stringify(v))
      }
      return v
    })
  }, [key])
  return [state, setStateProxy]
}
