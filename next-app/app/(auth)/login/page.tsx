'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useInAppBrowser } from "@/hooks/useInAppBrowser";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isInApp = useInAppBrowser();

  // 이미 로그인된 사용자는 마이페이지(admin)로 자동 이동
  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    if (isInApp) {
      toast.error("앱 내부 브라우저에서는 구글 로그인을 이용하실 수 없습니다. 다른 브라우저로 접속해 주세요.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("로그인되었습니다.");
      router.push('/admin');
    } catch (error: any) {
      console.error(error);
      toast.error("구글 로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
      <Card className="w-full max-w-sm shadow-md rounded-2xl border border-slate-100">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-black text-blue-600 tracking-tight font-sans">MyLink</CardTitle>
          <CardDescription className="text-xs font-semibold text-slate-400">나만의 링크 트리를 시작해보세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Input type="email" placeholder="이메일 주소" className="rounded-xl h-10 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Input type="password" placeholder="비밀번호" className="rounded-xl h-10 text-xs" />
            </div>
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 text-xs font-bold">
              이메일로 로그인 / 회원가입
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase">또는</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {isInApp && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-xl flex flex-col gap-1 leading-relaxed">
              <div className="font-bold flex items-center gap-1 text-amber-900">
                <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                구글 로그인 제한 안내
              </div>
              <p>
                카카오톡, 인스타그램 등 **앱 내부 브라우저**에서는 구글 보안 정책으로 인해 로그인이 제한됩니다.
              </p>
              <p className="font-semibold text-amber-950">
                화면 우측 하단의 [메뉴(...) 버튼]을 누르고 **[다른 브라우저로 열기]**를 선택하여 다시 시도해 주세요.
              </p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            disabled={isInApp}
            type="button"
            className={`w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl h-10 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 ${
              isInApp ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google 계정으로 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
