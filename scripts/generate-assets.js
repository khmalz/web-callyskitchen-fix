import fs from 'fs'
import path from 'path'

const productsDir = path.resolve('public/products')
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true })
}

const flavors = [
  // Pisang
  {
    filename: 'pisang-original.svg',
    title: 'Keripik Pisang',
    subtitle: 'Rasa Original Manis Gurih',
    type: 'pisang',
    primaryColor: '#F59E0B',
    accentColor: '#D97706',
    bagColor: '#FEF3C7',
    badgeText: 'ORIGINAL'
  },
  {
    filename: 'pisang-cokelat.svg',
    title: 'Keripik Pisang',
    subtitle: 'Baluran Cokelat Premium',
    type: 'pisang',
    primaryColor: '#451A03',
    accentColor: '#78350F',
    bagColor: '#FDE68A',
    badgeText: 'COKELAT'
  },
  {
    filename: 'pisang-keju.svg',
    title: 'Keripik Pisang',
    subtitle: 'Taburan Keju Gurih Melimpah',
    type: 'pisang',
    primaryColor: '#FBBF24',
    accentColor: '#B45309',
    bagColor: '#FEF3C7',
    badgeText: 'KEJU GURIH'
  },
  {
    filename: 'pisang-balado.svg',
    title: 'Keripik Pisang',
    subtitle: 'Sensasi Manis Pedas Balado',
    type: 'pisang',
    primaryColor: '#DC2626',
    accentColor: '#991B1B',
    bagColor: '#FFEDD5',
    badgeText: 'BALADO'
  },
  {
    filename: 'pisang-karamel.svg',
    title: 'Keripik Pisang',
    subtitle: 'Glazed Karamel Khas Calls',
    type: 'pisang',
    primaryColor: '#D9822B',
    accentColor: '#9A3412',
    bagColor: '#FFFBEB',
    badgeText: 'KARAMEL'
  },
  {
    filename: 'pisang-matcha.svg',
    title: 'Keripik Pisang',
    subtitle: 'Bubuk Matcha Jepang Lembut',
    type: 'pisang',
    primaryColor: '#16A34A',
    accentColor: '#15803D',
    bagColor: '#DCFCE7',
    badgeText: 'MATCHA'
  },
  // Singkong
  {
    filename: 'singkong-original.svg',
    title: 'Keripik Singkong',
    subtitle: 'Renyah Gurih Asin Alami',
    type: 'singkong',
    primaryColor: '#A16207',
    accentColor: '#854D0E',
    bagColor: '#FEF9C3',
    badgeText: 'ORIGINAL'
  },
  {
    filename: 'singkong-balado.svg',
    title: 'Keripik Singkong',
    subtitle: 'Bumbu Balado Merah Merona',
    type: 'singkong',
    primaryColor: '#E11D48',
    accentColor: '#9F1239',
    bagColor: '#FFE4E6',
    badgeText: 'BALADO'
  },
  {
    filename: 'singkong-pedas-daun-jeruk.svg',
    title: 'Keripik Singkong',
    subtitle: 'Aroma Daun Jeruk Pedas Nampol',
    type: 'singkong',
    primaryColor: '#B91C1C',
    accentColor: '#047857',
    bagColor: '#FEF2F2',
    badgeText: 'PEDAS DAUN JERUK'
  },
  {
    filename: 'singkong-keju.svg',
    title: 'Keripik Singkong',
    subtitle: 'Keju Cheddar Gurih Renyah',
    type: 'singkong',
    primaryColor: '#EAB308',
    accentColor: '#CA8A04',
    bagColor: '#FEF08A',
    badgeText: 'KEJU CHEDDAR'
  },
  {
    filename: 'singkong-bbq.svg',
    title: 'Keripik Singkong',
    subtitle: 'Smoky Barbeque Spesial',
    type: 'singkong',
    primaryColor: '#7C2D12',
    accentColor: '#9A3412',
    bagColor: '#FFEDD5',
    badgeText: 'SMOKY BBQ'
  },
  {
    filename: 'singkong-jagung-bakar.svg',
    title: 'Keripik Singkong',
    subtitle: 'Manis Gurih Jagung Bakar',
    type: 'singkong',
    primaryColor: '#EA580C',
    accentColor: '#C2410C',
    bagColor: '#FEF3C7',
    badgeText: 'JAGUNG BAKAR'
  }
]

