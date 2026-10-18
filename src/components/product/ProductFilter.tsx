import React from 'react'
import { Search, ArrowUpDown } from 'lucide-react'

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular'

interface ProductFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  categories: Array<{ id: string; name: string }>
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-cream-300 shadow-sm space-y-4">
      {/* Search Input */}
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Cari keripik pisang atau singkong
        </label>
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari rasa cokelat, balado, original..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-100/70 border border-cream-300 focus:bg-white focus:border-caramel-500 focus:ring-2 focus:ring-caramel-200 outline-none text-sm text-brown-900 transition-all placeholder:text-brown-400"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-brown-400 hover:text-brown-700 bg-cream-200 px-2 py-0.5 rounded-md"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Categories & Sorting Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-cream-200">
        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="tablist" aria-label="Filter Kategori">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-brown-900 text-cream-50 shadow-sm'
                : 'bg-cream-100 hover:bg-cream-200 text-brown-700 border border-cream-300'
            }`}
            role="tab"
            aria-selected={selectedCategory === 'all'}
          >
            Semua Camilan
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brown-900 text-cream-50 shadow-sm'
                    : 'bg-cream-100 hover:bg-cream-200 text-brown-700 border border-cream-300'
                }`}
                role="tab"
                aria-selected={isSelected}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-auto">
            <label htmlFor="sort-select" className="sr-only">
              Urutkan Produk
            </label>
            <div className="flex items-center gap-1.5 px-3 py-2 bg-cream-100 border border-cream-300 rounded-xl text-xs font-bold text-brown-800">
              <ArrowUpDown className="w-3.5 h-3.5 text-caramel-600 shrink-0" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent border-none outline-none font-bold text-brown-900 cursor-pointer text-xs"
              >
                <option value="popular">Paling Populer</option>
                <option value="newest">Terbaru</option>
                <option value="price-asc">Harga: Termurah</option>
                <option value="price-desc">Harga: Tertinggi</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
