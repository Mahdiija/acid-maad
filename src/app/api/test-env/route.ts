import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.NEXT_PUBLIC_TMDB_API_KEY,
    hasAccessToken: !!process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN,
    apiKeyLength: process.env.NEXT_PUBLIC_TMDB_API_KEY?.length || 0,
    accessTokenLength: process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN?.length || 0,
  });
}
