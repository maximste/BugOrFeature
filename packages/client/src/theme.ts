import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
  defineSlotRecipe,
} from '@chakra-ui/react'

export const COLORS = {
  text: '#492923',
  subtitleText: '#785C52',
  background: '#fff9ed',
  border: '#F4E0D1',
  danger: '#bf4f74',
  accent: '#0d3242',

  pink: '#ffb6bc',
  cyan: '#B6F1F4',
  purple: '#f2c5fd',
  mint: '#b9edd6',
  peach: '#fde4d4',
  white: '#ffffff',
  yellow: '#fdf5df',

  card: '#ffffff',
  buttonBg: '#FB9890',
  buttonText: '#321A16',

  // canvas
  num: [
    '',
    '#3AA2EE',
    '#44BA82',
    '#EB3E5B',
    '#283593',
    '#b71c1c',
    '#00838f',
    '#212121',
    '#546e7a',
  ],
} as const

export const DARK_COLORS = {
  text: '#F5E9E3',
  subtitleText: '#C9AFA3',
  background: '#1B1512',
  border: '#3A2C25',
  danger: '#FF7A9C',
  accent: '#43d5dc',

  pink: '#6B2338',
  cyan: '#043f4d',
  purple: '#ae3b8c',
  mint: '#0f3d2e',
  peach: '#5c2b1e',
  yellow: '#917a61',
  white: '#1B1512',

  card: '#1d1d2f',
  buttonBg: '#ebb3f7',
  buttonText: '#ffffff',
} as const

export const TRANSITION = 'all 0.3s ease'

const formInputRecipe = defineRecipe({
  className: 'form-input',
  base: {
    fontFamily: 'body',
    fontSize: '14px',
    fontWeight: '400',
    color: 'text',
    background: 'card',
    width: '100%',
    border: '1px solid',
    borderColor: 'border',
    borderRadius: '14px',
    padding: '8px 16px',
    boxShadow: 'button',
    _placeholder: { color: 'subtitleText' },
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'buttonBg',
    },
  },
})

const cardRecipe = defineRecipe({
  className: 'app-card',
  base: {
    background: 'card/80',
    borderRadius: 'card',
    boxShadow: 'card',
    padding: '30px',
  },
})

const linkRecipe = defineRecipe({
  base: { focusRing: 'none', fontSize: '14px', lineHeight: '14px' },
})

const listSlotRecipe = defineSlotRecipe({
  slots: ['root', 'item', 'indicator'],
  base: {
    root: { listStyle: 'none' },
  },
  variants: {
    variant: {
      marker: { root: { listStyle: 'none' } },
    },
  },
})

const appButtonRecipe = defineRecipe({
  className: 'app-button',
  base: {
    fontFamily: 'body',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: 'pill',
    padding: '8px 16px',
    cursor: 'pointer',
    border: 'none',
    color: 'buttonText',
    maxWidth: 'max-content',
    transition: TRANSITION,
    _hover: { filter: 'brightness(1.03)' },
    _active: { transform: 'translateY(1px)' },
    _focusVisible: { outline: 'none' },
  },
  variants: {
    variant: {
      default: { background: 'buttonBg' },
      white: {
        background: 'card/80',
        border: '1px solid',
        borderColor: 'border',
        _hover: { color: 'buttonBg/80' },
      },
      cyan: { background: 'cyan' },
    },
  },
  defaultVariants: { variant: 'default' },
})

