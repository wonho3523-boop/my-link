'use client';

import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { 
  ArrowRight, 
  MousePointerClick, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Smartphone, 
  Globe,
  Lock
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* 둥둥 떠다니는 부드러운 애니메이션 스타일 주입 */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* 배경 장식 광원 데코레이션 */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>

      {/* 헤더 네비게이션 */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-black tracking-tight text-blue-600 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-blue-500 fill-blue-500" />
              <span>MyLink</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link 
                href="/admin" 
                className={buttonVariants({
                  variant: "outline",
                  className: "rounded-full px-5 h-9 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center"
                })}
              >
                마이페이지 관리
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors px-2">
                  로그인
                </Link>
                <Link 
                  href="/login" 
                  className={buttonVariants({
                    className: "bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 h-9 text-xs font-bold shadow-md shadow-blue-100 transition-all hover:scale-[1.02] flex items-center justify-center"
                  })}
                >
                  시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative flex-1 flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:py-24 max-w-7xl mx-auto w-full gap-12 z-10">
        
        {/* 히어로 텍스트 영역 */}
        <div className="flex-1 space-y-6 text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/60 text-blue-600 text-[11px] font-black uppercase tracking-wider animate-bounce">
            <Sparkles className="w-3.5 h-3.5 fill-blue-500" />
            <span>1초 만에 만드는 나만의 링크 페이지</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] font-sans">
            모든 링크를 <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              하나의 페이지에.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 font-semibold leading-relaxed max-w-lg mx-auto lg:mx-0">
            인스타그램, 유튜브, 네이버 블로그, 포트폴리오까지! 흩어져 있는 나의 모든 링크들을 한곳에 깔끔하게 모아 방문자들에게 나를 완벽하게 어필해 보세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            {user ? (
              <Link 
                href="/admin" 
                className={buttonVariants({
                  className: "w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                })}
              >
                <span>내 대시보드로 이동</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={buttonVariants({
                    className: "w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  })}
                >
                  <span>1초 만에 무료 시작</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="#features" 
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full sm:w-auto border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-12 px-6 rounded-2xl transition-all flex items-center justify-center"
                  })}
                >
                  기능 알아보기
                </Link>
              </>
            )}
          </div>

          {/* 간략 포인트 안내 */}
          <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              구글 간편 로그인 지원
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              모바일 완벽 호환
            </span>
          </div>
        </div>

        {/* 히어로 인터랙티브 모바일 목업 영역 */}
        <div className="flex-1 flex justify-center items-center relative w-full max-w-sm lg:max-w-md">
          {/* 뒤쪽 후광 효과 데코 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-violet-500/10 rounded-full blur-3xl -z-10 scale-90"></div>

          {/* 스마트폰 목업 디바이스 */}
          <div className="w-[280px] h-[550px] bg-slate-900 rounded-[2.8rem] p-3 shadow-2xl border-4 border-slate-800 relative z-10 shrink-0 select-none hover:-rotate-2 hover:scale-[1.01] transition-transform duration-500 ease-out">
            {/* 폰 상단 카메라 노치 */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-slate-850 rounded-full border border-slate-800 ml-auto mr-3"></div>
            </div>

            {/* 화면 스크린 */}
            <div className="w-full h-full bg-gradient-to-b from-blue-50 to-indigo-50 rounded-[2.2rem] overflow-hidden p-4 pt-10 flex flex-col items-center gap-4 relative">
              {/* 목업 상단 배경 그라데이션 원 */}
              <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-blue-400/20 blur-xl"></div>
              
              {/* 프로필 카드 아바타 */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-md border-2 border-white relative z-10 mt-2">
                ML
              </div>

              {/* 닉네임 및 설명 */}
              <div className="text-center space-y-1 relative z-10">
                <h3 className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                  <span>마이링크 공식 프로필</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                </h3>
                <p className="text-[10px] font-semibold text-slate-400">@mylink_official</p>
                <p className="text-[10px] font-semibold text-slate-500 leading-normal px-2 max-w-[200px] mt-1.5">
                  나만의 링크 페이지, MyLink에 방문해 주셔서 감사합니다! 🚀
                </p>
              </div>

              {/* 링크 카드 목록 (둥둥 뜨며 마우스 오버 시 팅기는 효과 적용) */}
              <div className="w-full flex-1 flex flex-col gap-2.5 mt-2 relative z-10">
                
                {/* 카드 1 */}
                <div className="group bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-100 hover:border-blue-400 shadow-sm hover:shadow-md hover:scale-[1.04] p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer animate-float">
                  <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100/50">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-700 truncate group-hover:text-blue-600">포트폴리오 구경하기</h4>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-500 transition-all" />
                </div>

                {/* 카드 2 */}
                <div className="group bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-100 hover:border-pink-400 shadow-sm hover:shadow-md hover:scale-[1.04] p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer animate-float-delayed">
                  <div className="w-7 h-7 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center shrink-0 border border-pink-100/50">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-700 truncate group-hover:text-pink-600">인스타그램 소통 채널</h4>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-pink-500 transition-all" />
                </div>

                {/* 카드 3 */}
                <div className="group bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-100 hover:border-violet-400 shadow-sm hover:shadow-md hover:scale-[1.04] p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 cursor-pointer animate-float">
                  <div className="w-7 h-7 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center shrink-0 border border-violet-100/50">
                    <MousePointerClick className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-700 truncate group-hover:text-violet-600">실시간 통계 및 문의하기</h4>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 group-hover:text-violet-500 transition-all" />
                </div>

              </div>

              {/* 하단 브랜드 표시 */}
              <div className="text-[8px] font-bold text-slate-400 mt-auto flex items-center gap-1 select-none">
                <Sparkles className="w-2.5 h-2.5 text-blue-500 fill-blue-500" />
                <span>Powered by MyLink</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 특징 소개 섹션 */}
      <section id="features" className="bg-slate-100/60 border-y border-slate-200/50 py-16 lg:py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">당신에게 필요한 모든 것</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 leading-relaxed">
              복잡하고 어려운 코딩 없이, 누구나 세련되고 매력적인 나만의 프로필 허브 페이지를 소유할 수 있습니다.
            </p>
          </div>

          {/* 특징 카드 그리드 (3단) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            
            {/* 카드 1: D&D */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800">자유로운 드래그 앤 드롭</h3>
                <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                  순서를 바꾸기 위해 번거롭게 입력할 필요가 없습니다. 링크 정렬 핸들을 잡고 드래그하면 순서가 실시간으로 저장 및 반영됩니다.
                </p>
              </div>

              {/* 미니 D&D 애니메이션 시각 디자인 요소 */}
              <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden flex flex-col gap-2 select-none">
                <div className="h-8 bg-white border border-slate-150 rounded-lg flex items-center gap-2 px-2 text-[9px] font-bold text-slate-600 shadow-sm transform translate-y-0 hover:translate-y-[-2px] transition-transform duration-300 cursor-grab">
                  <div className="w-3 h-4 bg-slate-200 rounded shrink-0"></div>
                  <span>🔗 포트폴리오 링크</span>
                  <div className="ml-auto w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0"></div>
                </div>
                <div className="h-8 bg-white/70 border border-dashed border-blue-400 rounded-lg flex items-center gap-2 px-2 text-[9px] font-bold text-blue-500 shadow-inner">
                  <div className="w-3 h-4 bg-blue-100 rounded shrink-0"></div>
                  <span>💡 여기에 놓으세요</span>
                </div>
              </div>
            </div>

            {/* 카드 2: 통계 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800">실시간 방문 데이터 통계</h3>
                <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                  누가 내 프로필을 보고 어떤 링크를 가장 많이 눌렀을까요? 직관적으로 표현된 클릭 수 분석 차트를 보며 유입률을 파악해 보세요.
                </p>
              </div>

              {/* 미니 차트 애니메이션 시각 디자인 요소 */}
              <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-end justify-between h-20 gap-1.5 select-none">
                <div className="w-full bg-slate-200 rounded-t h-[30%] group-hover:h-[45%] transition-all duration-700"></div>
                <div className="w-full bg-slate-200 rounded-t h-[50%] group-hover:h-[30%] transition-all duration-700"></div>
                <div className="w-full bg-indigo-200 rounded-t h-[40%] group-hover:h-[75%] transition-all duration-700"></div>
                <div className="w-full bg-indigo-500 rounded-t h-[70%] group-hover:h-[95%] transition-all duration-700"></div>
              </div>
            </div>

            {/* 카드 3: 반응형 최적화 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-800">모바일 우선 반응형 디자인</h3>
                <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                  모바일 사용자에게 최상의 가독성과 편의성을 전해주는 모바일 퍼스트 레이아웃을 통해 방문자의 이탈률을 방지합니다.
                </p>
              </div>

              {/* 반응형 디바이스 스택 시각 요소 */}
              <div className="mt-8 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-center gap-3 h-20 select-none">
                <div className="w-10 h-14 bg-slate-300 border border-slate-200 rounded flex items-center justify-center text-[7px] font-bold text-slate-500">PC</div>
                <div className="w-7 h-11 bg-violet-500 border border-violet-400 rounded-md flex items-center justify-center text-[7px] font-bold text-white shadow animate-pulse">Mobile</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA 최종 시작 유도 섹션 */}
      <section className="py-20 px-6 relative overflow-hidden z-10 bg-slate-900 text-white border-b border-slate-800">
        
        {/* 그라데이션 광원 데코레이션 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none"></div>

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <Sparkles className="w-8 h-8 text-blue-400 fill-blue-400/20 mx-auto" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            지금 바로 나만의 링크를 <br />
            무료로 개설하고 소통을 시작하세요
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 max-w-md mx-auto leading-relaxed">
            별도의 비용이나 프로그래밍 지식 없이, 구글 계정만 있다면 1초 만에 깔끔한 나만의 프로필 웹사이트를 호스팅할 수 있습니다.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Link 
                href="/admin" 
                className={buttonVariants({
                  className: "w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-900 font-bold h-12 px-8 rounded-2xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center"
                })}
              >
                관리 대시보드로 이동
              </Link>
            ) : (
              <Link 
                href="/login" 
                className={buttonVariants({
                  className: "w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                })}
              >
                <span>지금 바로 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-slate-900 border-t border-slate-850/30 text-slate-500 py-8 px-6 text-center text-xs font-semibold z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500" />
            <span className="text-slate-400 font-black text-sm tracking-tight">MyLink</span>
          </div>
          <p className="text-slate-450">&copy; {new Date().getFullYear()} MyLink. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-450 select-none">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Powered by MyLink</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
