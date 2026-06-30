'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import Logo from '@/components/ui/Logo'
import { useEffect, useState } from 'react'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export default function Header() {
  const router = useRouter()
  const totalItems = useCartStore(state => state.totalItems())
  const clearCart = useCartStore(state => state.clearCart)
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setUserName(getCookie('auth_user'))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    clearCart()
    setUserName(null)
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo size="sm" />

        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Products
          </Link>

          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5.6A1 1 0 007 20h10a1 1 0 00.97-.76L19 13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EC4899] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {mounted && userName ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="text-sm text-gray-700 font-medium hidden sm:block hover:text-gray-900 transition-colors">
                Hi, <span className="text-[#2563EB]">{userName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            mounted && (
              <Link href="/login" className="text-sm font-medium text-[#2563EB] hover:underline transition-colors">
                Sign In
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
