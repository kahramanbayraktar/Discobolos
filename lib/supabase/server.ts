import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}

export async function getServerPlayer() {
  const cookieStore = await cookies()
  const playerToken = cookieStore.get('player_token')?.value
  
  if (!playerToken) return null

  const supabase = await createClient()
  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('id', playerToken)
    .maybeSingle()

  if (!player) return null

  return {
    id: player.id,
    name: player.name,
    nickname: player.nickname,
    number: player.number,
    position: player.position,
    image: player.image,
    funFact: player.fun_fact,
    yearJoined: player.year_joined,
    isCaptain: player.is_captain,
    isAdmin: player.is_admin,
    email: player.email,
    accessCode: player.access_code,
  }
}
