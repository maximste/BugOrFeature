import type { MainFeatureCard } from '@/widgets/main-feature-cards'

import fishIcon from '@/assets/icons/fish.svg'
import chatIcon from '@/assets/icons/chat.svg'
import catIcon from '@/assets/icons/cat.svg'

export const MAIN_FEATURE_CARDS: MainFeatureCard[] = [
  {
    id: '1',
    title: 'Три уровня',
    description:
      'От ласкового котёнка до дикого кота.\nПодберите вызов под настроение.',
    iconSrc: catIcon,
    iconAlt: 'Иконка трёх уровней сложности',
  },
  {
    id: '2',
    title: 'Рыбки вместо флажков',
    description: 'Помечайте подозрительные клетки рыбкой.\nКотики оценят.',
    iconSrc: fishIcon,
    iconAlt: 'Иконка рыбки-флажка',
  },
  {
    id: '3',
    title: 'Уютный форум',
    description: 'Делитесь рекордами, тактиками\nи фотографиями своих котиков.',
    iconSrc: chatIcon,
    iconAlt: 'Иконка форума',
  },
]
