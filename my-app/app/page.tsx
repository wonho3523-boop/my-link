import { Mail, Link as LinkIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 p-6 sm:p-12">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-violet-600/30 blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-fuchsia-600/30 blur-[128px]" style={{ animationDelay: '2s' }}></div>
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-600/20 blur-[128px]" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Glassmorphism Profile Card */}
      <main className="z-10 flex w-full max-w-sm flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/20 sm:p-10">
        
        {/* Avatar Section */}
        <div className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-1 shadow-xl transition-transform duration-500 hover:scale-105">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-zinc-900 bg-zinc-800 text-5xl">
            <span className="text-white transition-transform duration-500 group-hover:scale-110">✨</span>
          </div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            송원호
          </h1>
          <p className="mt-1 text-sm font-medium leading-relaxed text-zinc-400 sm:text-base">
            안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다. 🚀
          </p>
        </div>

        {/* Social Links */}
        <div className="flex w-full flex-col gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 font-semibold text-zinc-200 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 transition-transform group-hover:scale-110"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub 방문하기</span>
          </a>
          <a
            href="mailto:hello@example.com"
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 font-semibold text-zinc-200 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
          >
            <Mail className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span>이메일 보내기</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 font-semibold text-zinc-200 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 transition-transform group-hover:scale-110"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>Instagram 팔로우</span>
          </a>
          <a
            href="#"
            className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-4 font-semibold text-zinc-200 transition-all duration-300 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
          >
            <LinkIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span>나의 포트폴리오</span>
          </a>
        </div>
      </main>
    </div>
  );
}
