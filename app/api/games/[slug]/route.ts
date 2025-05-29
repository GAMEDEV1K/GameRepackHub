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

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug
  
  if (!slug) {
    return NextResponse.json(
      { error: 'Slug is required' },
      { status: 400 }
    )
  }
  
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    return NextResponse.json(
      { error: 'Game not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ game: data })
}

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // This would handle game updates in a real app
  // Only admin users would be allowed to update games
  
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // This would handle game deletion in a real app
  // Only admin users would be allowed to delete games
  
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  )
}
