import { Category, Product, StoreSettings } from '../types'

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-pisang',
    slug: 'keripik-pisang',
    name: 'Keripik Pisang',
    description: 'Olahan pisang pilihan dengan kerenyahan istimewa dan varian rasa favorit.'
  },
  {
    id: 'cat-singkong',
    slug: 'keripik-singkong',
    name: 'Keripik Singkong',
    description: 'Keripik singkong renyah gurih bumbu rempah pilihan khas Calls Kitchen.'
  }
]

export const INITIAL_PRODUCTS: Product[] = [
  // Keripik Pisang
  {
    id: 'prod-pisang-original',
    category_id: 'cat-pisang',
    name: 'Keripik Pisang Original',
    slug: 'keripik-pisang-original',
    description: 'Irisan pisang kepok pilihan digoreng renyah dengan rasa manis alami dan sentuhan gurih lembut. Renyah nagih di setiap gigitan.',
    price: 6000,
    stock: 10,
    image_url: '/products/pisang-original.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-pisang-cokelat',
    category_id: 'cat-pisang',
    name: 'Keripik Pisang Cokelat',
    slug: 'keripik-pisang-cokelat',
    description: 'Perpaduan renyahnya pisang bertabur lelehan cokelat pekat premium. Manisnya pas, lumer di mulut dan bikin happy!',
    price: 7000,
    stock: 10,
    image_url: '/products/pisang-cokelat.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-pisang-keju',
    category_id: 'cat-pisang',
    name: 'Keripik Pisang Keju',
    slug: 'keripik-pisang-keju',
    description: 'Rasa gurih keju cheddar melimpah menyelimuti setiap keping keripik pisang. Sensasi manis gurih yang bikin tidak bisa berhenti ngunyah.',
    price: 8000,
    stock: 10,
    image_url: '/products/pisang-keju.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-pisang-balado',
    category_id: 'cat-pisang',
    name: 'Keripik Pisang Balado',
    slug: 'keripik-pisang-balado',
    description: 'Kombinasi unik manisnya pisang berpadu racikan bumbu balado pedas manis segar. Cocok untuk pecinta tantangan rasa baru.',
    price: 7000,
    stock: 10,
    image_url: '/products/pisang-balado.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-pisang-karamel',
    category_id: 'cat-pisang',
    name: 'Keripik Pisang Karamel',
    slug: 'keripik-pisang-karamel',
    description: 'Glazed gula karamel aromatik dengan tekstur super crunchy dan aroma wangi butter khas Calls Kitchen.',
    price: 7000,
    stock: 10,
    image_url: '/products/pisang-karamel.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-pisang-matcha',
    category_id: 'cat-pisang',
    name: 'Keripik Pisang Matcha',
    slug: 'keripik-pisang-matcha',
    description: 'Bubuk matcha hijau berkualitas dengan rasa creamy dan sedikit aroma teh hijau yang menenangkan, berpadu manisnya pisang.',
    price: 8000,
    stock: 10,
    image_url: '/products/pisang-matcha.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },

  // Keripik Singkong
  {
    id: 'prod-singkong-original',
    category_id: 'cat-singkong',
    name: 'Keripik Singkong Original',
    slug: 'keripik-singkong-original',
    description: 'Singkong renyah tipis berbumbu garam laut murni dan bawang putih rempah tradisional. Camilan klasik yang tak lekang oleh waktu.',
    price: 6000,
    stock: 10,
    image_url: '/products/singkong-original.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-singkong-balado',
    category_id: 'cat-singkong',
    name: 'Keripik Singkong Balado',
    slug: 'keripik-singkong-balado',
    description: 'Bumbu balado merah merona dengan cabai asli, gurih pedas manis yang meresap sempurna ke dalam pori-pori keripik singkong.',
    price: 7000,
    stock: 10,
    image_url: '/products/singkong-balado.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-singkong-pedas-daun-jeruk',
    category_id: 'cat-singkong',
    name: 'Keripik Singkong Pedas Daun Jeruk',
    slug: 'keripik-singkong-pedas-daun-jeruk',
    description: 'Varian terlaris Calls Kitchen! Pedas nampol dipadukan aroma wangi daun jeruk segar yang meletup di lidah.',
    price: 7000,
    stock: 10,
    image_url: '/products/singkong-pedas-daun-jeruk.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-singkong-keju',
    category_id: 'cat-singkong',
    name: 'Keripik Singkong Keju',
    slug: 'keripik-singkong-keju',
    description: 'Keripik singkong dengan taburan keju cheddar spesial, gurih renyah tanpa meninggalkan rasa seret di tenggorokan.',
    price: 8000,
    stock: 10,
    image_url: '/products/singkong-keju.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-singkong-bbq',
    category_id: 'cat-singkong',
    name: 'Keripik Singkong BBQ',
    slug: 'keripik-singkong-bbq',
    description: 'Aroma panggang smoky barbeque yang menggoda selera dengan rasa manis, asin, dan gurih rempah pilihan.',
    price: 7000,
    stock: 10,
    image_url: '/products/singkong-bbq.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  },
  {
    id: 'prod-singkong-jagung-bakar',
    category_id: 'cat-singkong',
    name: 'Keripik Singkong Jagung Bakar',
    slug: 'keripik-singkong-jagung-bakar',
    description: 'Rasa manis jagung bakar berpadu aroma butter hangat dan kerenyahan singkong yang bikin suasana ngobrol makin seru.',
    price: 7000,
    stock: 10,
    image_url: '/products/singkong-jagung-bakar.svg',
    is_active: true,
    is_archived: false,
    rating: 0.0,
    sold_count: 0
  }
]

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  store_name: 'Calls Kitchen',
  phone: '0895-425-137-500',
  whatsapp: '62895-425-137-500',
  address: 'Jakarta Selatan, DKI Jakarta, Indonesia',
  default_shipping_cost: 2000,
  is_store_open: true
}
