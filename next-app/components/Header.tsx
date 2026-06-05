'use client';

import { useAuth } from "@/hooks/useAuth";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Loader2, User, Settings, ChevronDown, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Header() {
  const { user, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Firestore에서 현재 사용자의 프로필 조회 (Query Cache 공유)
  const { data: userProfile } = useQuery({
    queryKey: ["profile", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? userSnap.data() : null;
    },
    enabled: !!user?.uid,
  });

  const profileDisplayName = userProfile?.displayName || user?.displayName || "User";
  const profilePhotoURL = userProfile?.photoURL || user?.photoURL || undefined;
  const profileEmail = userProfile?.email || user?.email || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("로그인되었습니다.");
    } catch (error: any) {
      console.error(error);
      toast.error("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      toast.success("로그아웃되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/admin" className="text-xl font-black tracking-tight text-blue-600">
            MyLink
          </Link>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">마이페이지</span>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              {/* 프로필 트리거 버튼 */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 pr-3 rounded-2xl transition-all duration-200 border border-transparent hover:border-slate-100 text-left focus:outline-none"
              >
                <Avatar className="w-9 h-9 border border-slate-100 shadow-sm shrink-0">
                  <AvatarImage src={profilePhotoURL} alt={profileDisplayName} />
                  <AvatarFallback>{profileDisplayName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                    {profileDisplayName}
                  </span>
                  <span className="text-[9px] text-slate-400 leading-none mt-0.5 truncate max-w-[120px]">
                    {profileEmail}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* 드롭다운 메뉴 레이어 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-150 shadow-xl py-2 z-50 origin-top-right transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2">
                  {/* 상단 프로필 헤더 (모바일 대응) */}
                  <div className="px-4 py-2 border-b border-slate-50 flex flex-col sm:hidden">
                    <span className="text-xs font-bold text-slate-800 truncate">{profileDisplayName}</span>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">{profileEmail}</span>
                  </div>

                  {/* 메뉴 항목 */}
                  <div className="px-1.5 py-1 space-y-0.5">
                    <Link
                      href={`/${encodeURIComponent(profileDisplayName)}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        내 페이지 보기
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      마이페이지 설정
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 my-1"></div>

                  <div className="px-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full px-4 h-9 text-xs font-bold flex items-center gap-2 shadow-sm transition-all duration-200"
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
              구글 로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
