import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

function CrashingChild(): never {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>healthy subtree</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('healthy subtree')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('renders the recovery screen when a child crashes', () => {
    const reloadSpy = vi.fn()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <ErrorBoundary reload={reloadSpy}>
        <CrashingChild />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('Something went wrong')).toBeTruthy()
    expect(consoleErrorSpy).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /reload game/i }))
    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })
})
