import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

export const COLORS = {
  text: '#492923',
  background: '#fff9ed',

  pink: '#ffb6bc',
  cyan: '#B6F1F4',
  purple: '#f2c5fd',
  mint: '#b9edd6',
  peach: '#fde4d4',
  white: '#ffffff',
  yellow: '#fdf5df',

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

const config = defineConfig({
  globalCss: {
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
    },
    tokens: {
      fonts: {
        body: { value: `'Nunito', system-ui, sans-serif` },
        heading: { value: `'Nunito', system-ui, sans-serif` },
        fredoka: { value: `'Fredoka', sans-serif` },
      },
      colors: {
        background: { value: COLORS.background },
        pink: { value: COLORS.pink },
        cyan: { value: COLORS.cyan },
        purple: { value: COLORS.purple },
        mint: { value: COLORS.mint },
        peach: { value: COLORS.peach },
        card: { value: COLORS.white },
      },
      shadows: {
        card: { value: '0 8px 30px -10px rgb(251 152 144 / 35%)' },
        button: { value: '0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a' },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
