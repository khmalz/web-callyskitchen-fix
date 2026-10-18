import { describe, it, expect } from 'vitest'
import { CartItem, Product } from '../types'

describe('Cart Business Logic', () => {
  const sampleProduct1: Product = {
    id: 'prod-1',
    name: 'Keripik Pisang Cokelat',
    slug: 'keripik-pisang-cokelat',
    category_id: 'cat-pisang',
    description: 'Enak',
    price: 20000,
    stock: 10,
    image_url: '/img.png',
    is_active: true,
    is_archived: false,
  }

  const sampleProduct2: Product = {
    id: 'prod-2',
    name: 'Keripik Singkong Balado',
    slug: 'keripik-singkong-balado',
    category_id: 'cat-singkong',
    description: 'Pedas',
    price: 16000,
    stock: 5,
    image_url: '/img2.png',
    is_active: true,
    is_archived: false,
  }

  it('calculates selected subtotal strictly for selected items only', () => {
    const items: CartItem[] = [
      { id: 'c1', product_id: 'prod-1', product: sampleProduct1, quantity: 2, selected: true },
      { id: 'c2', product_id: 'prod-2', product: sampleProduct2, quantity: 3, selected: false },
    ]

    const selectedItems = items.filter((i) => i.selected)
    const selectedSubtotal = selectedItems.reduce(
      (acc, i) => acc + i.product.price * i.quantity,
      0
    )

    // Only item 1 (2 * 20000 = 40000) should be included, unselected item 2 excluded!
    expect(selectedItems.length).toBe(1)
    expect(selectedSubtotal).toBe(40000)
  })

  it('preserves unselected items when clearing selected items for checkout', () => {
    const items: CartItem[] = [
      { id: 'c1', product_id: 'prod-1', product: sampleProduct1, quantity: 2, selected: true },
      { id: 'c2', product_id: 'prod-2', product: sampleProduct2, quantity: 3, selected: false },
    ]

    // Simulate clearCart(true) (selectedOnly)
    const remainingItems = items.filter((i) => !i.selected)
    expect(remainingItems.length).toBe(1)
    expect(remainingItems[0].product_id).toBe('prod-2')
  })

  it('clamps quantity within valid stock bounds [1, product.stock]', () => {
    const maxStock = sampleProduct2.stock // 5

    const clampQty = (reqQty: number) => Math.max(1, Math.min(reqQty, maxStock))

    expect(clampQty(0)).toBe(1) // Cannot go below 1
    expect(clampQty(-3)).toBe(1)
    expect(clampQty(3)).toBe(3) // Valid
    expect(clampQty(5)).toBe(5) // At max stock
    expect(clampQty(12)).toBe(5) // Clamped to max stock
  })
})
