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

    expect(screen.getByText('healthy subtree')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the recovery screen when a child crashes', async () => {
    const reloadSpy = vi
      .spyOn(window.location, 'reload')
      .mockImplementation(() => undefined)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <ErrorBoundary>
        <CrashingChild />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(consoleErrorSpy).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /reload game/i }))
    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })
})
