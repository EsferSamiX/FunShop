'use client'

import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import type { CartItem as CartItemType } from '@/types/cart'

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem } = useCartStore()
  const { product, quantity } = item

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
      <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {product.category.name}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3">
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          {/* Quantity */}
          <span className="text-sm text-gray-600">Qty: {quantity}</span>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-[#2563EB]">
              ${(parseFloat(product.price) * quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(product.id)}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
