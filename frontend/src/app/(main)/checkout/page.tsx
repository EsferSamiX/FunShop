'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

function formatCard(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCartStore()

  const [form, setForm] = useState({
    fullName: '', email: '', address: '', city: '', state: '', zip: '', country: 'US',
    cardNumber: '', expiry: '', cvv: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  const subtotal = totalPrice()
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + shipping

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some products before checking out</p>
        <Link href="/products" className="inline-flex px-6 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  if (orderNumber) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-1">Thank you for shopping with FunShop.</p>
        <p className="text-sm text-gray-400 mb-8">
          Order <span className="font-semibold text-gray-600">#{orderNumber}</span> · Confirmation sent to <span className="font-semibold text-gray-600">{form.email}</span>
        </p>
        <Link
          href="/products"
          className="inline-flex px-6 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => {
    let val = e.target.value
    if (key === 'cardNumber') val = formatCard(val)
    if (key === 'expiry') val = formatExpiry(val)
    if (key === 'cvv') val = val.replace(/\D/g, '').slice(0, 4)
    setForm(f => ({ ...f, [key]: val }))
    setErrors(er => ({ ...er, [key]: '' }))
  }

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state.trim()) e.state = 'State is required'
    if (!form.zip.trim()) e.zip = 'ZIP is required'
    if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number'
    if (form.expiry.length < 5) e.expiry = 'Enter expiry as MM/YY'
    if (form.cvv.length < 3) e.cvv = 'CVV is 3–4 digits'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))

    const num = Math.random().toString(36).slice(2, 10).toUpperCase()
    clearCart()
    setOrderNumber(num)
    setIsLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/cart" className="text-sm text-[#2563EB] hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Cart
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900 mt-3">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: forms */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#2563EB] text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="fullName" label="Full Name" placeholder="John Doe"
                    value={form.fullName} onChange={set('fullName')} error={errors.fullName}
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  />
                  <Input id="email" type="email" label="Email" placeholder="you@example.com"
                    value={form.email} onChange={set('email')} error={errors.email}
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                  />
                </div>
                <Input id="address" label="Street Address" placeholder="123 Main St"
                  value={form.address} onChange={set('address')} error={errors.address}
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input id="city" label="City" placeholder="New York"
                    value={form.city} onChange={set('city')} error={errors.city} />
                  <Input id="state" label="State" placeholder="NY"
                    value={form.state} onChange={set('state')} error={errors.state} />
                  <Input id="zip" label="ZIP Code" placeholder="10001"
                    value={form.zip} onChange={set('zip')} error={errors.zip} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  >
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#2563EB] text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
                Payment Details
              </h2>

              <div className="flex items-center gap-2 mb-5 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your payment information is encrypted and secure. This is a demo — no real charges will be made.
              </div>

              <div className="space-y-4">
                <Input id="cardNumber" label="Card Number" placeholder="1234 5678 9012 3456"
                  value={form.cardNumber} onChange={set('cardNumber')} error={errors.cardNumber}
                  icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input id="expiry" label="Expiry Date" placeholder="MM/YY"
                    value={form.expiry} onChange={set('expiry')} error={errors.expiry} />
                  <Input id="cvv" label="CVV" placeholder="123" type="password"
                    value={form.cvv} onChange={set('cvv')} error={errors.cvv} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-6 space-y-5">
              <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-2 text-sm max-h-52 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-gray-500">
                    <span className="line-clamp-1 flex-1 mr-3">{item.product.title} × {item.quantity}</span>
                    <span className="shrink-0 font-medium">${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" fullWidth isLoading={isLoading}>
                Place Order · ${total.toFixed(2)}
              </Button>

              <p className="text-center text-xs text-gray-400">
                By placing your order you agree to our{' '}
                <Link href="/terms" className="text-[#2563EB] hover:underline">Terms of Service</Link>
              </p>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}
