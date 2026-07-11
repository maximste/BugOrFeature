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

  pink: '#ffb6bc',
  cyan: '#B6F1F4',
  purple: '#f2c5fd',
  mint: '#b9edd6',
  peach: '#fde4d4',
  white: '#ffffff',
  yellow: '#fdf5df',

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

export const TRANSITION = 'all 0.3s ease'

const formInputRecipe = defineRecipe({
  className: 'form-input',
  base: {
    fontFamily: 'body',
    fontSize: '14px',
    fontWeight: '400',
    color: 'text',
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
      solid: { background: 'buttonBg' },
      white: {
        background: 'card/80',
        border: '1px solid',
        borderColor: 'border',
        _hover: { color: 'buttonBg' },
      },
      cyan: { background: 'cyan' },
    },
  },
  defaultVariants: { variant: 'solid' },
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
      color: COLORS.text,
      background: COLORS.background,
      backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255, 215, 209, 0.4), #0000 40%),
    radial-gradient(circle at 90% 80%, rgba(157, 239, 243, 35%), #0000 40%)`,
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
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
      colors: {
        text: { value: COLORS.text },
        subtitleText: { value: COLORS.subtitleText },
        background: { value: COLORS.background },
        border: { value: COLORS.border },
        danger: { value: COLORS.danger },
        pink: { value: COLORS.pink },
        cyan: { value: COLORS.cyan },
        purple: { value: COLORS.purple },
        mint: { value: COLORS.mint },
        peach: { value: COLORS.peach },
        white: { value: COLORS.white },
        card: { value: COLORS.white },
        buttonBg: { value: COLORS.buttonBg },
        buttonText: { value: COLORS.buttonText },
      },
      shadows: {
        card: { value: '0 8px 30px -10px rgb(251 152 144 / 35%)' },
        cardSoft: { value: '0 8px 30px -10px rgb(251 152 144 / 25%)' },
        cardHover: {
          value:
            '0 12px 36px -8px rgb(251 152 144 / 40%), 0 4px 12px -4px rgb(0 0 0 / 8%)',
        },
        avatar: { value: '0 4px 16px rgb(251 152 144 / 40%)' },
        button: { value: '0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a' },
      },
      radii: {
        card: { value: '24px' },
        pill: { value: '999px' },
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
