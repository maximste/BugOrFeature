import { FC, SVGProps } from 'react'

export type MainFeatureCard = {
  id: string
  title: string
  description: string
  Icon: FC<
    SVGProps<SVGSVGElement> & {
      title?: string
      titleId?: string
      desc?: string
      descId?: string
    }
  >
}
