import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Search,
} from 'lucide-react'
import { Order, PaymentRecord } from '../../types'
import { formatRupiah, formatDate } from '../../lib/utils'
import { StatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { CODAdapter } from '../../lib/payment/codAdapter'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export const AdminPayments: React.FC = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchPayments = async () => {
    setLoading(true)
    if (isSupabaseConfigured()) {
      try {
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })

        if (ordersData) setOrders(ordersData)

        const { data: paymentsData } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false })

        if (paymentsData) setPayments(paymentsData)
      } catch (err) {
        console.warn('Error fetching live payments:', err)
      }
    }

    try {
      const local: Order[] = JSON.parse(
        localStorage.getItem('calls_kitchen_local_orders') || '[]'
      )
      if (orders.length === 0) setOrders(local)
    } catch {
      // Ignore
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  // Admin action for recording COD Cash collection
  const handleConfirmCODCash = async (order: Order) => {
    const adminName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin Calls Kitchen'
    const confirmPrompt = window.confirm(
      `Konfirmasi bahwa uang tunai sebesar ${formatRupiah(order.total_amount)} untuk pesanan ${order.order_number} telah Anda terima secara fisik?`
    )
    if (!confirmPrompt) return

    setActionLoading(true)
    setActionFeedback(null)

    const result = await CODAdapter.confirmCashReceived(
      order.id,
      user?.id || 'admin',
      adminName
    )

    if (result.success) {
      setActionFeedback(result.message)
      // Update local state
      const now = new Date().toISOString()
      const updatedOrders = orders.map((o) =>
        o.id === order.id ? { ...o, payment_status: 'paid' as const, updated_at: now } : o
      )
      setOrders(updatedOrders)
      localStorage.setItem('calls_kitchen_local_orders', JSON.stringify(updatedOrders))
    } else {
      setActionFeedback(result.message)
    }

    setActionLoading(false)
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.recipient_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-cream-300">
        <h1 className="text-3xl font-black text-brown-900 tracking-tight">Kelola Pembayaran</h1>
        <p className="text-sm text-brown-600 mt-1">
          Daftar transaksi pembayaran QRIS resmi dan pencatatan penerimaan uang tunai COD.
        </p>
      </div>

      {actionFeedback && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Security Rule Warning */}
      <div className="p-4 bg-cream-50 rounded-2xl border border-cream-300 text-xs text-brown-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-caramel-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-brown-900 block">
            Kebijakan Integritas Pembayaran Calls Kitchen
          </span>
          <p className="leading-relaxed text-[11px] text-brown-500">
            Transaksi QRIS diverifikasi secara otomatis melalui webhook dan server payment gateway. Status pembayaran COD hanya dapat dicatat lunas oleh admin setelah uang tunai fisik telah benar-benar diterima.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-cream-300 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-brown-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari no. pesanan pembayaran..."
          className="w-full text-sm bg-transparent outline-none text-brown-900"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-cream-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-cream-200 text-brown-600 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No. Pesanan</th>
                <th className="py-3.5 px-4">Metode</th>
                <th className="py-3.5 px-4">Nominal Tagihan</th>
                <th className="py-3.5 px-4">Status Pembayaran</th>
                <th className="py-3.5 px-4">Waktu Transaksi</th>
                <th className="py-3.5 px-4">Aksi Verifikasi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100 font-medium">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => {
                  const isCOD = o.payment_method === 'cod'
                  const isPaid = o.payment_status === 'paid'

                  return (
                    <tr key={o.id} className="hover:bg-cream-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brown-900">
                        {o.order_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={o.payment_method} type="method" />
                      </td>
                      <td className="py-3.5 px-4 font-black text-brown-900">
                        {formatRupiah(o.total_amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={o.payment_status} type="payment" />
                      </td>
                      <td className="py-3.5 px-4 text-brown-600">
                        {formatDate(o.created_at)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isCOD && !isPaid ? (
                          <Button
                            onClick={() => handleConfirmCODCash(o)}
                            isLoading={actionLoading}
                            variant="primary"
                            size="sm"
                            className="font-bold text-xs"
                          >
                            Catat Uang Tunai Diterima
                          </Button>
                        ) : isPaid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Terverifikasi Lunas</span>
                          </span>
                        ) : (
                          <span className="text-brown-400 font-semibold text-xs">
                            Menunggu QRIS Gateway
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-brown-400">
                    Belum ada riwayat transaksi pembayaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
