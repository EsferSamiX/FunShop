'use client'

import { useEffect, useState } from 'react'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export default function ProfilePage() {
  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    setName(getCookie('auth_user'))
    setEmail(getCookie('auth_user_email'))
  }, [])

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center text-2xl font-bold text-[#2563EB]">
            {name ? name.charAt(0).toUpperCase() : '?'}
          </div>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Name</p>
            <p className="text-sm font-medium text-gray-900">{name ?? '—'}</p>
          </div>
          <div className="border-t border-gray-100" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900">{email ?? '—'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
