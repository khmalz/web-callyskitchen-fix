import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../lib/utils'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'

export const Cart: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    toggleSelectItem,
    selectAllItems,
    selectedItems,
    selectedItemsCount,
    selectedSubtotal,
    allSelected,
  } = useCart()

  const { user } = useAuth()
  const navigate = useNavigate()

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) return

    if (!user) {
      // Redirect to login while setting return state
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <EmptyState
          title="Keranjang Belanja Masih Kosong"
          description="Yuk, pilih aneka keripik pisang dan keripik singkong renyah favoritmu untuk dinikmati bersama teman dan keluarga."
          actionLabel="Mulai Belanja"
          onAction={() => navigate('/catalog')}
          icon={<ShoppingBag className="w-8 h-8 text-caramel-600" />}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-black text-brown-900 tracking-tight mb-8">
        Keranjang Belanja
      </h1>

      {/* Desktop Layout: ~65-70% items list, ~30-35% summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Items List: 7-8 cols / 65%) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Select All Bar */}
          <div className="bg-white rounded-2xl p-4 border border-cream-300 shadow-xs flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => selectAllItems(e.target.checked)}
                className="w-5 h-5 rounded-md text-caramel-600 focus:ring-caramel-500 border-cream-400 cursor-pointer accent-caramel-500"
              />
              <span className="text-sm font-bold text-brown-900">
                Pilih Semua ({items.length} item)
              </span>
            </label>
            <span className="text-xs text-brown-500 font-semibold">
              {selectedItems.length} dipilih untuk checkout
            </span>
          </div>

          {/* Cart Item Cards */}
          <div className="space-y-3">
            {items.map((item) => {
              const maxStock = item.product.stock || 99
              const isOverStock = item.quantity > maxStock
              const itemSubtotal = item.product.price * item.quantity

              return (
                <div
                  key={item.product_id}
                  className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all ${
                    item.selected
                      ? 'border-caramel-300 shadow-sm'
                      : 'border-cream-300 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Item Checkbox */}
                    <div className="pt-2">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleSelectItem(item.product_id)}
                        className="w-5 h-5 rounded-md text-caramel-600 focus:ring-caramel-500 border-cream-400 cursor-pointer accent-caramel-500"
                        aria-label={`Pilih ${item.product.name}`}
                      />
                    </div>

                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-cream-100 p-1.5 shrink-0 border border-cream-200">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-caramel-600 uppercase tracking-wide">
                            {item.product.category?.name || 'Calls Kitchen'}
                          </span>
                          <h3 className="text-base font-extrabold text-brown-900 truncate">
                            {item.product.name}
                          </h3>
                          <span className="text-xs font-semibold text-brown-500">
                            {formatRupiah(item.product.price)} / bks
                          </span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="p-1.5 text-brown-400 hover:text-red-600 rounded-lg transition-colors"
                          title="Hapus dari keranjang"
                          aria-label={`Hapus ${item.product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Stock Warning if stock is limited */}
                      {isOverStock && (
                        <p className="text-xs text-red-600 font-semibold mt-1">
                          Maksimal pembelian {maxStock} pcs sesuai sisa stok.
                        </p>
                      )}

                      {/* Quantity Controls and Subtotal */}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cream-100">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1.5 rounded-lg text-brown-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Kurangi kuantitas"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold text-xs sm:text-sm text-brown-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            disabled={item.quantity >= maxStock}
                            className="p-1.5 rounded-lg text-brown-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Tambah kuantitas"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <span className="text-[10px] text-brown-400 block font-medium">Subtotal</span>
                          <span className="text-sm sm:text-base font-black text-brown-900">
                            {formatRupiah(itemSubtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column (Summary Card: 4-5 cols / 35%) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 border border-cream-300 shadow-sm sticky top-28 space-y-6">
            <h2 className="text-lg font-black text-brown-900 pb-3 border-b border-cream-200">
              Ringkasan Belanja
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-brown-600">
                <span>Total Item Terpilih</span>
                <span className="font-bold text-brown-900">{selectedItemsCount} pcs</span>
              </div>
              <div className="flex items-center justify-between text-brown-600">
                <span>Subtotal Produk</span>
                <span className="font-bold text-brown-900">{formatRupiah(selectedSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-brown-600">
                <span>Perkiraan Ongkos Kirim</span>
                <span className="text-xs text-caramel-700 font-semibold bg-caramel-50 px-2 py-0.5 rounded">
                  Dihitung di Checkout
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm font-bold text-brown-800">Total Sementara</span>
                <span className="text-2xl font-black text-brown-900">
                  {formatRupiah(selectedSubtotal)}
                </span>
              </div>

              {selectedItems.length === 0 ? (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 font-medium mb-3 text-center">
                  Centang produk yang ingin kamu beli untuk melanjutkan checkout.
                </div>
              ) : null}

              <Button
                onClick={handleProceedToCheckout}
                disabled={selectedItems.length === 0}
                variant="primary"
                size="lg"
                className="w-full text-base font-extrabold shadow-md"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Lanjut ke Checkout ({selectedItemsCount})
              </Button>
            </div>

            {/* Trust Notice */}
            <div className="pt-2 flex items-center gap-2 text-xs text-brown-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Kemasan aman dengan kardus tebal dan bubble wrap gratis.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
