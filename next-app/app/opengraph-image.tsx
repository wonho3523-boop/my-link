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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc', // slate-50
          backgroundImage: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 50%), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.12), transparent 50%)',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 상단 장식 네온 라인 */}
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

        {/* 좌측 영역: 서비스 브랜드 소개 (랜딩 페이지 히어로 텍스트 스타일) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '550px',
            gap: '24px',
            zIndex: 10,
          }}
        >
          {/* 미니 서비스 태그 뱃지 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              gap: '6px',
              backgroundColor: '#eff6ff', // blue-50
              border: '1px solid #dbeafe', // blue-100
              borderRadius: '9999px',
              padding: '6px 16px',
            }}
          >
            <span
              style={{
                color: '#2563eb', // blue-600
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '0.02em',
              }}
            >
              ✨ 1초 프로필 링크 빌더
            </span>
          </div>

          {/* 메인 타이틀 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '60px',
                fontWeight: 900,
                color: '#0f172a', // slate-900
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
              }}
            >
              모든 링크를
            </span>
            <span
              style={{
                fontSize: '60px',
                fontWeight: 900,
                backgroundImage: 'linear-gradient(to right, #2563eb, #7c3aed, #db2777)',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
              }}
            >
              하나의 페이지에.
            </span>
          </div>

          {/* 서브 카피 */}
          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#64748b', // slate-500
              lineHeight: '1.6',
              wordBreak: 'keep-all',
            }}
          >
            인스타그램, 유튜브, 블로그와 포트폴리오를 한곳에 예쁘게 모아 나를 효과적으로 전달해보세요.
          </span>

          {/* 하단 서브 안내 포인트 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              marginTop: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '9px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#10b981' }}>✓</div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#475569' }}>구글 1초 회원가입</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '9px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyItems: 'center', color: '#10b981' }}>✓</div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#475569' }}>모바일 드래그앤드롭</span>
            </div>
          </div>
        </div>

        {/* 우측 영역: 랜딩페이지 히어로의 폰 목업을 구현한 플랫 비주얼 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '450px',
            height: '105%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* 가상 스마트폰 디바이스 프레임 */}
          <div
            style={{
              width: '260px',
              height: '490px',
              backgroundColor: '#0f172a', // slate-900
              borderRadius: '40px',
              padding: '10px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.3)',
              border: '4px solid #1e293b', // slate-800
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* 스크린 화면 */}
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f1f5f9', // slate-100
                borderRadius: '30px',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 스크린 내부 탑 그라데이션 볼 */}
              <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '100px', height: '100px', borderRadius: '50px', backgroundColor: 'rgba(59, 130, 246, 0.15)', filter: 'blur(10px)' }} />

              {/* 프로필 아바타 데코 */}
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '30px',
                  backgroundImage: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: 900,
                  border: '2px solid #ffffff',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  zIndex: 2,
                }}
              >
                ML
              </div>

              {/* 사용자 정보 닉네임 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', zIndex: 2 }}>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>마이링크 공식 프로필</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>@mylink_official</span>
              </div>

              {/* 링크 카드 스택 데코 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', zIndex: 2 }}>
                {/* 카드 1 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '12px' }}>🔗</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#334155' }}>포트폴리오 구경하기</span>
                </div>
                {/* 카드 2 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '12px' }}>📺</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#334155' }}>유튜브 채널 바로가기</span>
                </div>
                {/* 카드 3 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '12px' }}>✉️</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#334155' }}>실시간 문의하기</span>
                </div>
              </div>

              {/* 하단 브랜드 */}
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '8px', fontWeight: 900, color: '#94a3b8' }}>Powered by MyLink</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 구석 브랜드 */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#94a3b8', // slate-400
            fontSize: '15px',
            fontWeight: 800,
          }}
        >
          <span style={{ color: '#2563eb', fontWeight: 900 }}>MyLink</span>
          <span>공식 웹사이트</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
