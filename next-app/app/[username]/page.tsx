import PublicProfile from "@/components/PublicProfile";
import { linkData } from "@/data/links";

export default async function UserPublicPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
      {/* 데이터가 연동되기 전에는 더미데이터를 넣어 초기 렌더링을 확인합니다 */}
      <PublicProfile username={username || "guest"} links={linkData} />
    </main>
  );
}