const config = defineConfig({
  globalCss: {
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    '#root': {
      minWidth: '100vw',
      maxWidth: '100vw',
    },
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
    a: {
      color: 'inherit',
    },
    'a, button': {
      _focusVisible: { outline: 'none' },
    },
    body: {
      color: 'text',
      background: 'background',
      backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255, 215, 209, 0.4), #0000 40%),
    radial-gradient(circle at 90% 80%, rgba(157, 239, 243, 35%), #0000 40%)`,
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      transition: TRANSITION,
      _dark: {
        backgroundImage: `radial-gradient(circle at 12% 8%, rgb(114 60 126 / 35%), transparent 45%), radial-gradient(circle at 88% 82%, rgb(0 103 111 / 30%), transparent 45%), radial-gradient(circle at 50% 50%, rgb(32 58 100 / 25%), transparent 60%)`,
      },
    },
  },
  theme: {
    textStyles: {
      stat: {
        value: {
          fontFamily: "'Fredoka', sans-serif",
          fontSize: '0.875rem',
          lineHeight: '1.25',
          fontWeight: '600',
        },
      },
      uiLabel: {
        value: { fontFamily: 'body', fontSize: '14px', fontWeight: '700' },
      },
      uiHeavy: {
        value: { fontFamily: 'body', fontSize: '32px', fontWeight: '800' },
      },
    },
    tokens: {
      fonts: {
        body: { value: `'Nunito', system-ui, sans-serif` },
        heading: { value: `'Nunito', system-ui, sans-serif` },
        fredoka: { value: `'Fredoka', sans-serif` },
      },
      shadows: {
        cardSoft: { value: '0 8px 30px -10px rgb(251 152 144 / 25%)' },
        cardHover: {
          value:
            '0 12px 36px -8px rgb(251 152 144 / 40%), 0 4px 12px -4px rgb(0 0 0 / 8%)',
        },
        avatar: { value: '0 4px 16px rgb(251 152 144 / 40%)' },
      },
      radii: {
        card: { value: '24px' },
        pill: { value: '999px' },
      },
    },
    semanticTokens: {
      colors: {
        text: { value: { _light: COLORS.text, _dark: DARK_COLORS.text } },
        subtitleText: {
          value: {
            _light: COLORS.subtitleText,
            _dark: DARK_COLORS.subtitleText,
          },
        },
        background: {
          value: { _light: COLORS.background, _dark: DARK_COLORS.background },
        },
        border: {
          value: { _light: COLORS.border, _dark: DARK_COLORS.border },
        },
        danger: {
          value: { _light: COLORS.danger, _dark: DARK_COLORS.danger },
        },
        accent: {
          value: { _light: COLORS.accent, _dark: DARK_COLORS.accent },
        },
        pink: {
          value: { _light: COLORS.pink, _dark: DARK_COLORS.pink },
        },
        cyan: {
          value: { _light: COLORS.cyan, _dark: DARK_COLORS.cyan },
        },
        purple: {
          value: { _light: COLORS.purple, _dark: DARK_COLORS.purple },
        },
        mint: {
          value: { _light: COLORS.mint, _dark: DARK_COLORS.mint },
        },
        peach: {
          value: { _light: COLORS.peach, _dark: DARK_COLORS.peach },
        },
        white: {
          value: { _light: COLORS.white, _dark: DARK_COLORS.white },
        },
        card: {
          value: { _light: COLORS.card, _dark: DARK_COLORS.card },
        },
        buttonBg: {
          value: { _light: COLORS.buttonBg, _dark: DARK_COLORS.buttonBg },
        },
        buttonText: {
          value: { _light: COLORS.buttonText, _dark: DARK_COLORS.buttonText },
        },
      },
      shadows: {
        card: {
          value: {
            _light: '0 8px 30px -10px rgb(251 152 144 / 35%)',
            _dark: '0 8px 30px -10px rgb(0 0 0 / 55%)',
          },
        },
        button: {
          value: {
            _light: '0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a',
            _dark: '0 1px 3px 0 #00000055, 0 1px 2px -1px #00000055',
          },
        },
      },
    },
    recipes: {
      formInput: formInputRecipe,
      card: cardRecipe,
      appButton: appButtonRecipe,
      link: linkRecipe,
    },
    slotRecipes: {
      list: listSlotRecipe,
    },
  },
})

export const system = createSystem(defaultConfig, config)
