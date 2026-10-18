import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  Copy,
  Truck,
  ChevronRight,
  HelpCircle,
} from 'lucide-react'
import { formatRupiah } from '../lib/utils'
import { Button } from '../components/common/Button'
import { StatusBadge } from '../components/common/Badge'
import { QRISAdapter } from '../lib/payment/qrisAdapter'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Order, PaymentRecord } from '../types'

export const Payment: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [searchParams] = useSearchParams()
  const orderNumberParam = searchParams.get('orderNumber') || ''
  const methodParam = searchParams.get('method') || 'qris'

  const [order, setOrder] = useState<Order | null>(null)
  const [payment, setPayment] = useState<PaymentRecord | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [copied, setCopied] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  // Fetch Order and Payment details
  const fetchOrderDetails = async () => {
    if (!orderId) return

    if (isSupabaseConfigured()) {
      try {
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('id', orderId)
          .single()

        if (!orderErr && orderData) {
          setOrder(orderData)
        }

        const { data: paymentData } = await supabase
          .from('payments')
          .select('*')
          .eq('order_id', orderId)
          .single()

        if (paymentData) {
          setPayment(paymentData)
        }
      } catch (err) {
        console.warn('Error fetching order from live DB, checking local store:', err)
      }
    }

    // Local fallback check
    if (!order) {
      try {
        const localOrders: Order[] = JSON.parse(
          localStorage.getItem('calls_kitchen_local_orders') || '[]'
        )
        const found = localOrders.find(
          (o) => o.id === orderId || o.order_number === orderNumberParam
        )
        if (found) {
          setOrder(found)
        }
      } catch {
        // Ignore
      }
    }
  }

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  // Secure Server-side status check
  const handleCheckStatus = async () => {
    if (!orderId) return
    setCheckingStatus(true)
    setStatusMessage(null)

    const ref = payment?.gateway_reference || `SANDBOX-QRIS-${order?.order_number || orderNumberParam}`
    const result = await QRISAdapter.checkPaymentStatus(orderId, ref)

    if (result.isPaid) {
      setStatusMessage('Pembayaran berhasil diverifikasi oleh server! Pesanan Anda sedang diproses.')
      if (order) {
        setOrder({ ...order, payment_status: 'paid', status: 'processing' })
      }
      if (payment) {
        setPayment({ ...payment, status: 'paid' })
      }
    } else {
      setStatusMessage(result.message)
    }

    setCheckingStatus(false)
  }

  // Developer sandbox payment simulation (ONLY in sandbox mode)
  const handleSandboxSimulateSuccess = async () => {
    if (!orderId) return
    setCheckingStatus(true)
    const ok = await QRISAdapter.simulateSandboxPaymentSuccess(orderId)
    if (ok) {
      setStatusMessage('Simulasi Sandbox Berhasil: Pembayaran ditandai lunas oleh simulator.')
      if (order) {
        setOrder({ ...order, payment_status: 'paid', status: 'processing' })
      }
      if (payment) {
        setPayment({ ...payment, status: 'paid' })
      }
    }
    setCheckingStatus(false)
  }

  const handleCopyOrderNumber = () => {
    const num = order?.order_number || orderNumberParam
    if (num) {
      navigator.clipboard.writeText(num)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isPaid = order?.payment_status === 'paid' || payment?.status === 'paid'
  const isCOD = (order?.payment_method || methodParam) === 'cod'
  const orderNumber = order?.order_number || orderNumberParam
  const totalAmount = order?.total_amount || 0
  const qrString =
    payment?.payment_details?.qr_string ||
    `00020101021226680016ID.GOPAY.WWW011893600914000${orderNumber.replace(/[^0-9]/g, '').padEnd(10, '0')}0215ID102002130398651040000520454115303360540${totalAmount}5802ID5913Calls Kitchen6007Jakarta62300126${orderNumber}6304`

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-brown-500 mb-6">
        <Link to="/" className="hover:text-caramel-600">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/cart" className="hover:text-caramel-600">
          Keranjang
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-brown-900">Pembayaran</span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-lg space-y-8">
        {/* Header Status Banner */}
        <div className="text-center space-y-2 pb-6 border-b border-cream-200">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-cream-100 mb-2">
            {isPaid ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
            ) : isCOD ? (
              <Truck className="w-12 h-12 text-brown-700" />
            ) : (
              <Clock className="w-12 h-12 text-caramel-600 animate-pulse" />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-brown-900">
            {isPaid
              ? 'Pembayaran Berhasil Diverifikasi!'
              : isCOD
              ? 'Pesanan COD Berhasil Dibuat'
              : 'Menunggu Pembayaran QRIS'}
          </h1>

          <p className="text-sm text-brown-600 max-w-md mx-auto">
            {isPaid
              ? 'Terima kasih! Pesanan keripik renyah Anda sedang disiapkan dan akan segera dikirim.'
              : isCOD
              ? 'Silakan siapkan uang pas saat kurir mengantarkan pesanan keripik Anda.'
              : 'Pindai kode QRIS dinamis di bawah menggunakan aplikasi mobile banking atau e-wallet Anda.'}
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <StatusBadge status={order?.payment_status || (isCOD ? 'unpaid' : 'pending')} type="payment" />
            <StatusBadge status={order?.status || 'confirmed'} type="order" />
          </div>
        </div>

        {/* Order Details Summary Box */}
        <div className="bg-cream-50 rounded-2xl p-5 border border-cream-200 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-brown-500 font-semibold">Nomor Pesanan</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-brown-900">{orderNumber}</span>
              <button
                onClick={handleCopyOrderNumber}
                className="p-1 text-brown-400 hover:text-caramel-600 rounded transition-colors"
                title="Salin nomor pesanan"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && <span className="text-[10px] text-emerald-600 font-bold">Disalin!</span>}
            </div>
          </div>

          {totalAmount > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-brown-500 font-semibold">Total Tagihan</span>
              <span className="text-xl font-black text-caramel-600">
                {formatRupiah(totalAmount)}
              </span>
            </div>
          )}

          {order?.recipient_name && (
            <div className="flex items-start justify-between text-xs pt-2 border-t border-cream-200 text-brown-600">
              <span className="font-semibold text-brown-500">Penerima &amp; Alamat</span>
              <span className="text-right max-w-xs font-medium">
                {order.recipient_name} ({order.recipient_phone})<br />
                {order.shipping_address}
              </span>
            </div>
          )}
        </div>

        {/* QRIS Display Section */}
        {!isCOD && !isPaid && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-cream-100/60 rounded-3xl border border-cream-300">
              <div className="bg-white p-5 rounded-2xl shadow-md border border-cream-300">
                <QRCodeSVG
                  value={qrString}
                  size={240}
                  level="M"
                  includeMargin={true}
                  className="rounded-lg"
                />
              </div>

              {/* Dynamic QRIS Info Notice (NO download button!) */}
              <div className="mt-4 text-center space-y-1">
                <span className="inline-block text-xs font-bold text-brown-800 bg-white px-3 py-1 rounded-full border border-cream-300">
                  QRIS Dinamis Calls Kitchen
                </span>
                <p className="text-[11px] text-brown-500">
                  Nominal tertera otomatis sesuai tagihan pesanan Anda.
                </p>
              </div>
            </div>

            {/* Step-by-Step Payment Instructions */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-cream-200">
              <h3 className="text-sm font-bold text-brown-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-caramel-600" />
                <span>Cara Pembayaran QRIS Dinamis</span>
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-brown-600 leading-relaxed">
                <li>Buka aplikasi e-wallet atau mobile banking favorit Anda (GoPay, BCA, Mandiri, ShopeePay, Dana, dll).</li>
                <li>Pilih menu <strong>Pindai / Scan QRIS</strong>.</li>
                <li>Arahkan kamera ke kode QRIS di atas.</li>
                <li>Periksa nominal transaksi <strong>{totalAmount > 0 ? formatRupiah(totalAmount) : 'Sesuai Tagihan'}</strong> dan nama penerima <strong>Calls Kitchen</strong>.</li>
                <li>Konfirmasi dan selesaikan pembayaran dengan memasukkan PIN.</li>
              </ol>
            </div>

            {/* Server Verification Action */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleCheckStatus}
                isLoading={checkingStatus}
                variant="primary"
                size="lg"
                className="w-full text-base font-bold shadow-md"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Periksa Status Pembayaran
              </Button>

              {statusMessage && (
                <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs font-medium text-center border border-blue-200">
                  {statusMessage}
                </div>
              )}
            </div>

            {/* Sandbox Notice & Optional Test Simulator */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300/80 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Mode Sandbox / Pengujian Gateway</span>
              </div>
              <p className="leading-relaxed text-[11px] text-amber-700">
                Kredensial produksi gateway resmi menunggu verifikasi akun aktivasi. Untuk menguji alur secara end-to-end dalam lingkungan pengujian:
              </p>
              <button
                type="button"
                onClick={handleSandboxSimulateSuccess}
                className="w-full py-2 px-3 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs transition-colors"
              >
                [Uji Coba Sandbox] Simulasikan Verifikasi Pembayaran Sukses
              </button>
            </div>
          </div>
        )}

        {/* COD Section */}
        {isCOD && !isPaid && (
          <div className="space-y-6">
            <div className="p-6 bg-brown-50 rounded-2xl border border-brown-200 space-y-3">
              <h3 className="font-black text-brown-900 text-sm flex items-center gap-2">
                <Truck className="w-5 h-5 text-brown-700" />
                <span>Ketentuan Cash on Delivery (COD)</span>
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-brown-700 leading-relaxed">
                <li>Pesanan telah dicatat dengan status pembayaran <strong>Belum Dibayar</strong>.</li>
                <li>Mohon siapkan uang tunai pas sebesar <strong>{formatRupiah(totalAmount)}</strong> saat kurir tiba.</li>
                <li>Kurir akan menyerahkan paket keripik dan menerima uang tunai Anda.</li>
                <li>Setelah uang diterima, admin Calls Kitchen akan mencatat pembayaran sebagai <strong>Lunas</strong>.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/profile"
                className="flex-1 text-center py-3 px-4 rounded-xl font-bold text-sm bg-caramel-500 text-white shadow-sm hover:bg-caramel-600 transition-colors"
              >
                Lihat Riwayat Pesanan Saya
              </Link>
              <Link
                to="/catalog"
                className="flex-1 text-center py-3 px-4 rounded-xl font-bold text-sm bg-cream-200 text-brown-800 hover:bg-cream-300 transition-colors"
              >
                Kembali ke Katalog
              </Link>
            </div>
          </div>
        )}

        {/* Paid Success Actions */}
        {isPaid && (
          <div className="space-y-4 text-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/profile"
                className="flex-1 text-center py-3.5 px-4 rounded-xl font-bold text-sm bg-caramel-500 text-white shadow-md hover:bg-caramel-600 transition-colors"
              >
                Lihat Status di Riwayat Pesanan
              </Link>
              <Link
                to="/catalog"
                className="flex-1 text-center py-3.5 px-4 rounded-xl font-bold text-sm bg-cream-200 text-brown-800 hover:bg-cream-300 transition-colors"
              >
                Belanja Camilan Lainnya
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
