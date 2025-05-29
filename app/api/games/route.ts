import { supabase } from '@/lib/supabase'

class NextResponse {
  static json(data: any, init?: ResponseInit) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
      },
    })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || ''
  const limit = parseInt(searchParams.get('limit') || '10')
  const sort = searchParams.get('sort') || 'newest'
  const search = searchParams.get('search') || ''
  
  let query = supabase.from('games').select('*')
  
  // Apply search filter
  if (search) {
    query = query.ilike('title', `%${search}%`)
  }
  
  // Apply category filter
  if (category) {
    query = query.contains('genre', [category])
  }
  
  // Apply sorting
  switch (sort) {
    case 'newest':
      query = query.order('release_date', { ascending: false })
      break
    case 'oldest':
      query = query.order('release_date', { ascending: true })
      break
    case 'name-asc':
      query = query.order('title', { ascending: true })
      break
    case 'name-desc':
      query = query.order('title', { ascending: false })
      break
    case 'size-asc':
      query = query.order('size_bytes', { ascending: true })
      break
    case 'size-desc':
      query = query.order('size_bytes', { ascending: false })
      break
    case 'popular':
      query = query.order('download_count', { ascending: false })
      break
    default:
      query = query.order('release_date', { ascending: false })
  }
  
  // Apply limit
  query = query.limit(limit)
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
  
  return NextResponse.json({ games: data })
}

export async function POST(request: Request) {
  // This would handle game creation in a real app
  // Only admin users would be allowed to create games
  
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}
