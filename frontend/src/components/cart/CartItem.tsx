'use client'

import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import type { CartItem as CartItemType } from '@/types/cart'

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCartStore()
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
          {/* Quantity controls */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              −
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, Math.min(quantity + 1, product.stock))}
              disabled={quantity >= product.stock}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

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
