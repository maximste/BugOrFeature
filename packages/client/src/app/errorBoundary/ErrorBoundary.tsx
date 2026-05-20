import { ErrorWidget } from '@/widgets/error-widget'
import React from 'react'

type ErrorBoundaryProps = React.PropsWithChildren

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

  // С помощью этого метода меняем стейт компонента при возникновении ошибки:
  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  // С помощью этого метода логируем информацию об ошибке:
  componentDidCatch(error: Error, info: any) {
    console.log('Возникла ошибка!', error, info)
  }

  render() {
    if (this.state.hasError) {
      // Если возникла ошибка, сообщаем об этом пользователю в специальном компоненте:
      return <ErrorWidget />
    }
    // Если всё работает штатно, рендерим дочерние компоненты
    return this.props.children
  }
}

export default ErrorBoundary
