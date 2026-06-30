import api from '../axios'
import type { Category } from '@/types/product'

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/api/categories')
  return data
}
