'use client';

import { Button } from "@/components/ui/button";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Link2, ShieldAlert } from "lucide-react";
import { useInAppBrowser } from "@/hooks/useInAppBrowser";

export default function LoginPrompt() {
  const isInApp = useInAppBrowser();

  const handleLogin = async () => {
    if (isInApp) {
      toast.error("앱 내부 브라우저에서는 구글 로그인을 이용하실 수 없습니다. 우측 하단 메뉴에서 [다른 브라우저로 열기]를 선택해 주세요.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("로그인되었습니다.");
    } catch (error: any) {
      console.error(error);
      toast.error("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-100/80 text-center space-y-6 transition-all duration-300 hover:shadow-2xl">
        <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
          <Link2 className="w-8 h-8 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">나만의 링크 페이지 만들기</h2>
          <p className="text-sm font-semibold text-slate-500 leading-relaxed px-2">
            구글 소셜 로그인을 통해 간편하게 로그인한 뒤, 인스타그램, 유튜브, 포트폴리오 등 소셜 미디어와 웹사이트 링크를 한곳에서 예쁘게 모아 관리하고 공유해 보세요!
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100 space-y-2.5">
          <div className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
            <span className="bg-blue-100 text-blue-700 font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>간편하게 구글 계정 하나로 1초 만에 마이페이지를 생성합니다.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
            <span className="bg-blue-100 text-blue-700 font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>원하는 링크의 제목, 주소, 아이콘을 직관적으로 편집합니다.</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
            <span className="bg-blue-100 text-blue-700 font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>드래그 앤 드롭을 이용해 링크 순서를 자유롭게 배치합니다.</span>
          </div>
        </div>

        {isInApp && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-2xl flex flex-col gap-1 text-left leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              구글 로그인 차단 안내
            </div>
            <p>
              카카오톡, 인스타그램 등 **앱 내부 브라우저**에서는 구글 보안 정책으로 인해 로그인이 불가능합니다.
            </p>
            <p className="font-bold text-amber-950">
              화면 우측 하단의 [메뉴(...) 버튼]을 누르고 **[다른 브라우저로 열기]**를 선택하여 다시 시도해 주세요.
            </p>
          </div>
        )}

        <Button
          onClick={handleLogin}
          disabled={isInApp}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all duration-200 ${
            isInApp ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
          }`}
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#FFFFFF"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#FFFFFF"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              opacity="0.85"
            />
            <path
              fill="#FFFFFF"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              opacity="0.9"
            />
            <path
              fill="#FFFFFF"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              opacity="0.95"
            />
          </svg>
          Google 계정으로 시작하기
        </Button>

        <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 py-2 rounded-xl">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>본 서비스는 이메일 인증 및 개인화된 관리를 지원합니다.</span>
        </div>
      </div>
    </div>
  );
}
