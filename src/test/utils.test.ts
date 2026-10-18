import { describe, it, expect } from 'vitest'
import { formatRupiah, formatDate, generateOrderNumber, isValidIndonesianPhone } from '../lib/utils'

describe('Helper Utilities', () => {
  it('formatRupiah formats numbers correctly into Indonesian currency format', () => {
    expect(formatRupiah(20000)).toMatch(/Rp\s*20\.000/)
    expect(formatRupiah(0)).toMatch(/Rp\s*0/)
    expect(formatRupiah(150000)).toMatch(/Rp\s*150\.000/)
    expect(formatRupiah(NaN)).toBe('Rp 0')
  })

  it('generateOrderNumber generates unique format CK-YYYYMMDD-XXXX', () => {
    const orderNum = generateOrderNumber()
    expect(orderNum).toMatch(/^CK-\d{8}-\d{4}$/)
  })

  it('isValidIndonesianPhone validates Indonesian mobile numbers', () => {
    expect(isValidIndonesianPhone('081234567890')).toBe(true)
    expect(isValidIndonesianPhone('+6281234567890')).toBe(true)
    expect(isValidIndonesianPhone('6281987654321')).toBe(true)
    // Invalid
    expect(isValidIndonesianPhone('12345')).toBe(false)
    expect(isValidIndonesianPhone('0217654321')).toBe(false) // Landline
    expect(isValidIndonesianPhone('abcdefg')).toBe(false)
  })

  it('formatDate formats ISO dates gracefully', () => {
    const result = formatDate('2026-10-18T10:00:00.000Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    expect(formatDate(undefined)).toBe('-')
  })
})
