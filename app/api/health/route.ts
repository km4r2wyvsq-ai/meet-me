import { NextResponse } from 'next/server';
import { appEnvironment, supabaseConfigured } from '@/lib/env';

export async function GET() {
  return NextResponse.json({
    ok: true,
    environment: appEnvironment(),
    supabaseConfigured: supabaseConfigured(),
    timestamp: new Date().toISOString()
  });
}
