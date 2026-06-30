import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    const message = error.message || error.detail || 'Registration failed'
    return NextResponse.json({ message }, { status: res.status })
  }

  const data = await res.json()

  const response = NextResponse.json({ success: true }, { status: 201 })

  // httpOnly — JS can never read this, only sent automatically by browser
  response.cookies.set('auth_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 30,
    path: '/',
  })

  // Readable cookie — only used to show name in header
  response.cookies.set('auth_user', body.name, {
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
