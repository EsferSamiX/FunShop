'use client'

import ProductCard from './ProductCard'
import { ProductSkeletonGrid } from './ProductSkeleton'
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts'
import { useFilters } from '@/hooks/useFilters'
import type { ProductListResponse } from '@/types/product'

interface Props {
  initialData: ProductListResponse
  search: string
  category: string
}

export default function ProductGrid({ initialData, search, category }: Props) {
  const { products, hasMore, isLoading, sentinelRef } = useInfiniteProducts({
    initialData,
    search,
    category,
  })
  const { clearFilters } = useFilters()

  if (products.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
        <p className="text-sm text-gray-500 mb-6">Try adjusting your search or filters</p>
        <button
          onClick={clearFilters}
          className="px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Reset filters
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {isLoading && <ProductSkeletonGrid count={4} />}
      </div>

      {/* Sentinel — IntersectionObserver watches this to trigger next page */}
      {hasMore && <div ref={sentinelRef} className="h-8 mt-4" />}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-sm text-gray-400 py-10">
          You've seen all {products.length} products
        </p>
      )}
    </div>
  )
}
