import {useCallback, useState} from 'react'

export type TickFunction = (newValue?: number) => void

export default function useCounter(initialValue = 0): [number, TickFunction] {
  const [count, setCount] = useState(initialValue)
  const tick = useCallback((value?: number) => {
    setCount(c => value ?? (c === Number.MAX_SAFE_INTEGER ? 1 : ++c))
  }, [])
  return [count, tick]
}
