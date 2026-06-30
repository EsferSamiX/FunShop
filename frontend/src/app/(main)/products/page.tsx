import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getProducts } from '@/lib/api/products'
import { getCategories } from '@/lib/api/categories'
import ProductFilters from '@/components/products/ProductFilters'
import ProductGrid from '@/components/products/ProductGrid'
import { ProductSkeletonGrid } from '@/components/products/ProductSkeleton'

export const metadata: Metadata = {
  title: 'Products — FunShop',
  description: 'Browse our full catalog of products across all categories',
}

interface Props {
  searchParams: Promise<{ search?: string; category?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search || ''
  const category = params.category || ''

  const [initialData, categories] = await Promise.all([
    getProducts({ page: 1, limit: 20, search, category }),
    getCategories(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFilters categories={categories} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {search
                ? `Results for "${search}"`
                : category
                ? category.replace(/-/g, ' ')
                : 'All Products'}
            </h1>
            <p className="text-sm text-gray-400">{initialData.total} products</p>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <ProductSkeletonGrid count={8} />
              </div>
            }
          >
            <ProductGrid
              initialData={initialData}
              search={search}
              category={category}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
