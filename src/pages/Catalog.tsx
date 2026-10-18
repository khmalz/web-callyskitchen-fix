import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductFilter, SortOption } from '../components/product/ProductFilter'
import { ProductCard } from '../components/product/ProductCard'
import { ProductCardSkeleton } from '../components/common/Skeleton'
import { EmptyState } from '../components/common/EmptyState'
import { Product } from '../types'
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/seedData'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const Catalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCat = searchParams.get('category') || 'all'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat)
  const [sortBy, setSortBy] = useState<SortOption>('popular')

  // Keep state synced with URL search params
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId)
    if (catId === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', catId)
    }
    setSearchParams(searchParams, { replace: true })
  }

  // Load products from DB or Seed data
  useEffect(() => {
    let mounted = true
    const fetchCatalog = async () => {
      setLoading(true)
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*, category:categories(*)')
            .eq('is_archived', false)
            .order('name')

          if (!error && data && data.length > 0 && mounted) {
            setProducts(data)
            setLoading(false)
            return
          }
        } catch (err) {
          console.warn('Failed to load products from live Supabase, using seed data:', err)
        }
      }

      if (mounted) {
        setProducts(INITIAL_PRODUCTS)
        setLoading(false)
      }
    }

    fetchCatalog()

    return () => {
      mounted = false
    }
  }, [])

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let list = [...products]

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category_id === selectedCategory)
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    // Sort order
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
        break
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'popular':
      default:
        list.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0))
        break
    }

    return list
  }, [products, selectedCategory, searchQuery, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-brown-900 tracking-tight mb-2">
          Katalog Camilan
        </h1>
        <p className="text-sm sm:text-base text-brown-600">
          Sekali Gigit, Langsung Nagih! Keripik Favorit 150 Gram.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <ProductFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={INITIAL_CATEGORIES}
      />

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-brown-500 px-1">
        <span>
          Menampilkan <strong className="text-brown-900">{filteredProducts.length}</strong> varian camilan
        </span>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('')
              handleCategoryChange('all')
            }}
            className="text-caramel-600 hover:text-caramel-700 underline cursor-pointer"
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Product Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Camilan Tidak Ditemukan"
          description={
            searchQuery
              ? `Tidak ada produk yang cocok dengan pencarian "${searchQuery}". Coba gunakan kata kunci rasa lain.`
              : 'Tidak ada produk dalam kategori ini saat ini.'
          }
          actionLabel="Lihat Semua Produk"
          onAction={() => {
            setSearchQuery('')
            handleCategoryChange('all')
          }}
        />
      )}
    </div>
  )
}
