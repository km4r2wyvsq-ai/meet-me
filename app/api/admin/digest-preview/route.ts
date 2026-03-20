import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    preview: {
      subject: 'Meet me weekly alpha digest',
      sections: [
        'new members joined groups',
        'top invite conversions',
        'top active groups',
        'open moderation reports'
      ]
    }
  });
}
