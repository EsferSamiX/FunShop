import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductById, getAllProductIds } from '@/lib/api/products'
import AddToCartButton from '@/components/products/AddToCartButton'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const ids = await getAllProductIds()
    return ids.map(id => ({ id: String(id) }))
  } catch {
    // API unavailable at build time (e.g. Docker build) — pages generated on demand
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await getProductById(id)
    return {
      title: `${product.title} — FunShop`,
      description: product.description.slice(0, 160),
    }
  } catch {
    return { title: 'Product — FunShop' }
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let product
  try {
    product = await getProductById(id)
  } catch {
    notFound()
  }

  const images = product.images?.length > 0 ? product.images : [product.thumbnail]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/products" className="hover:text-[#2563EB] transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-[#2563EB] transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left — Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <Image
              src={images[0]}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border-2 border-transparent hover:border-[#2563EB] transition-colors cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="flex flex-col justify-start space-y-6">
          <div>
            <span className="inline-block text-xs font-semibold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              {product.category.name}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Price + Rating */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-[#2563EB]">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm font-semibold text-yellow-700">
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-500 leading-relaxed text-sm">
            {product.description}
          </p>

          {/* Stock */}
          {product.stock !== undefined && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Back link */}
          <Link
            href="/products"
            className="text-sm text-gray-400 hover:text-[#2563EB] transition-colors text-center"
          >
            ← Back to products
          </Link>
        </div>
      </div>
    </div>
  )
}
