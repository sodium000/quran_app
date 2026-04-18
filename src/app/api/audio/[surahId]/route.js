import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { surahId } = await params;
  
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.alafasy`, {

      next: { revalidate: 86400 } 
    });
    
    if (!res.ok) {
      throw new Error(`API returned status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Audio API Proxy Error:", error);
    return NextResponse.json({ error: "Failed to fetch audio data" }, { status: 500 });
  }
}
