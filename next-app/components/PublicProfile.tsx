'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link as LinkType } from "@/data/links";
import { toast } from "sonner";
import { Copy, Navigation } from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function PublicProfile({
  username,
  links
}: {
  username: string;
  links: LinkType[];
}) {
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("클립보드에 복사되었습니다.", {
      description: url,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col pt-16 pb-8 px-4 shadow-sm border-x relative">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4 border border-border">
          <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}`} />
          <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold">@{username}</h1>
        <p className="text-sm text-muted-foreground mt-2 text-center">안녕하세요, {username}님의 마이링크입니다.</p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {links.map((link) => {
          // lucide-react에서 아이콘을 매칭합니다. 매칭 실패시 Navigation 아이콘을 기본값으로 사용
          const Icon = (LucideIcons as any)[link.icon] || Navigation;
          
          return (
            <div key={link.id} className="relative group">
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-white hover:bg-slate-100 transition-colors rounded-xl border shadow-sm w-full"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg mr-4">
                  <Icon className="w-5 h-5 text-slate-700" />
                </div>
                <span className="font-semibold text-slate-800 flex-1 text-center pr-10">{link.title}</span>
              </a>
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:text-slate-600 rounded-full hover:bg-slate-100"
                onClick={(e) => {
                  e.preventDefault();
                  handleCopyLink(link.url);
                }}
                title="링크 복사"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-16 text-center">
        <a href="/" className="inline-block px-4 py-2 bg-slate-200/50 hover:bg-slate-200 rounded-full text-xs font-semibold text-slate-500 transition-colors">
          ⚡ Powered by MyLink
        </a>
      </div>
    </div>
  );
}
