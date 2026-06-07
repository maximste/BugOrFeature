import type { MainFeatureCard } from '@/widgets/main-feature-cards'

export const MAIN_FEATURE_CARDS: MainFeatureCard[] = [
  {
    id: '1',
    title: 'Три уровня',
    description:
      'От ласкового котёнка до дикого кота.\nПодберите вызов под настроение.',
    iconSrc: 'img/signup-icon.png',
    iconAlt: 'Иконка трёх уровней сложности',
  },
  {
    id: '2',
    title: 'Рыбки вместо флажков',
    description: 'Помечайте подозрительные клетки рыбкой.\nКотики оценят.',
    iconSrc: 'img/fish.png',
    iconAlt: 'Иконка рыбки-флажка',
  },
  {
    id: '3',
    title: 'Уютный форум',
    description: 'Делитесь рекордами, тактиками\nи фотографиями своих котиков.',
    iconSrc: 'img/chat.png',
    iconAlt: 'Иконка форума',
  },
]
