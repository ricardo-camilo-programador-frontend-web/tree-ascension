import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Global crash guard for the app. When any child component throws during
 * render, the whole tree would unmount and leave a blank page. This boundary
 * catches the error, renders a recovery screen and lets the player reload.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo)
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-950 px-6 text-center text-stone-100"
        >
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="max-w-md text-stone-400">
            The game hit an unexpected error. Your progress is saved locally — reload the page to
            continue growing your tree.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-md bg-green-700 px-4 py-2 font-semibold text-stone-50 transition-colors hover:bg-green-600"
          >
            Reload game
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
