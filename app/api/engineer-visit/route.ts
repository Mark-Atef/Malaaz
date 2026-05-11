import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { EngineerVisitData } from '@/types';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 300_000 });
    return true;
  }
  if (record.count >= 3) return false;
  record.count++;
  return true;
}

function escapeHtml(s: string | number): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not set');
  return new Resend(key);
}

function validateVisitData(body: unknown): EngineerVisitData {
  if (typeof body !== 'object' || body === null) throw new Error('Invalid body');
  const b = body as Record<string, unknown>;

  if (!b['name'] || typeof b['name'] !== 'string') throw new Error('Missing name');
  if (!b['phone'] || typeof b['phone'] !== 'string') throw new Error('Missing phone');
  if (!b['address'] || typeof b['address'] !== 'string') throw new Error('Missing address');
  if (!b['preferredDate'] || typeof b['preferredDate'] !== 'string') throw new Error('Missing date');

  const size = typeof b['apartmentSize'] === 'number'
    ? Math.max(30, Math.min(2000, b['apartmentSize']))
    : 100;

  return {
    name: String(b['name']).trim().slice(0, 200),
    phone: String(b['phone']).trim().slice(0, 20),
    address: String(b['address']).trim().slice(0, 500),
    apartmentSize: size,
    preferredDate: String(b['preferredDate']).trim().slice(0, 20),
    notes: b['notes'] ? String(b['notes']).trim().slice(0, 1000) : '',
  };
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
  }

  const cl = req.headers.get('content-length');
  if (cl && parseInt(cl) > 4096) {
    return NextResponse.json({ success: false, message: 'Request too large' }, { status: 413 });
  }

  try {
    const body = await req.json();
    const data = validateVisitData(body);
    const resend = getResend();

    await resend.emails.send({
      from: 'Malaaz <visits@malaaz.com>',
      to: ['hello@malaaz.com'],
      subject: `[Engineer Visit] ${data.name} — ${data.preferredDate}`,
      html: `
<h2>Engineer Visit Request</h2>
<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
<p><strong>Address:</strong> ${escapeHtml(data.address)}</p>
<p><strong>Size:</strong> ${escapeHtml(data.apartmentSize)} m²</p>
<p><strong>Preferred Date:</strong> ${escapeHtml(data.preferredDate)}</p>
${data.notes ? `<p><strong>Notes:</strong> ${escapeHtml(data.notes)}</p>` : ''}
<p><strong>Time:</strong> ${new Date().toISOString()}</p>`,
    });

    return NextResponse.json({ success: true, message: 'Visit request submitted' });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[engineer-visit]', message);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}