import PublicProfile from "@/components/PublicProfile";
import { linkData, Link as LinkType } from "@/data/links";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default async function UserPublicPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  let links: LinkType[] = linkData;
  
  if (username === "anonymous") {
    try {
      const linksRef = collection(db, "users", "anonymous", "links");
      const q = query(linksRef, orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const fetchedLinks: LinkType[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as LinkType;
          // 활성화된 링크만 노출 (isActive가 true이거나 설정되지 않은 경우)
          if (data.isActive !== false) {
            fetchedLinks.push(data);
          }
        });
        links = fetchedLinks;
      }
    } catch (error) {
      console.error("서버 사이드 Firestore 데이터 페칭 실패, 기본 데이터 사용:", error);
    }
  }
  
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center font-sans w-full">
      <PublicProfile username={username || "guest"} links={links} />
    </main>
  );
}
