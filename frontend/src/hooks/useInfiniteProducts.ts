'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { getProducts } from '@/lib/api/products'
import type { Product, ProductListResponse } from '@/types/product'

interface Options {
  initialData: ProductListResponse
  search: string
  category: string
}

export function useInfiniteProducts({ initialData, search, category }: Options) {
  const [products, setProducts] = useState<Product[]>(initialData.items)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialData.has_more)
  const [isLoading, setIsLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Reset when filters change (new SSR render with new initialData)
  useEffect(() => {
    setProducts(initialData.items)
    setPage(1)
    setHasMore(initialData.has_more)
  }, [initialData])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      const next = page + 1
      const data = await getProducts({ page: next, limit: 20, search, category })
      setProducts(prev => [...prev, ...data.items])
      setPage(next)
      setHasMore(data.has_more)
    } catch (err) {
      console.error('Failed to load more:', err)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, search, category])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore() },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return { products, hasMore, isLoading, sentinelRef }
}
