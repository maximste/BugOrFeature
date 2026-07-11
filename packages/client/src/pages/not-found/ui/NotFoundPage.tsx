import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { usePage } from '@/app/hooks/usePage'
import { initNotFoundPage } from '../model/initNotFoundPage'
import ErrorBoundary from '@/app/errorBoundary/ErrorBoundary'
import { Button } from '@/shared/ui/button'
import { ErrorPageLayout } from '@/shared/ui/error-page-layout'

export const NotFoundPage = () => {
  usePage({ initPage: initNotFoundPage })

  return (
    <ErrorBoundary>
      <Helmet>
        <meta charSet="utf-8" />
        <title>404</title>
        <meta name="description" content="Страница не найдена" />
      </Helmet>

      <ErrorPageLayout
        icon="/img/not-found-icon.png"
        code="404"
        subheader="Котик потерялся"
        actions={
          <Button asChild variant="solid">
            <Link to="/">На главную</Link>
          </Button>
        }>
        <p>Такой странички не существует. Может, она ушла гулять по крышам.</p>
      </ErrorPageLayout>
    </ErrorBoundary>
  )
}
