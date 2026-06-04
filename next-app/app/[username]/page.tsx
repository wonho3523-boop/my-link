import PublicProfile from "@/components/PublicProfile";
import { linkData, Link as LinkType } from "@/data/links";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";

export default async function UserPublicPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  let links: LinkType[] = [];
  let displayName = username || "guest";
  let avatarUrl: string | undefined = undefined;
  
  try {
    // 1. 유저 정보 및 프로필 조회
    const userDocRef = doc(db, "users", username);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      displayName = userData.displayName || username;
      avatarUrl = userData.photoURL || undefined;
    }

    // 2. 유저 개인화 링크 리스트 조회
    const linksRef = collection(db, "users", username, "links");
    const q = query(linksRef, orderBy("createdAt", "desc"));
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
    } else {
      // Firestore에 데이터가 없는 경우 기존 mock 데이터의 활성화된 링크들을 폴백 노출합니다.
      links = linkData.filter((link) => link.isActive !== false);
    }
  } catch (error) {
    console.error("서버 사이드 Firestore 데이터 페칭 실패, 기본 데이터 사용:", error);
    links = linkData.filter((link) => link.isActive !== false);
  }
  
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center font-sans w-full">
      <PublicProfile username={displayName} avatarUrl={avatarUrl} links={links} />
    </main>
  );
}
