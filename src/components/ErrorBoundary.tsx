import { Component, type ErrorInfo, type ReactNode } from 'react'
import { en } from '../i18n/en'
import { uiText } from '../i18n/ui-text'
import { Button } from './ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Tree Ascension render error', error, info.componentStack)
  }

  override render() {
    if (!this.state.hasError) return this.props.children
    const copy = en
    return (
      <div className="m-4 rounded-2xl border border-canopy-line bg-canopy-panel p-6" role="alert">
        <h1 className="font-display text-2xl text-canopy-text">{uiText(copy, 'errorTitle')}</h1>
        <p className="mt-2 text-sm text-canopy-muted">{uiText(copy, 'errorBody')}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          {uiText(copy, 'reload')}
        </Button>
      </div>
    )
  }
}
