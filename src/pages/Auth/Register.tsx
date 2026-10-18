import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/common/Button'
import { isValidIndonesianPhone } from '../../lib/utils'

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .refine(isValidIndonesianPhone, 'Format nomor telepon tidak valid (contoh: 08123456789)'),
  address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export const Register: React.FC = () => {
  const { register: registerAuth } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'

  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true)
    setAuthError(null)

    const { error } = await registerAuth({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      phone: values.phone,
      address: values.address,
    })

    if (error) {
      setAuthError(error.message || 'Gagal mendaftar akun.')
      setIsSubmitting(false)
    } else {
      navigate(redirectPath, { replace: true })
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-caramel-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
            CK
          </div>
          <h1 className="text-2xl font-black text-brown-900">Daftar Akun</h1>
          <p className="text-xs text-brown-500">
            Buat akun untuk belanja lebih mudah di Calls Kitchen
          </p>
        </div>

        {authError && (
          <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brown-800 uppercase tracking-wider mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
              <input
                type="text"
                placeholder="Contoh: Siti Aisyah"
                {...register('fullName')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 focus:ring-2 focus:ring-caramel-200 outline-none text-sm text-brown-900"
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-brown-800 uppercase tracking-wider mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
              <input
                type="email"
                placeholder="nama@email.com"
                {...register('email')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 focus:ring-2 focus:ring-caramel-200 outline-none text-sm text-brown-900"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-brown-800 uppercase tracking-wider mb-1">
              Nomor Telepon / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
              <input
                type="tel"
                placeholder="081234567890"
                {...register('phone')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 focus:ring-2 focus:ring-caramel-200 outline-none text-sm text-brown-900"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-brown-800 uppercase tracking-wider mb-1">
              Alamat Pengiriman
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-brown-400" />
              <textarea
                rows={2}
                placeholder="Alamat rumah lengkap untuk pengiriman pesanan"
                {...register('address')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 focus:ring-2 focus:ring-caramel-200 outline-none text-sm text-brown-900 resize-none"
              />
            </div>
            {errors.address && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-brown-800 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400" />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                {...register('password')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-300 focus:bg-white focus:border-caramel-500 focus:ring-2 focus:ring-caramel-200 outline-none text-sm text-brown-900"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 font-semibold mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="primary"
            size="lg"
            className="w-full text-sm font-bold shadow-md mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Daftar Sekarang
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-brown-600">
          Sudah punya akun?{' '}
          <Link
            to={`/login${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="font-bold text-caramel-600 hover:text-caramel-700 underline"
          >
            Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  )
}
