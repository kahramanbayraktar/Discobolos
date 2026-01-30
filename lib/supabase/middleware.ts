import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Check if it's an admin route
  const isAdminRoute = pathname.split('/').some(segment => segment === 'admin')

  if (isAdminRoute && !user) {
    // Redirect to login if not authenticated
    // We need to keep the language prefix
    const segments = pathname.split('/')
    const lang = segments[1] || 'en' // fallback
    const url = request.nextUrl.clone()
    url.pathname = `/${lang}/login`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