for (const f of flavors) {
  const isBanana = f.type === 'pisang'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#FFFDF9" />
        <stop offset="100%" stop-color="#F5EFE6" />
      </radialGradient>
      <linearGradient id="pouchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${f.bagColor}" />
        <stop offset="50%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="${f.bagColor}" />
      </linearGradient>
      <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE047" />
        <stop offset="100%" stop-color="${f.accentColor}" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#2A1F18" flood-opacity="0.12" />
      </filter>
    </defs>

    <!-- Canvas Background -->
    <rect width="400" height="400" rx="24" fill="url(#bgGrad)" />

    <!-- Decorative warm circle -->
    <circle cx="200" cy="180" r="140" fill="${f.bagColor}" opacity="0.6" />

    <!-- Standing Snack Pouch -->
    <g filter="url(#softShadow)">
      <!-- Pouch Body -->
      <path d="M120,70 L280,70 L295,310 C295,325 285,335 270,335 L130,335 C115,335 105,325 105,310 Z" fill="url(#pouchGrad)" stroke="#E5D5C5" stroke-width="2" />
      
      <!-- Pouch Top Seal / Ziploc ridges -->
      <path d="M115,70 L285,70 L285,85 L115,85 Z" fill="${f.primaryColor}" rx="4" />
      <line x1="125" y1="77" x2="275" y2="77" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4,3" />

      <!-- Brand Header Banner -->
      <rect x="130" y="100" width="140" height="36" rx="18" fill="#2A1F18" />
      <text x="200" y="123" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="14" fill="#FDF8F1" text-anchor="middle" letter-spacing="1.5">CALLS KITCHEN</text>

      <!-- Flavor Badge -->
      <rect x="140" y="146" width="120" height="24" rx="12" fill="${f.primaryColor}" />
      <text x="200" y="162" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="10" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${f.badgeText}</text>

      <!-- Product Name -->
      <text x="200" y="196" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="16" fill="#2A1F18" text-anchor="middle">${f.title}</text>
      <text x="200" y="214" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="500" font-size="10" fill="#8A735E" text-anchor="middle">${f.subtitle}</text>

      <!-- Illustrated Chips Graphic Inside Oval Window -->
      <ellipse cx="200" cy="265" rx="55" ry="35" fill="#FFFDF9" stroke="${f.primaryColor}" stroke-width="2" stroke-dasharray="3,3" />
      
      <!-- Chips Stack -->
      ${isBanana ? `
        <!-- Banana Chips -->
        <ellipse cx="185" cy="268" rx="22" ry="12" fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" transform="rotate(-15 185 268)" />
        <ellipse cx="215" cy="262" rx="20" ry="11" fill="#FEF08A" stroke="#CA8A04" stroke-width="1.5" transform="rotate(20 215 262)" />
        <ellipse cx="198" cy="272" rx="24" ry="13" fill="#FACC15" stroke="${f.accentColor}" stroke-width="1.5" transform="rotate(5 198 272)" />
        <circle cx="198" cy="272" r="2" fill="${f.accentColor}" />
      ` : `
        <!-- Cassava Chips (wavy edge) -->
        <path d="M170,265 C175,255 190,252 205,258 C215,262 225,258 230,266 C225,276 210,280 195,275 C185,272 175,276 170,265 Z" fill="#FEF08A" stroke="${f.accentColor}" stroke-width="1.5" />
        <path d="M180,268 C185,260 200,258 212,263 C220,266 222,272 215,276 C205,280 192,278 185,274 Z" fill="#FDE047" stroke="${f.primaryColor}" stroke-width="1.5" opacity="0.9" />
      `}
      
      <!-- Net Weight Badge -->
      <rect x="175" y="312" width="50" height="15" rx="7" fill="#EAE0D0" />
      <text x="200" y="323" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="600" font-size="8" fill="#564436" text-anchor="middle">NETTO 150g</text>
    </g>

    <!-- Floating crispy pieces around pouch -->
    <ellipse cx="75" cy="240" rx="14" ry="8" fill="#FBBF24" opacity="0.8" transform="rotate(-30 75 240)" />
    <ellipse cx="325" cy="220" rx="16" ry="9" fill="${f.primaryColor}" opacity="0.7" transform="rotate(25 325 220)" />
    <circle cx="95" cy="150" r="4" fill="#D9822B" opacity="0.6" />
    <circle cx="310" cy="130" r="5" fill="#EAB308" opacity="0.6" />
  </svg>`

  fs.writeFileSync(path.join(productsDir, f.filename), svg, 'utf-8')
}

// Generate brand logo
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <circle cx="50" cy="50" r="46" fill="#DF8839" stroke="#2A1F18" stroke-width="3" />
  <circle cx="50" cy="50" r="40" fill="#FDF8F1" />
  <path d="M35,35 Q50,20 65,35 Q75,55 60,70 Q40,75 30,60 Z" fill="#D9822B" opacity="0.2" />
  <ellipse cx="44" cy="48" rx="14" ry="9" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" transform="rotate(-20 44 48)" />
  <ellipse cx="56" cy="52" rx="15" ry="9" fill="#EAB308" stroke="#CA8A04" stroke-width="1.5" transform="rotate(15 56 52)" />
  <text x="50" y="74" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8" fill="#2A1F18" text-anchor="middle" letter-spacing="1">CALLS</text>
  <text x="50" y="82" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="6" fill="#8A735E" text-anchor="middle" letter-spacing="1">KITCHEN</text>
</svg>`
fs.writeFileSync(path.resolve('public/favicon.svg'), logoSvg, 'utf-8')

console.log('Successfully generated ' + flavors.length + ' snack product illustrations!')
