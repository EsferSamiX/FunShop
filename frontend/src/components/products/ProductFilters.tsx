'use client'

import { useFilters } from '@/hooks/useFilters'
import type { Category } from '@/types/product'

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const { search, category, setFilter, clearFilters } = useFilters()

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:sticky lg:top-20 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Filters</h2>
          {(search || category) && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#EC4899] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setFilter('search', e.target.value)}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Category</p>
          <div className="space-y-1">
            <button
              onClick={() => setFilter('category', '')}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                !category ? 'bg-[#2563EB] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setFilter('category', cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                  category === cat.slug
                    ? 'bg-[#2563EB] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
