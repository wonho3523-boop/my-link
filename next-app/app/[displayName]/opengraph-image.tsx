import { ImageResponse } from 'next/og';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const alt = 'MyLink Profile';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ displayName: string }>;
}

export default async function Image({ params }: Props) {
  const { displayName: rawDisplayName } = await params;
  const decodedDisplayName = decodeURIComponent(rawDisplayName);

  let userData = {
    displayName: decodedDisplayName,
    bio: '나만의 링크 트리 페이지, MyLink에 방문해 주셔서 감사합니다! 🚀',
    username: decodedDisplayName,
    photoURL: '',
  };

  try {
    const usersRef = collection(db, "users");
    const qUser = query(usersRef, where("username", "==", decodedDisplayName));
    const userSnapshot = await getDocs(qUser);
    
    if (!userSnapshot.empty) {
      const docData = userSnapshot.docs[0].data();
      userData = {
        displayName: docData.displayName || decodedDisplayName,
        bio: docData.bio || '나만의 링크 트리 페이지, MyLink에 방문해 주셔서 감사합니다! 🚀',
        username: docData.username || decodedDisplayName,
        photoURL: docData.photoURL || '',
      };
    }
  } catch (error) {
    console.error("OG 이미지 Firestore 유저 조회 실패:", error);
  }

  // 닉네임의 첫 글자 추출 (아바타 백업용)
  const initial = userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U';

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
          backgroundColor: '#0f172a', // slate-900
          backgroundImage: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 50%), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.12), transparent 50%)',
          padding: '60px 80px',
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

        {/* 좌측 영역: 사용자 프로필 명함 정보 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            maxWidth: '550px',
            gap: '24px',
            zIndex: 10,
          }}
        >
          {/* 아바타와 닉네임 한 줄 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* 프로필 이미지 (URL이 있으면 이미지 태그, 없으면 이니셜 아바타) */}
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt={userData.displayName}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50px',
                  border: '3px solid #ffffff',
                  objectFit: 'cover',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50px',
                  backgroundImage: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                  color: '#ffffff',
                  fontSize: '48px',
                  fontWeight: 900,
                  border: '3px solid #ffffff',
                }}
              >
                {initial}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {/* 유저 표시 이름 */}
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                {userData.displayName}
              </span>
              {/* 유저 닉네임 주소 */}
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#3b82f6', // blue-500
                }}
              >
                @{userData.username}
              </span>
            </div>
          </div>

          {/* 한 줄 소개글 */}
          <span
            style={{
              fontSize: '20px',
              fontWeight: 500,
              color: '#94a3b8', // slate-400
              lineHeight: '1.6',
              wordBreak: 'keep-all',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {userData.bio}
          </span>

          {/* 링크 경로 뱃지 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              gap: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              borderRadius: '9999px',
              padding: '6px 16px',
            }}
          >
            <span
              style={{
                color: '#60a5fa', // blue-400
                fontSize: '14px',
                fontWeight: 700,
              }}
            >
              mylink.app/{userData.username}
            </span>
          </div>
        </div>

        {/* 우측 영역: 데코레이션 가상 카드 그래픽 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '400px',
            height: '100%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* 가상 링크 카드 1 */}
          <div
            style={{
              width: '320px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transform: 'rotate(-4deg) translateY(-20px)',
              boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
              zIndex: 3,
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '16px' }}>🔗</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#e2e8f0' }}>포트폴리오 바로가기</span>
          </div>

          {/* 가상 링크 카드 2 */}
          <div
            style={{
              width: '320px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '20px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transform: 'rotate(2deg) translateY(0px) translateX(15px)',
              boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
              zIndex: 2,
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '16px' }}>📸</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#cbd5e1' }}>인스타그램 SNS</span>
          </div>

          {/* 가상 링크 카드 3 */}
          <div
            style={{
              width: '320px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '20px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transform: 'rotate(-2deg) translateY(20px) translateX(-10px)',
              boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
              zIndex: 1,
            }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '16px' }}>✉️</span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#94a3b8' }}>문의하기 / 연락처</span>
          </div>
        </div>

        {/* 하단 구석 워터마크 */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#475569', // slate-600
            fontSize: '14px',
            fontWeight: 750,
          }}
        >
          <span style={{ color: '#3b82f6', fontWeight: 900 }}>MyLink</span>
          <span>프로필 서비스</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
