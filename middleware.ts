import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const { pathname } = req.nextUrl

  // ✅ Admin portal has its own auth (localStorage token + AdminLayout guard)
  // Never let Supabase middleware interfere with /admin routes
  if (pathname.startsWith('/admin')) {
    return res
  }

  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')
  const isPublicPage = pathname.startsWith('/share')
  const isApiRoute = pathname.startsWith('/api')

  // Allow public pages and API routes through
  if (isPublicPage || isApiRoute) {
    return res
  }

  // Redirect unauthenticated users to login
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect authenticated users away from auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

