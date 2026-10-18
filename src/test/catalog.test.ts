import { describe, it, expect } from 'vitest'
import { INITIAL_PRODUCTS } from '../data/seedData'

describe('Catalog Search and Filter Logic', () => {
  it('filters products correctly by category', () => {
    const pisangProducts = INITIAL_PRODUCTS.filter((p) => p.category_id === 'cat-pisang')
    const singkongProducts = INITIAL_PRODUCTS.filter((p) => p.category_id === 'cat-singkong')

    expect(pisangProducts.length).toBe(6)
    expect(singkongProducts.length).toBe(6)
    expect(pisangProducts.every((p) => p.name.includes('Pisang'))).toBe(true)
    expect(singkongProducts.every((p) => p.name.includes('Singkong'))).toBe(true)
  })

  it('searches products by flavor keyword', () => {
    const query = 'balado'
    const results = INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )

    expect(results.length).toBeGreaterThanOrEqual(2) // Pisang Balado & Singkong Balado
  })

  it('sorts products by price ascending correctly', () => {
    const sorted = [...INITIAL_PRODUCTS].sort((a, b) => a.price - b.price)
    expect(sorted[0].price).toBeLessThanOrEqual(sorted[sorted.length - 1].price)
  })

  it('sorts products by price descending correctly', () => {
    const sorted = [...INITIAL_PRODUCTS].sort((a, b) => b.price - a.price)
    expect(sorted[0].price).toBeGreaterThanOrEqual(sorted[sorted.length - 1].price)
  })
})
