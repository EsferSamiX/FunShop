'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'

export default function CartPage() {
  const items = useCartStore(state => state.items)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some products to get started</p>
        <Link
          href="/products"
          className="inline-flex px-6 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Your Cart{' '}
        <span className="text-gray-400 font-normal text-lg">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
          {items.map(item => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        {/* Order summary */}
        <CartSummary />
      </div>
    </div>
  )
}
