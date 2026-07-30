import { describe, expect, it } from 'vitest'

import {
  buildCspHeaderValue,
  buildDevSpaCspHeaderValue,
  injectScriptNonces,
  parseOrigin,
} from './csp'

describe('parseOrigin', () => {
  it('returns origin for valid URL', () => {
    expect(parseOrigin('http://localhost:3001/api')).toBe(
      'http://localhost:3001'
    )
  })

  it('returns null for invalid URL', () => {
    expect(parseOrigin('not-a-url')).toBeNull()
  })
})

describe('buildCspHeaderValue', () => {
  it('includes nonce in script-src', () => {
    const policy = buildCspHeaderValue({
      nonce: 'test-nonce',
      isDev: false,
      apiOrigin: 'http://localhost:3001',
    })

    expect(policy).toContain("script-src 'self' 'nonce-test-nonce'")
    expect(policy).not.toContain("'unsafe-eval'")
  })

  it('allows vite HMR in dev mode', () => {
    const policy = buildCspHeaderValue({
      nonce: 'dev-nonce',
      isDev: true,
      apiOrigin: 'http://localhost:3001',
      clientPort: 3000,
    })

    expect(policy).toContain("'unsafe-eval'")
    expect(policy).toContain('ws://localhost:3000')
    expect(policy).toContain('http://localhost:3001')
  })

  it('restricts object embeds and allows practicum images', () => {
    const policy = buildCspHeaderValue({
      nonce: 'x',
      isDev: false,
    })

    expect(policy).toContain("object-src 'none'")
    expect(policy).toContain('https://ya-praktikum.tech')
    expect(policy).toContain('https://oauth.yandex.ru')
  })
})

describe('injectScriptNonces', () => {
  it('adds nonce attribute to script tags without one', () => {
    const html =
      '<script src="/app.js"></script><script nonce="keep">x</script>'
    const result = injectScriptNonces(html, 'abc123')

    expect(result).toContain('<script nonce="abc123" src="/app.js">')
    expect(result).toContain('<script nonce="keep">')
  })
})

describe('buildDevSpaCspHeaderValue', () => {
  it('does not require nonce for SPA dev server', () => {
    const policy = buildDevSpaCspHeaderValue('http://localhost:3001', 3000)

    expect(policy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'")
    expect(policy).not.toContain('nonce-')
  })
})
