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
  const isPublicPage = pathname.startsWith('/share') || pathname === '/'
  const isApiRoute = pathname.startsWith('/api')

  // Allow public pages and API routes through
  if (isPublicPage || isApiRoute) {
    // If logged in and trying to access auth pages, go to dashboard
    if (session && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    // If logged in and at the root landing page, optionally redirect to dashboard
    // Let's redirect them to dashboard so they skip the landing page once logged in
    if (session && pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  // Redirect unauthenticated users to login
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect authenticated users away from auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

