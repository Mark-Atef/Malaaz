import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { TraderRegistrationData } from '@/types';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 300_000 }); // 5 min window
    return true;
  }
  if (record.count >= 2) return false; // max 2 registrations per IP per 5 min
  record.count++;
  return true;
}

function getClientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}

function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not set');
  return new Resend(key);
}

function validatedData(body: unknown): TraderRegistrationData {
  if (typeof body !== 'object' || body === null) throw new Error('Invalid body');
  const b = body as Record<string, unknown>;

  const required: Array<keyof TraderRegistrationData> = [
    'traderType', 'businessName', 'governorate', 'area',
    'categories', 'revenueRange', 'contactName', 'phone', 'email',
  ];

  for (const field of required) {
    if (!b[field] || (field === 'categories' && !Array.isArray(b[field]))) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (b['traderType'] !== 'distributor' && b['traderType'] !== 'local') {
    throw new Error('Invalid traderType');
  }

  const email = String(b['email']).trim().toLowerCase();
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    throw new Error('Invalid email');
  }

  return {
    traderType: b['traderType'] as 'distributor' | 'local',
    businessName: String(b['businessName']).trim().slice(0, 200),
    governorate: String(b['governorate']).trim().slice(0, 100),
    area: String(b['area']).trim().slice(0, 200),
    categories: (b['categories'] as string[]).map((c) => String(c).trim()).slice(0, 10),
    revenueRange: String(b['revenueRange']).trim().slice(0, 100),
    contactName: String(b['contactName']).trim().slice(0, 200),
    phone: String(b['phone']).trim().slice(0, 20),
    email,
    whatsapp: b['whatsapp'] ? String(b['whatsapp']).trim().slice(0, 20) : undefined,
  };
}

function notificationHtml(d: TraderRegistrationData): string {
  return `
<h2>New Trader Registration</h2>
<p><strong>Type:</strong> ${escapeHtml(d.traderType)}</p>
<p><strong>Business:</strong> ${escapeHtml(d.businessName)}</p>
<p><strong>Location:</strong> ${escapeHtml(d.governorate)} — ${escapeHtml(d.area)}</p>
<p><strong>Categories:</strong> ${d.categories.map(escapeHtml).join(', ')}</p>
<p><strong>Revenue:</strong> ${escapeHtml(d.revenueRange)}</p>
<hr>
<p><strong>Contact:</strong> ${escapeHtml(d.contactName)}</p>
<p><strong>Phone:</strong> ${escapeHtml(d.phone)}</p>
<p><strong>Email:</strong> ${escapeHtml(d.email)}</p>
${d.whatsapp ? `<p><strong>WhatsApp:</strong> ${escapeHtml(d.whatsapp)}</p>` : ''}
<p><strong>Time:</strong> ${new Date().toISOString()}</p>`;
}

function confirmationHtml(d: TraderRegistrationData): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FAF9F6;font-family:'DM Sans',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;">
    <tr><td style="background:#1A1714;padding:32px 40px;border-radius:12px 12px 0 0;">
      <p style="margin:0;font-size:28px;font-weight:300;color:#FAF9F6;letter-spacing:0.08em;">Malaaz</p>
    </td></tr>
    <tr><td style="background:#fff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #E5DDD3;border-top:none;">
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#1A1714;">
        أهلاً بك في ملاذ، ${escapeHtml(d.contactName)}!
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:#8A7F72;line-height:1.7;">
        وصلنا طلب تسجيل ${escapeHtml(d.businessName)} بنجاح. سيتواصل معك أحد مستشارينا خلال ٢٤ ساعة.
      </p>
      <p style="margin:0;font-size:12px;color:#B0A898;">${escapeHtml(d.email)}</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
  }

  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 4096) {
    return NextResponse.json({ success: false, message: 'Request too large' }, { status: 413 });
  }

  try {
    const body = await req.json();
    const data = validatedData(body);
    const resend = getResend();

    await Promise.allSettled([
      resend.emails.send({
        from: 'Malaaz <traders@malaaz.com>',
        to: [data.email],
        subject: `أهلاً بك في ملاذ — ${data.businessName}`,
        html: confirmationHtml(data),
      }),
      resend.emails.send({
        from: 'Malaaz <traders@malaaz.com>',
        to: ['hello@malaaz.com'],
        subject: `[Trader Registration] ${data.businessName} — ${data.traderType}`,
        html: notificationHtml(data),
      }),
    ]);

    return NextResponse.json({ success: true, message: 'Registration successful' });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[trader-registration]', message);

    if (message.includes('Missing required') || message.includes('Invalid')) {
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}