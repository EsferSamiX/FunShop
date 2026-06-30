'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
        added
          ? 'bg-green-500 text-white'
          : 'bg-[#2563EB] hover:bg-blue-700 text-white'
      }`}
    >
      {added ? '✓ Added to Cart' : 'Add to Cart'}
    </button>
  )
}
