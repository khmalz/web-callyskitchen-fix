import { PaymentStatus } from '../../types'
import { supabase, isSupabaseConfigured } from '../supabase'

/**
 * COD (Cash on Delivery) Payment Handler
 * 
 * Aturan Bisnis:
 * 1. Pesanan dibuat dengan status pembayaran awal 'unpaid'.
 * 2. Status pesanan dan status pembayaran disimpan terpisah.
 * 3. Pembayaran TIDAK PERNAH otomatis lunas saat pesanan dibuat atau dikirim.
 * 4. Pembayaran hanya dapat ditandai lunas oleh Admin yang terotorisasi setelah uang fisik diterima.
 * 5. Waktu verifikasi dan identitas admin pencatat wajib disimpan.
 */
export class CODAdapter {
  /**
   * Confirm COD cash collection by an authorized admin
   */
  public static async confirmCashReceived(
    orderId: string,
    adminId: string,
    adminName: string
  ): Promise<{ success: boolean; message: string }> {
    const now = new Date().toISOString()

    try {
      if (isSupabaseConfigured()) {
        // 1. Update payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: 'paid' as PaymentStatus,
            verified_at: now,
            verified_by: adminId,
            payment_details: {
              received_by_admin: adminName,
              received_at: now,
              notes: 'Uang tunai COD telah diterima kurir/admin.',
            },
            updated_at: now,
          })
          .eq('order_id', orderId)

        if (paymentError) throw paymentError

        // 2. Update order payment_status
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid' as PaymentStatus,
            updated_at: now,
          })
          .eq('id', orderId)

        if (orderError) throw orderError

        // 3. Insert status change audit log
        await supabase.from('order_status_history').insert({
          order_id: orderId,
          previous_status: null,
          new_status: 'processing',
          changed_by: adminId,
          notes: `Pembayaran tunai COD sebesar nominal pesanan telah diverifikasi oleh admin ${adminName}.`,
        })
      }

      return {
        success: true,
        message: `Pembayaran COD berhasil dicatat sebagai lunas oleh ${adminName}.`,
      }
    } catch (err) {
      console.error('Error confirming COD cash collection:', err)
      return {
        success: false,
        message: 'Gagal mencatat penerimaan uang tunai COD: ' + (err as Error).message,
      }
    }
  }
}
