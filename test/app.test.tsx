import * as React from 'react'
import {useCallback} from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import useLoading from '../src/index'
import {act} from 'react-dom/test-utils'

interface TestViewProps {
  onFinally?: (now: number) => void
}

function TestView (props: TestViewProps) {
  const {onFinally} = props
  const {loading, load, loaded, isLoading} = useLoading()
  const fetch = useCallback(async () => {
    // if (isLoading()) return
    const lk = load()
    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000))
    } finally {
      loaded(lk)
    }
    onFinally?.(Date.now())
  }, [load, loaded, isLoading, onFinally])
  return <div>
    <div className="state">{loading ? 'loading' : 'idle'}</div>
    <button className="button" onClick={fetch}>{loading ? 'loading' : 'fetch'}</button>
  </div>
}

let container: HTMLDivElement | null = null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  if (container) {
    unmountComponentAtNode(container)
    container.remove()
    container = null
  }
})

it('loading test', async () => {
  if (container) {
    const onFinally = jest.fn()
    act(() => {
      render(<TestView onFinally={onFinally}/>, container)
    })
    const button = container.querySelector('button')!
    expect(button).not.toBe(undefined)
    expect(button.textContent).toBe('fetch')
    act(() => {
      for (let i = 0; i < 10; i++) {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      }
    })
    expect(onFinally).toHaveBeenCalledTimes(0)
    expect(button.textContent).toBe('loading')
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1200))
    expect(onFinally).toHaveBeenCalledTimes(10)
    expect(button.textContent).toBe('fetch')
  }
})
