import { supabase, isSupabaseConfigured } from './supabase'

const BUCKET_NAME = 'product-images'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']

export interface UploadResult {
  url: string | null
  error: string | null
}

export const uploadProductImage = async (file: File): Promise<UploadResult> => {
  // 1. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      url: null,
      error: 'Format file tidak didukung. Harap gunakan format JPG, PNG, WEBP, atau SVG.',
    }
  }

  // 2. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      url: null,
      error: 'Ukuran file melebihi batas maksimal 2MB.',
    }
  }

  // 3. Check Supabase connection
  if (!isSupabaseConfigured()) {
    // Return temporary object URL for local preview
    const localUrl = URL.createObjectURL(file)
    return {
      url: localUrl,
      error: null,
    }
  }

  try {
    // Generate safe unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
    const filePath = `catalog/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
    return {
      url: data.publicUrl,
      error: null,
    }
  } catch (err) {
    console.error('Storage upload error:', err)
    return {
      url: null,
      error: 'Gagal mengunggah gambar ke Supabase Storage: ' + (err as Error).message,
    }
  }
}
