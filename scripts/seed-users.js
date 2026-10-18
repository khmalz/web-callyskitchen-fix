import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const envPath = path.resolve('.env')
let supabaseUrl = 'https://icnbtgkzzocjgjosenca.supabase.co'
let supabaseAnonKey = ''

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/)
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/) || envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.*)/)
  if (urlMatch?.[1]) supabaseUrl = urlMatch[1].trim()
  if (keyMatch?.[1]) supabaseAnonKey = keyMatch[1].trim()
}

if (!supabaseAnonKey || supabaseAnonKey.length < 20) {
  console.error('[Seeder] Error: VITE_SUPABASE_ANON_KEY tidak ditemukan di file .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const seedUsers = [
  {
    email: 'admin@gmail.com',
    password: 'Password123!',
    fullName: 'Administrator Calls Kitchen',
    phone: '081234567890',
    address: 'Jl. Dapur Pusat No. 1, Jakarta Selatan',
    targetRole: 'admin',
  },
  {
    email: 'admin.callskitchen@gmail.com',
    password: 'Password123!',
    fullName: 'Administrator Calls Kitchen',
    phone: '081234567890',
    address: 'Jl. Dapur Pusat No. 1, Jakarta Selatan',
    targetRole: 'admin',
  },
  {
    email: 'budi.santoso@gmail.com',
    password: 'Password123!',
    fullName: 'Budi Santoso',
    phone: '081298765432',
    address: 'Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan',
    targetRole: 'customer',
  },
  {
    email: 'siti.rahma@gmail.com',
    password: 'Password123!',
    fullName: 'Siti Rahma',
    phone: '081387654321',
    address: 'Jl. Anggrek No. 8, Bandung, Jawa Barat',
    targetRole: 'customer',
  },
]

async function runSeeder() {
  console.log('====================================================')
  console.log('CALLS KITCHEN - USER SEEDER VIA SUPABASE API')
  console.log('Target URL:', supabaseUrl)
  console.log('====================================================\n')

  for (const item of seedUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: item.email,
        password: item.password,
        options: {
          data: {
            full_name: item.fullName,
            phone: item.phone,
            address: item.address,
          },
        },
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          console.log(`[EXISTING] ${item.email} sudah terdaftar sebelumnya.`)
        } else {
          console.warn(`[FAILED]   ${item.email} -> ${error.message}`)
        }
      } else if (data.user) {
        console.log(`[SUCCESS]  ${item.email} berhasil didaftarkan (ID: ${data.user.id}).`)
      }
    } catch (err) {
      console.error(`[ERROR]    ${item.email} ->`, err.message)
    }
  }

  console.log('\n====================================================')
  console.log('AKUN HASIL SEEDER:')
  console.log('====================================================')
  console.log('1. Admin:')
  console.log('   Email   : admin.callskitchen@gmail.com (atau admin@callskitchen.com)')
  console.log('   Password: Password123!')
  console.log('   Role    : admin\n')
  console.log('2. Pelanggan 1:')
  console.log('   Email   : budi.santoso@gmail.com')
  console.log('   Password: Password123!')
  console.log('   Role    : customer\n')
  console.log('3. Pelanggan 2:')
  console.log('   Email   : siti.rahma@gmail.com')
  console.log('   Password: Password123!')
  console.log('   Role    : customer')
  console.log('====================================================')
  console.log('TIPS: Jalankan "supabase/seed_users.sql" di Supabase SQL Editor')
  console.log('untuk langsung mengonfirmasi email dan mengaktifkan role admin secara instan.')
  console.log('====================================================\n')
}

runSeeder()
