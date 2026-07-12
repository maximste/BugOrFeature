import type { MainFeatureCard } from '@/widgets/main-feature-cards'

import FishIcon from '@/assets/icons/fish.svg?react'
import ChatIcon from '@/assets/icons/chat.svg?react'
import LogoIcon from '@/assets/icons/logo.svg?react'

export const MAIN_FEATURE_CARDS: MainFeatureCard[] = [
  {
    id: '1',
    title: 'Три уровня',
    description:
      'От ласкового котёнка до дикого кота.\nПодберите вызов под настроение.',
    Icon: LogoIcon,
  },
  {
    id: '2',
    title: 'Рыбки вместо флажков',
    description: 'Помечайте подозрительные клетки рыбкой.\nКотики оценят.',
    Icon: FishIcon,
  },
  {
    id: '3',
    title: 'Уютный форум',
    description: 'Делитесь рекордами, тактиками\nи фотографиями своих котиков.',
    Icon: ChatIcon,
  },
]
