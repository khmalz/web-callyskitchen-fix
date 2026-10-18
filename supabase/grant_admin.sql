-- ==============================================================================
-- CARA MEMBERIKAN ROLE ADMIN SECARA AMAN DI SUPABASE SQL EDITOR
-- ==============================================================================
-- 1. Buka Supabase Dashboard: https://icnbtgkzzocjgjosenca.supabase.co
-- 2. Masuk ke menu SQL Editor -> New Query
-- 3. Ganti 'admin@callskitchen.com' di bawah ini dengan email akun yang sudah terdaftar
-- 4. Klik 'Run'

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@callskitchen.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verifikasi role akun:
SELECT u.email, r.role, r.created_at
FROM auth.users u
JOIN public.user_roles r ON u.id = r.user_id
WHERE u.email = 'admin@callskitchen.com';
