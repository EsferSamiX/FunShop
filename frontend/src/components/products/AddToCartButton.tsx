'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [notice, setNotice] = useState<string | null>(null)

  const showNotice = (message: string) => {
    setNotice(message)
    setTimeout(() => setNotice(null), 2000)
  }

  const handleIncrement = () => {
    if (quantity >= product.stock) {
      showNotice('No more units available')
      return
    }
    setQuantity(q => q + 1)
  }

  const handleAdd = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="relative flex items-center gap-3">
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          −
        </button>
        <span className="w-8 h-9 flex items-center justify-center text-sm font-semibold">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        className={`py-2.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
          added
            ? 'bg-green-500 text-white'
            : 'bg-[#2563EB] hover:bg-blue-700 text-white'
        }`}
      >
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>

      {notice && (
        <div className="absolute -bottom-11 left-0 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
          {notice}
        </div>
      )}
    </div>
  )
}
