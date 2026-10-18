import React, { useState } from 'react'
import { Plus, Check, Star } from 'lucide-react'
import { Product } from '../../types'
import { formatRupiah } from '../../lib/utils'
import { useCart } from '../../context/CartContext'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isOutOfStock) return

    addToCart(product, 1)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 1200)
  }

  return (
    <div className="group bg-white rounded-3xl p-4 border border-cream-300 hover:border-caramel-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top badges */}
      <div className="relative w-full aspect-square rounded-2xl bg-cream-100 overflow-hidden mb-4 flex items-center justify-center p-2">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback image if needed
            (e.target as HTMLImageElement).src = '/products/pisang-original.svg'
          }}
        />

        {/* Stock / Promotion Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-red-600 text-white rounded-lg shadow-sm">
              Habis
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-500 text-white rounded-lg shadow-sm">
              Sisa {product.stock}
            </span>
          ) : null}
        </div>

        {/* Rating badge */}
        {product.rating && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-lg text-xs font-bold text-brown-900 shadow-xs border border-cream-200">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col">
        <span className="text-xs font-semibold text-caramel-600 tracking-wide uppercase mb-1">
          {product.category?.name || (product.category_id.includes('pisang') ? 'Keripik Pisang' : 'Keripik Singkong')}
        </span>
        <h3 className="text-base font-extrabold text-brown-900 group-hover:text-caramel-700 transition-colors line-clamp-1 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-brown-500 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Price and Cart Action */}
        <div className="mt-auto pt-3 border-t border-cream-200 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-brown-400">Harga Satuan</span>
            <span className="text-lg font-black text-brown-900">
              {formatRupiah(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
              isAdded
                ? 'bg-emerald-600 text-white scale-95'
                : isOutOfStock
                ? 'bg-cream-200 text-brown-400 cursor-not-allowed'
                : 'bg-caramel-500 hover:bg-caramel-600 text-white shadow-sm hover:shadow'
            }`}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Masuk!</span>
              </>
            ) : isOutOfStock ? (
              <span>Habis</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Beli</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
