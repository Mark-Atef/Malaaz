import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
 
// WHY lazy-instantiate Resend:
// If RESEND_API_KEY is missing at import time (e.g. during local dev without .env),
// `new Resend(undefined)` throws immediately and crashes the build.
// Instantiating inside the handler lets the server start; missing key produces
// a clean 500 with a descriptive message instead of a cryptic startup crash.
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY environment variable is not set');
  return new Resend(key);
}
 
const FROM_ADDRESS = 'Malaaz <waitlist@malaaz.com>';
const NOTIFY_ADDRESS = 'hello@malaaz.com'; // internal notification recipient
 
function confirmationHtml(type: 'homeowner' | 'trader', email: string): string {
  const isHomeowner = type === 'homeowner';
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF9F6;font-family:'DM Sans',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;">
    <tr>
      <td style="background:#1A1714;padding:32px 40px;border-radius:12px 12px 0 0;">
        <p style="margin:0;font-size:28px;font-weight:300;letter-spacing:0.08em;color:#FAF9F6;">Malaaz</p>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;padding:40px;border-radius:0 0 12px 12px;border:1px solid #E5DDD3;border-top:none;">
        <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#1A1714;">
          ${isHomeowner ? 'شكراً لانضمامك إلى قائمة الانتظار' : 'مرحباً بك كتاجر في ملاذ'}
        </h1>
        <p style="margin:0 0 24px;font-size:15px;color:#8A7F72;line-height:1.7;">
          ${isHomeowner
            ? 'سجّلنا بريدك الإلكتروني وسنتواصل معك أول ما يُطلق التطبيق. ستحصل على وصول مبكر حصري وعروض خاصة للمؤسسين.'
            : 'سجّلنا طلبك للانضمام كتاجر. سيتواصل معك فريقنا قريباً لإتمام التسجيل ومناقشة التفاصيل.'
          }
        </p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#C4922A;border-radius:8px;padding:12px 24px;">
              <a href="https://malaaz.com" style="color:#FAF9F6;font-size:14px;font-weight:600;text-decoration:none;">
                زيارة الموقع
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:32px 0 0;font-size:12px;color:#B0A898;">${email}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
 
function notificationHtml(email: string, type: 'homeowner' | 'trader'): string {
  return `
<p><strong>New waitlist signup</strong></p>
<p>Email: ${email}<br>Type: ${type}<br>Time: ${new Date().toISOString()}</p>`;
}
 
export async function POST(req: NextRequest) {
    // Prevent large body attacks
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024) { // 1KB max
    return NextResponse.json(
      { success: false, message: 'Request too large' },
      { status: 413 }
    );
  }
  try {
    const body = await req.json() as { email?: string; type?: string };
    const { email, type } = body;
 
    // Input validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }
    if (!type || !['homeowner', 'trader'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Type must be homeowner or trader' },
        { status: 400 }
      );
    }
 
    const validType = type as 'homeowner' | 'trader';
    const resend = getResend();
 
    // Send both emails in parallel — confirmation to user + notification to team
    const [confirmResult, notifyResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: [email],
        subject: validType === 'homeowner'
          ? 'مرحباً بك في ملاذ — وصول مبكر حصري'
          : 'طلب انضمام التاجر مُستلَم — ملاذ',
        html: confirmationHtml(validType, email),
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: [NOTIFY_ADDRESS],
        subject: `[Waitlist] New ${validType} signup: ${email}`,
        html: notificationHtml(email, validType),
      }),
    ]);
 
    // Log failures but do not block success response — user registered either way
    if (confirmResult.status === 'rejected') {
      console.error('Confirmation email failed:', confirmResult.reason);
    }
    if (notifyResult.status === 'rejected') {
      console.error('Notification email failed:', notifyResult.reason);
    }
 
    console.info(`Waitlist signup: ${email} (${type})`);
    return NextResponse.json({ success: true, message: 'Registered successfully' });
 
  } catch (err: unknown) {
    // Do not expose internal error details to client
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Waitlist error:', message);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}