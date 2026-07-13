import { Button } from '@/shared/ui/button'
import { ErrorPageLayout } from '@/shared/ui/error-page-layout'

export const ErrorWidget = () => {
  return (
    <ErrorPageLayout
      icon="/img/server-error-icon.png"
      code="Ошибка"
      subheader="Котики опять что-то уронили"
      actions={
        <Button onClick={() => window.location.reload()}>
          Перезагрузить страницу
        </Button>
      }
    />
  )
}
