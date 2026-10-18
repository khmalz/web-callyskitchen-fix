import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Archive,
  Search,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { Product, Category } from '../../types'
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../../data/seedData'
import { formatRupiah } from '../../lib/utils'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { uploadProductImage } from '../../lib/storage'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  // Form field states
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('cat-pisang')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(20000)
  const [stock, setStock] = useState<number>(50)
  const [imageUrl, setImageUrl] = useState('/products/pisang-original.svg')
  const [isActive, setIsActive] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .order('name')

        if (!error && data && data.length > 0) {
          setProducts(data)
          setLoading(false)
          return
        }
      } catch (err) {
        console.warn('Failed to load products from live Supabase:', err)
      }
    }

    // Fallback to local storage or seed data
    try {
      const saved = localStorage.getItem('calls_kitchen_admin_products')
      if (saved) {
        setProducts(JSON.parse(saved))
      } else {
        setProducts(INITIAL_PRODUCTS)
      }
    } catch {
      setProducts(INITIAL_PRODUCTS)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const saveProductsLocal = (updated: Product[]) => {
    setProducts(updated)
    localStorage.setItem('calls_kitchen_admin_products', JSON.stringify(updated))
  }

  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setName('')
    setCategoryId('cat-pisang')
    setDescription('')
    setPrice(20000)
    setStock(50)
    setImageUrl('/products/pisang-original.svg')
    setIsActive(true)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p)
    setName(p.name)
    setCategoryId(p.category_id)
    setDescription(p.description)
    setPrice(p.price)
    setStock(p.stock)
    setImageUrl(p.image_url)
    setIsActive(p.is_active)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setFormError(null)

    const result = await uploadProductImage(file)
    if (result.error) {
      setFormError(result.error)
    } else if (result.url) {
      setImageUrl(result.url)
    }
    setIsUploading(false)
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError('Nama produk wajib diisi.')
      return
    }
    if (price <= 0) {
      setFormError('Harga harus lebih dari 0.')
      return
    }
    if (stock < 0) {
      setFormError('Stok tidak boleh negatif.')
      return
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const now = new Date().toISOString()

    if (editingProduct) {
      // Edit
      const updatedProduct: Product = {
        ...editingProduct,
        name,
        slug,
        category_id: categoryId,
        description,
        price,
        stock,
        image_url: imageUrl,
        is_active: isActive,
        updated_at: now,
      }

      if (isSupabaseConfigured()) {
        try {
          await supabase
            .from('products')
            .update({
              name,
              slug,
              category_id: categoryId,
              description,
              price,
              stock,
              image_url: imageUrl,
              is_active: isActive,
              updated_at: now,
            })
            .eq('id', editingProduct.id)
        } catch (err) {
          console.warn('Error updating live product:', err)
        }
      }

      const updatedList = products.map((p) =>
        p.id === editingProduct.id ? updatedProduct : p
      )
      saveProductsLocal(updatedList)
      setFormSuccess('Produk berhasil diperbarui!')
    } else {
      // Add
      const newProduct: Product = {
        id: 'prod-' + Date.now(),
        name,
        slug,
        category_id: categoryId,
        description,
        price,
        stock,
        image_url: imageUrl,
        is_active: isActive,
        is_archived: false,
        sold_count: 0,
        rating: 5.0,
        created_at: now,
        updated_at: now,
      }

      if (isSupabaseConfigured()) {
        try {
          await supabase.from('products').insert([
            {
              name,
              slug,
              category_id: categoryId,
              description,
              price,
              stock,
              image_url: imageUrl,
              is_active: isActive,
              is_archived: false,
            },
          ])
        } catch (err) {
          console.warn('Error inserting live product:', err)
        }
      }

      const updatedList = [newProduct, ...products]
      saveProductsLocal(updatedList)
      setFormSuccess('Produk baru berhasil ditambahkan!')
    }

    setIsModalOpen(false)
    setTimeout(() => setFormSuccess(null), 3000)
  }

  // Soft Delete / Archive product safely
  const handleArchiveProduct = async (product: Product) => {
    const confirmArchive = window.confirm(
      `Apakah Anda yakin ingin mengarsipkan produk "${product.name}"? Produk tidak akan dihapus permanen agar riwayat pesanan tetap aman.`
    )
    if (!confirmArchive) return

    const now = new Date().toISOString()
    const updated = products.map((p) =>
      p.id === product.id ? { ...p, is_archived: true, updated_at: now } : p
    )
    saveProductsLocal(updated)

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('products')
          .update({ is_archived: true, updated_at: now })
          .eq('id', product.id)
      } catch (err) {
        console.warn('Error archiving product on DB:', err)
      }
    }
  }

  // Toggle active/inactive status
  const handleToggleActive = async (product: Product) => {
    const newStatus = !product.is_active
    const now = new Date().toISOString()
    const updated = products.map((p) =>
      p.id === product.id ? { ...p, is_active: newStatus, updated_at: now } : p
    )
    saveProductsLocal(updated)

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('products')
          .update({ is_active: newStatus, updated_at: now })
          .eq('id', product.id)
      } catch (err) {
        console.warn('Error toggling product status on DB:', err)
      }
    }
  }

  const activeProducts = products.filter(
    (p) =>
      !p.is_archived &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category_id.includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-300">
        <div>
          <h1 className="text-3xl font-black text-brown-900 tracking-tight">Kelola Produk</h1>
          <p className="text-sm text-brown-600 mt-1">
            Tambah, ubah harga, update stok, dan atur ketersediaan katalog keripik.
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold self-start sm:self-auto"
        >
          Tambah Produk Baru
        </Button>
      </div>

      {formSuccess && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-cream-300 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-brown-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk keripik..."
          className="w-full text-sm bg-transparent outline-none text-brown-900 placeholder:text-brown-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-brown-500 font-semibold"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-brown-600 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-medium">
              {activeProducts.map((p) => (
                <tr key={p.id} className="hover:bg-cream-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl bg-cream-100 p-1 object-contain border border-cream-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-sm text-brown-900 block">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-brown-500 line-clamp-1 max-w-xs">
                          {p.description}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-brown-700">
                    {p.category?.name ||
                      (p.category_id.includes('pisang') ? 'Keripik Pisang' : 'Keripik Singkong')}
                  </td>
                  <td className="py-3.5 px-4 font-black text-brown-900">
                    {formatRupiah(p.price)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold px-2.5 py-1 rounded-lg ${
                        p.stock <= 0
                          ? 'bg-red-100 text-red-700'
                          : p.stock <= 10
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-cream-200 text-brown-800'
                      }`}
                    >
                      {p.stock} pcs
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                        p.is_active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title="Klik untuk mengubah status aktif"
                    >
                      {p.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{p.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 text-brown-600 hover:text-caramel-600 hover:bg-cream-200 rounded-lg transition-colors"
                        title="Edit Produk"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchiveProduct(p)}
                        className="p-2 text-brown-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Arsipkan Produk (Soft Delete)"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-brown-800 uppercase tracking-wider mb-1">
              Nama Produk
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Keripik Pisang Cokelat Lumer"
              className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 outline-none text-sm text-brown-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brown-800 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 outline-none text-sm text-brown-900 cursor-pointer"
              >
                <option value="cat-pisang">Keripik Pisang</option>
                <option value="cat-singkong">Keripik Singkong</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-brown-800 uppercase tracking-wider mb-1">
                Harga (Rp)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={1000}
                step={500}
                className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 outline-none text-sm text-brown-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brown-800 uppercase tracking-wider mb-1">
                Stok Tersedia (pcs)
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 outline-none text-sm text-brown-900"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                id="active-toggle"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded accent-caramel-500 cursor-pointer"
              />
              <label htmlFor="active-toggle" className="font-bold text-brown-800 cursor-pointer text-sm">
                Produk Aktif untuk Dijual
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-brown-800 uppercase tracking-wider mb-1">
              Deskripsi Produk
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kelezatan rasa, kerenyahan, dan bahan alami keripik ini..."
              className="w-full px-3 py-2.5 rounded-xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 outline-none text-sm text-brown-900 resize-none"
            />
          </div>

          {/* Image Upload / URL */}
          <div className="p-4 bg-cream-50 rounded-2xl border border-cream-300 space-y-3">
            <span className="block font-bold text-brown-800 uppercase tracking-wider">
              Foto Produk (Supabase Storage)
            </span>
            <div className="flex items-center gap-4">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-16 h-16 rounded-xl bg-white object-contain p-1 border border-cream-300 shrink-0"
              />
              <div className="space-y-1">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-cream-300 hover:bg-cream-100 text-brown-800 font-bold cursor-pointer text-xs shadow-xs">
                  <UploadCloud className="w-4 h-4 text-caramel-600" />
                  <span>{isUploading ? 'Mengunggah...' : 'Pilih File Gambar (Maks 2MB)'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <span className="text-[10px] text-brown-400 block">
                  Format didukung: PNG, JPG, WEBP, SVG.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" className="font-bold">
              {editingProduct ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
