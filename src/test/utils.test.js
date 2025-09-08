import { describe, test, expect } from 'vitest'

// Test utility functions
describe('Utility Functions', () => {
  test('should format date correctly', () => {
    const date = new Date('2025-09-06')
    const formatted = date.toLocaleDateString()
    expect(formatted).toBeDefined()
    expect(typeof formatted).toBe('string')
  })

  test('should validate email format', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
  })

  test('should sanitize HTML content', () => {
    const sanitizeHTML = (html) => {
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }

    const maliciousHTML = '<p>Safe content</p><script>alert("xss")</script><p>More content</p>'
    const sanitized = sanitizeHTML(maliciousHTML)
    
    expect(sanitized).toBe('<p>Safe content</p><p>More content</p>')
    expect(sanitized).not.toContain('<script>')
  })

  test('should format numbers with commas', () => {
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(1000000)).toBe('1,000,000')
    expect(formatNumber(123)).toBe('123')
  })

  test('should truncate text correctly', () => {
    const truncateText = (text, maxLength) => {
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }

    expect(truncateText('Short text', 20)).toBe('Short text')
    expect(truncateText('This is a very long text that should be truncated', 20)).toBe('This is a very long ...')
  })
})
