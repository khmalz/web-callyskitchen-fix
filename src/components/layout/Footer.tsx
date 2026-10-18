import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Heart } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brown-900 text-cream-200 border-t-4 border-caramel-500 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-brown-700/60">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-caramel-500 flex items-center justify-center text-white font-black text-lg shadow">
                CK
              </div>
              <span className="text-2xl font-black text-cream-50 tracking-tight">Calls Kitchen</span>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed max-w-sm">
              Produsen camilan keripik pisang dan keripik singkong renyah pilihan dengan aneka varian rasa lezat. Renyahnya Bikin Nagih, Rasanya Bikin Happy!
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-cream-50 uppercase tracking-wider text-xs">
              Menu Cepat
            </h4>
            <ul className="space-y-2 text-sm text-cream-300">
              <li>
                <Link to="/" className="hover:text-caramel-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-caramel-400 transition-colors">
                  Katalog Camilan
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-caramel-400 transition-colors">
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-caramel-400 transition-colors">
                  Riwayat Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-cream-50 uppercase tracking-wider text-xs">
              Hubungi Kami
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-caramel-400 shrink-0" />
                <span>+62 895-425-137-500 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-caramel-400 shrink-0" />
                <span>callskitchen@gmail.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-caramel-400 shrink-0 mt-0.5" />
                <span>Dapur Produksi Calls Kitchen, Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>&copy; {CURRENT_YEAR} Calls Kitchen. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-1 text-cream-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-caramel-500 fill-caramel-500 inline" />
            <span>untuk pecinta camilan renyah Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
