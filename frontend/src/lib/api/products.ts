import api from '../axios'
import type { Product, ProductListResponse } from '@/types/product'

export interface GetProductsParams {
  page?: number
  limit?: number
  search?: string
  category?: string
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
  const { data } = await api.get<ProductListResponse>('/api/products', { params })
  return data
}

export async function getProductById(id: number | string): Promise<Product> {
  const { data } = await api.get<Product>(`/api/products/${id}`)
  return data
}

export async function getAllProductIds(): Promise<number[]> {
  const { data } = await api.get<ProductListResponse>('/api/products', {
    params: { page: 1, limit: 100 },
  })
  return data.items.map(p => p.id)
}
