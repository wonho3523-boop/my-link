import { notFound } from "next/navigation";
import PublicProfile from "@/components/PublicProfile";
import { Link as LinkType } from "@/data/links";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

interface PageProps {
  params: Promise<{ displayName: string }>;
}

export default async function UserPublicPage({ params }: PageProps) {
  const { displayName: rawDisplayName } = await params;
  const decodedDisplayName = decodeURIComponent(rawDisplayName);
  
  let userDoc = null;
  
  try {
    // 1. 유저 정보 및 프로필 조회 (displayName 필드로 검색)
    const usersRef = collection(db, "users");
    const qUser = query(usersRef, where("displayName", "==", decodedDisplayName));
    const userSnapshot = await getDocs(qUser);
    
    if (!userSnapshot.empty) {
      userDoc = userSnapshot.docs[0];
    }
  } catch (error) {
    console.error("서버 사이드 Firestore 유저 조회 실패:", error);
  }

  // 유저를 찾지 못했거나 에러가 발생한 경우 404 페이지 반환
  if (!userDoc) {
    notFound();
  }

  const userData = userDoc.data();
  const uid = userDoc.id; // 문서 ID가 유저의 uid
  const userDisplayName = userData.displayName || decodedDisplayName;
  const avatarUrl = userData.photoURL || undefined;
  const bio = userData.bio || "";

  let links: LinkType[] = [];

  try {
    // 2. 유저 개인화 링크 리스트 조회 (uid 사용)
    const linksRef = collection(db, "users", uid, "links");
    const qLinks = query(linksRef, orderBy("createdAt", "desc"));
    const querySnapshotLinks = await getDocs(qLinks);
    
    if (!querySnapshotLinks.empty) {
      const fetchedLinks: LinkType[] = [];
      querySnapshotLinks.forEach((doc) => {
        const data = doc.data() as LinkType;
        // 활성화된 링크만 노출 (isActive가 true이거나 설정되지 않은 경우)
        if (data.isActive !== false) {
          fetchedLinks.push(data);
        }
      });
      links = fetchedLinks;
    }
  } catch (error) {
    console.error("서버 사이드 Firestore 링크 페칭 실패:", error);
  }
  
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center font-sans w-full">
      <PublicProfile username={userDisplayName} avatarUrl={avatarUrl} bio={bio} links={links} />
    </main>
  );
}
