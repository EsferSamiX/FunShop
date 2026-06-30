export interface Category {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  title: string
  description: string
  price: string
  thumbnail: string
  images: string[]
  stock: number
  rating: number
  category: Category
}

export interface ProductListResponse {
  items: Product[]
  total: number
  page: number
  limit: number
  has_more: boolean
}
