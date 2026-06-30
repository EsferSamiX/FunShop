import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    const message = error.message || error.detail || 'Invalid email or password'
    return NextResponse.json({ message }, { status: res.status })
  }

  const data = await res.json()

  const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
  const me = meRes.ok ? await meRes.json() : null

  const response = NextResponse.json({ success: true })

  response.cookies.set('auth_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 30,
    path: '/',
  })

  response.cookies.set('auth_user', me?.name ?? body.email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 30,
    path: '/',
  })

  response.cookies.set('auth_user_email', body.email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 30,
    path: '/',
  })

  return response
}
