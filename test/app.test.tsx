/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as React from 'react'
import {useCallback} from 'react'
import {act} from 'react-dom/test-utils'
import {useLoading} from '../src'
import {createRoot, Root} from 'react-dom/client'

interface TestViewProps {
  onFinally?: (now: number) => void
}

function TestView (props: TestViewProps) {
  const {onFinally} = props
  const {loading, push, finish, execute, isLoading} = useLoading()
  const fetch = useCallback(async () => {
    // if (isLoading()) return
    const lk = push()
    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    } finally {
      finish(lk)
    }
    await execute(() => new Promise<void>(resolve => setTimeout(() => resolve(), 1000)))
    onFinally?.(Date.now())
  }, [push, finish, isLoading, onFinally])
  return <div>
    <div className="state">{loading ? 'loading' : 'idle'}</div>
    <button className="button" onClick={fetch}>{loading ? 'loading' : 'fetch'}</button>
  </div>
}

let container: HTMLDivElement
let root: Root
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  container?.remove()
})

it('loading test', async () => {
  if (container) {
    const onFinally = jest.fn()
    await act(() => {
      root = createRoot(container!)
      root.render(<TestView onFinally={onFinally}/>)
    })
    const button = container!.querySelector('button')!
    expect(button).not.toBe(undefined)
    expect(button.textContent).toBe('fetch')
    await act(() => {
      for (let i = 0; i < 10; i++) {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      }
    })
    expect(onFinally).toHaveBeenCalledTimes(0)
    expect(button.textContent).toBe('loading')
    await new Promise<void>(resolve => setTimeout(() => resolve(), 2200))
    expect(onFinally).toHaveBeenCalledTimes(10)
    expect(button.textContent).toBe('fetch')
  }
})
