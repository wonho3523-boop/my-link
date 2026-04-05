import { Mail, Link as LinkIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#fdfaf6] text-black font-sans selection:bg-black selection:text-white flex flex-col lg:flex-row">
      {/* Left Section: Hero / Introduction */}
      <section className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-block px-4 py-2 mb-8 bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-sm rotate-[-2deg] hover:rotate-0 transition-transform">
            Hello World 👋
          </div>

          {/* Huge Title */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase leading-[1.1] tracking-tight mb-8">
            <span className="block">송원호</span>
          </h1>

          {/* Description */}
          <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
            <p className="text-xl sm:text-2xl font-bold leading-relaxed">
              안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다. 🚀
            </p>
            <p className="mt-4 text-base sm:text-lg font-medium text-gray-700">
              새로운 기술을 탐구하고, 재미있는 프로젝트를 만드는 것을 좋아합니다. 
              네오 브루탈리즘 스타일로 새롭게 꾸며본 랜딩 페이지입니다.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="hidden lg:flex gap-4 mt-12">
            <div className="w-16 h-16 bg-blue-400 border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
            <div className="w-16 h-16 bg-pink-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
            <div className="w-16 h-16 bg-emerald-400 border-4 border-black rounded-tl-3xl rounded-br-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          </div>
        </div>
      </section>

      {/* Right Section: Links & Socials */}
      <section className="flex-1 flex flex-col justify-center bg-[#f4f0ea] p-8 sm:p-12 lg:p-24">
        <div className="max-w-xl w-full">
          <h2 className="text-3xl sm:text-4xl font-black uppercase mb-10 border-b-4 border-black pb-4 inline-block">
            Connect & Links
          </h2>

          <div className="flex flex-col gap-6 w-full">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-between bg-white border-4 border-black px-6 py-5 font-black text-xl uppercase transition-all hover:bg-yellow-300 hover:translate-x-[4px] hover:translate-y-[4px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-black text-white rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                </div>
                <span>GitHub</span>
              </div>
              <span className="text-3xl leading-none">→</span>
            </a>

            <a
              href="mailto:hello@example.com"
              className="group flex w-full items-center justify-between bg-white border-4 border-black px-6 py-5 font-black text-xl uppercase transition-all hover:bg-emerald-300 hover:translate-x-[4px] hover:translate-y-[4px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-black text-white rounded-full group-hover:scale-110 transition-transform">
                  <Mail strokeWidth={2.5} size={24} />
                </div>
                <span>Email</span>
              </div>
              <span className="text-3xl leading-none">→</span>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-between bg-white border-4 border-black px-6 py-5 font-black text-xl uppercase transition-all hover:bg-pink-300 hover:translate-x-[4px] hover:translate-y-[4px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-black text-white rounded-full group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </div>
                <span>Instagram</span>
              </div>
              <span className="text-3xl leading-none">→</span>
            </a>

            <a
              href="#"
              className="group flex w-full items-center justify-between bg-white border-4 border-black px-6 py-5 font-black text-xl uppercase transition-all hover:bg-blue-300 hover:translate-x-[4px] hover:translate-y-[4px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-black text-white rounded-full group-hover:scale-110 transition-transform">
                  <LinkIcon strokeWidth={2.5} size={24} />
                </div>
                <span>Portfolio</span>
              </div>
              <span className="text-3xl leading-none">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
