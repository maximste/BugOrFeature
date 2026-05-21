import { ErrorWidget } from '@/widgets/error-widget'
import React from 'react'

type ErrorBoundaryProps = {
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Возникла ошибка!', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorWidget />
    }
    return this.props.children
  }
}

export default ErrorBoundary
