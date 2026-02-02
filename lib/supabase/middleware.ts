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

  // Check for our custom session cookie
  const playerToken = request.cookies.get('player_token')?.value

  const pathname = request.nextUrl.pathname
  const segments = pathname.split('/')
  const lang = segments[1] || 'en'

  // Define public paths
  const publicSegments = ['login', 'unauthorized', 'roster', 'events', 'news', 'rules', 'gallery', 'contact']
  const isPublicPath = 
    pathname === `/${lang}` || 
    segments.length <= 2 ||
    publicSegments.includes(segments[2])

  // If player token exists, verify it
  if (playerToken) {
    const { data: player } = await supabase
      .from('players')
      .select('id, is_captain')
      .eq('id', playerToken)
      .maybeSingle()

    const isAuthorizedPlayer = !!player
    const isCaptain = player?.is_captain || false

    // 1. If not an authorized player, redirect to unauthorized page
    if (!isAuthorizedPlayer && !isPublicPath) {
      const url = request.nextUrl.clone()
      url.pathname = `/${lang}/unauthorized`
      return NextResponse.redirect(url)
    }

    // 2. If it's an admin route, check for captain status
    const isAdminRoute = segments.some(segment => segment === 'admin')
    if (isAdminRoute && !isCaptain) {
      const url = request.nextUrl.clone()
      url.pathname = `/${lang}`
      return NextResponse.redirect(url)
    }

    // 3. If logged in and trying to go to login, redirect to home
    if (pathname === `/${lang}/login`) {
      const url = request.nextUrl.clone()
      url.pathname = `/${lang}`
      return NextResponse.redirect(url)
    }
  } else {
    // If NO token
    const isProtectedRoute = 
      segments.some(s => ['admin', 'attendance', 'profile'].includes(s))

    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = `/${lang}/login`
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
