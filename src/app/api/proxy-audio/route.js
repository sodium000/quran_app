import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const audioUrl = searchParams.get('url');

  if (!audioUrl) {
    return new Response('Missing URL', { status: 400 });
  }

  try {
    const res = await fetch(audioUrl);
    if (!res.ok) throw new Error('Failed to fetch audio from source');

    const headers = new Headers();
    headers.set('Content-Type', res.headers.get('Content-Type') || 'audio/mpeg');
    headers.set('Accept-Ranges', 'bytes');
    
    return new NextResponse(res.body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Audio Proxy Error:', error);
    return new Response('Failed to proxy audio', { status: 500 });
  }
}
