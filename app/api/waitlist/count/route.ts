// app/api/waitlist/count/route.ts
//
// Returns the current waitlist count.
// WAITLIST_SEED_COUNT is set in .env.local and Vercel dashboard.
// Runtime signups are counted in the main /api/waitlist handler and
// returned per-response — this endpoint returns the baseline seed.
//
// Update WAITLIST_SEED_COUNT in Vercel dashboard weekly by exporting
// your Resend subscriber list and counting rows.

import { NextResponse } from 'next/server';

const SEED = parseInt(process.env.WAITLIST_SEED_COUNT ?? '127', 10);

export async function GET() {
  return NextResponse.json(
    { count: SEED },
    {
      headers: {
        // CDN caches for 5 min, serves stale for 10 min while revalidating
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}