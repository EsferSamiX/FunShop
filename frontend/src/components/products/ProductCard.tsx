import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types/product'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
          {product.category.name}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-[#2563EB]">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          {product.rating > 0 && (
            <span className="text-xs text-yellow-500 font-medium">
              ★ {product.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
