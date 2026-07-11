import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { usePage } from '@/app/hooks/usePage'
import { initServerErrorPage } from '../model/initServerErrorPage'
import { Button } from '@/shared/ui/button'
import { ErrorPageLayout } from '@/shared/ui/error-page-layout'
import ErrorBoundary from '@/app/errorBoundary/ErrorBoundary'

export const ServerErrorPage = () => {
  usePage({ initPage: initServerErrorPage })
  const navigate = useNavigate()

  return (
    <ErrorBoundary>
      <Helmet>
        <meta charSet="utf-8" />
        <title>500</title>
        <meta name="description" content="Что-то сломалось" />
      </Helmet>

      <ErrorPageLayout
        icon="/img/server-error-icon.png"
        code="500"
        subheader="Котики что-то уронили"
        actions={
          <>
            <Button variant="solid" onClick={() => navigate(-1)}>
              Попробовать снова
            </Button>
            <Button asChild variant="white">
              <Link to="/">На главную</Link>
            </Button>
          </>
        }>
        <p>
          На сервере неполадки. Попробуйте ещё разок — мы уже метёлкой убираем.
        </p>
      </ErrorPageLayout>
    </ErrorBoundary>
  )
}
