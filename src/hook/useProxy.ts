import {Dispatch, MutableRefObject, SetStateAction, useCallback, useRef, useState} from 'react'

export default function useProxy<T = unknown>(initialValue: T): [T, MutableRefObject<T>, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue)
  const ref = useRef<T>(initialValue)
  const setValue = useCallback<Dispatch<SetStateAction<T>>>((value) => {
    setState(ref.current = value instanceof Function ? value(ref.current) : value)
  }, [])
  return [state, ref, setValue]
}
