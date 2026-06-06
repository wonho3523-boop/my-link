import { ImageResponse } from 'next/og';

export const alt = 'MyLink - 모든 링크를 하나로';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a', // slate-900
          backgroundImage: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.15), transparent 60%)',
          padding: '40px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 네온 라인 장식 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundImage: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
          }}
        />

        {/* 메인 브랜딩 영역 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '24px',
            zIndex: 10,
          }}
        >
          {/* 서비스 로고 데코레이션 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              backgroundImage: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
              color: '#ffffff',
              fontSize: '40px',
              fontWeight: 900,
              border: '2px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            ML
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* 메인 서비스명 */}
            <span
              style={{
                fontSize: '64px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              MyLink
            </span>

            {/* 슬로건 */}
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#94a3b8', // slate-400
                maxWidth: '700px',
                lineHeight: '1.4',
              }}
            >
              모든 링크를 하나로, 세상에서 가장 쉬운 프로필 링크
            </span>
          </div>

          {/* 뱃지 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '9999px',
              padding: '8px 20px',
              marginTop: '12px',
            }}
          >
            <span
              style={{
                color: '#60a5fa', // blue-400
                fontSize: '16px',
                fontWeight: 800,
                letterSpacing: '0.05em',
              }}
            >
              FREE PROFILE LINK HUB
            </span>
          </div>
        </div>

        {/* 푸터 워터마크 */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#475569', // slate-600
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          <span>Powered by MyLink</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
