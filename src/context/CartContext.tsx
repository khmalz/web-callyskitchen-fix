import React, { createContext, useContext, useEffect, useState } from 'react'
import { CartItem, Product } from '../types'
import { useAuth } from './AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  toggleSelectItem: (productId: string) => void
  selectAllItems: (selected: boolean) => void
  clearCart: (selectedOnly?: boolean) => void
  totalItemsCount: number
  selectedItems: CartItem[]
  selectedItemsCount: number
  selectedSubtotal: number
  allSelected: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'calls_kitchen_cart'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const { user } = useAuth()
  const isLive = isSupabaseConfigured()

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err)
    }
  }, [items])

  // Sync with Supabase cart_items when user is logged in
  useEffect(() => {
    if (!user || !isLive) return

    const syncCartWithServer = async () => {
      try {
        const { data: serverItems, error } = await supabase
          .from('cart_items')
          .select('*, product:products(*)')
          .eq('user_id', user.id)

        if (!error && serverItems && serverItems.length > 0) {
          // Merge local and server items
          setItems(prevItems => {
            const mergedMap = new Map<string, CartItem>()

            // Add server items first
            serverItems.forEach(si => {
              if (si.product) {
                mergedMap.set(si.product_id, {
                  id: si.id,
                  product_id: si.product_id,
                  product: si.product,
                  quantity: si.quantity,
                  selected: true,
                })
              }
            })

            // Overlay local items
            prevItems.forEach(localItem => {
              const existing = mergedMap.get(localItem.product_id)
              if (existing) {
                mergedMap.set(localItem.product_id, {
                  ...existing,
                  quantity: Math.max(existing.quantity, localItem.quantity),
                  selected: localItem.selected,
                })
              } else {
                mergedMap.set(localItem.product_id, localItem)
              }
            })

            return Array.from(mergedMap.values())
          })
        }
      } catch (err) {
        console.warn('Could not sync cart with server:', err)
      }
    }

    syncCartWithServer()
  }, [user, isLive])

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) return

    setItems(prevItems => {
      const existing = prevItems.find(item => item.product_id === product.id)
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock)
        return prevItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: newQty, selected: true }
            : item
        )
      } else {
        const newItem: CartItem = {
          id: 'cart-' + Math.random().toString(36).substring(2, 9),
          product_id: product.id,
          product,
          quantity: Math.min(quantity, product.stock),
          selected: true,
        }
        return [...prevItems, newItem]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product_id !== productId))
    
    // Also remove from Supabase if logged in
    if (user && isLive) {
      supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .then()
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.product_id === productId) {
          const maxStock = item.product.stock || 99
          const clampedQty = Math.max(1, Math.min(quantity, maxStock))
          return { ...item, quantity: clampedQty }
        }
        return item
      })
    )

    if (user && isLive) {
      supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .then()
    }
  }

  const toggleSelectItem = (productId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.product_id === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    )
  }

  const selectAllItems = (selected: boolean) => {
    setItems(prevItems =>
      prevItems.map(item => ({ ...item, selected }))
    )
  }

  const clearCart = (selectedOnly = true) => {
    if (selectedOnly) {
      setItems(prevItems => prevItems.filter(item => !item.selected))
    } else {
      setItems([])
    }
  }

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const selectedItems = items.filter(item => item.selected)
  const selectedItemsCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0)
  const selectedSubtotal = selectedItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )
  const allSelected = items.length > 0 && items.every(item => item.selected)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelectItem,
        selectAllItems,
        clearCart,
        totalItemsCount,
        selectedItems,
        selectedItemsCount,
        selectedSubtotal,
        allSelected,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
