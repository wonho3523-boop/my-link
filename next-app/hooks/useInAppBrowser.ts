'use client';

import { useEffect, useState } from 'react';

/**
 * 카카오톡, 인스타그램 등 소셜 미디어 앱의 인앱 웹뷰(인앱 브라우저) 환경인지 감지하는 훅입니다.
 */
export function useInAppBrowser() {
  const [isInApp, setIsInApp] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userAgent = window.navigator.userAgent.toLowerCase();

    // 카카오톡, 인스타그램, 페이스북, 라인, 밴드, 에브리타임, 트위터(X) 등 인앱 브라우저 키워드 감지
    const inAppKeywords = [
      'kakaotalk',
      'instagram',
      'fb_iab',
      'fbav', // Facebook App
      'line',
      'everytimeapp',
      'band',
      'twitter',
    ];

    const detectInApp = inAppKeywords.some((keyword) => userAgent.includes(keyword));
    setIsInApp(detectInApp);
  }, []);

  return isInApp;
}
