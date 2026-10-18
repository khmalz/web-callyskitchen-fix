/**
 * Format number to Indonesian Rupiah currency format
 * e.g. 20000 -> "Rp 20.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0'
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp').trim()
}

/**
 * Format ISO date string to localized Indonesian date
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '-'
  try {
    const d = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return dateString
  }
}

/**
 * Generate unique order number (e.g. CK-20261018-XXXX)
 */
export function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `CK-${year}${month}${day}-${random}`
}

/**
 * Combine class names conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Basic phone validation for Indonesian numbers (e.g. 08xx or +628xx or 628xx)
 */
export function isValidIndonesianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '')
  return /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/.test(cleaned)
}
