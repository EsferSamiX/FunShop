'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function CartSummary() {
  const { items, totalPrice, clearCart } = useCartStore()

  const subtotal = totalPrice()
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shipping

  return (
    <div className="bg-gray-50 rounded-2xl p-6 space-y-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

      <div className="space-y-2 text-sm">
        {items.map(item => (
          <div key={item.product.id} className="flex justify-between text-gray-500">
            <span className="line-clamp-1 flex-1 mr-4">
              {item.product.title} × {item.quantity}
            </span>
            <span className="shrink-0 font-medium">
              ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-gray-400">Free shipping on orders over $50</p>
        )}
        <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-200">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors text-center"
      >
        Proceed to Checkout
      </Link>

      <button
        onClick={clearCart}
        className="w-full py-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        Clear cart
      </button>
    </div>
  )
}
