import { Helmet } from 'react-helmet'
import { usePage } from '@/app/hooks/usePage'
import { initNotFoundPage } from '../model/initNotFoundPage'

export const NotFoundPage = () => {
  usePage({ initPage: initNotFoundPage })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>404</title>
        <meta name="description" content="Страница не найдена" />
      </Helmet>
      <p>404 — страница не найдена</p>
    </div>
  )
}
