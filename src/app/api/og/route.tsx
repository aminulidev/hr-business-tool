import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const rawTitle =
    searchParams.get('title') || 'Free 2026 Business, HR & Paycheck Calculators';
  const category = searchParams.get('category') || 'Payroll, Tax & Business Finance';
  const subtitle =
    searchParams.get('subtitle') ||
    'Instant, IRS & FLSA-verified 2026 calculators with live breakdowns and 30-state tax tables.';

  // Trim overly long titles so typography always fits cleanly
  const title = rawTitle.length > 78 ? `${rawTitle.slice(0, 75)}...` : rawTitle;
  const sub = subtitle.length > 140 ? `${subtitle.slice(0, 137)}...` : subtitle;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#061310',
          backgroundImage:
            'radial-gradient(circle at 12% 18%, rgba(16, 185, 129, 0.25) 0%, transparent 45%), radial-gradient(circle at 88% 85%, rgba(245, 158, 11, 0.18) 0%, transparent 45%)',
          padding: '56px 64px',
          fontFamily: 'sans-serif',
          color: '#f8fafc',
        }}
      >
        {/* Top Row: Brand + Category Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 900,
                color: '#ffffff',
              }}
            >
              Q
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                fontSize: '30px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ color: '#ffffff' }}>QuickBiz</span>
              <span style={{ color: '#10b981' }}>Calc</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.16)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {category}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(245, 158, 11, 0.16)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              2026 Verified
            </div>
          </div>
        </div>

        {/* Center Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '1040px',
          }}
        >
          <div
            style={{
              fontSize: title.length > 52 ? '52px' : '60px',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '24px',
              lineHeight: 1.45,
              color: '#94a3b8',
              fontWeight: 500,
              maxWidth: '940px',
            }}
          >
            {sub}
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: '24px',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            fontSize: '18px',
            color: '#cbd5e1',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ color: '#34d399' }}>● Instant Live Calculation</span>
            <span>● IRS &amp; 30-State Tax Tables</span>
            <span>● 100% Free &amp; Private</span>
          </div>
          <div style={{ color: '#10b981', fontWeight: 800 }}>quickbizcalc.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

