'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { Link as LinkType } from "@/data/links";
import { linkData } from "@/data/links";
import PublicProfile from "./PublicProfile";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GripVertical, Trash2, Pencil, AlertCircle, AlertTriangle, MousePointerClick } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  getDoc,
  deleteDoc, 
  updateDoc, 
  writeBatch, 
  query, 
  orderBy,
  where
} from "firebase/firestore";

interface SortableItemProps {
  id: string;
  link: LinkType;
  links: LinkType[];
  onSave: (id: string, updatedData: Partial<LinkType>) => Promise<void>;
  onDeleteClick: (link: LinkType) => void;
  onToggle: (id: string, checked: boolean) => void;
}

// 아이콘 프리셋 목록 정의
const ICON_PRESETS = [
  { name: "Instagram", label: "인스타그램" },
  { name: "Youtube", label: "유튜브" },
  { name: "Github", label: "GitHub" },
  { name: "BookOpen", label: "블로그" },
  { name: "Briefcase", label: "포트폴리오" },
  { name: "Globe", label: "웹사이트" },
  { name: "Mail", label: "이메일" },
  { name: "MessageCircle", label: "메신저" },
  { name: "Link", label: "기본 링크" },
];

function SortableItem({ id, link, links, onSave, onDeleteClick, onToggle }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [editIcon, setEditIcon] = useState(link.icon);

  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(link.title);
      setEditUrl(link.url);
      setEditIcon(link.icon);
    }
  }, [link, isEditing]);

  const validateEditTitle = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError("링크 제목을 입력해 주세요.");
      return false;
    }
    if (trimmed.length < 2) {
      setTitleError("제목은 최소 2글자 이상 입력해야 합니다.");
      return false;
    }
    if (trimmed.length > 20) {
      setTitleError("제목은 최대 20자까지만 입력 가능합니다.");
      return false;
    }
    setTitleError("");
    return true;
  };

  const validateEditUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || trimmed === "https://" || trimmed === "http://") {
      setUrlError("URL을 입력해 주세요.");
      return false;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setUrlError("URL은 http:// 또는 https://로 시작해야 합니다.");
      return false;
    }
    
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
    if (!urlPattern.test(trimmed)) {
      setUrlError("올바른 URL 도메인 형식이 아닙니다.");
      return false;
    }

    const isDuplicate = links.some(
      (item) => item.id !== id && item.url.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setUrlError("이미 등록된 URL 주소입니다. 다른 주소를 입력해 주세요.");
      return false;
    }

    setUrlError("");
    return true;
  };

  const handleTitleChange = (val: string) => {
    setEditTitle(val);
    validateEditTitle(val);
  };

  const handleUrlChange = (val: string) => {
    setEditUrl(val);
    validateEditUrl(val);
  };

  const handleSave = async () => {
    const isTitleValid = validateEditTitle(editTitle);
    const isUrlValid = validateEditUrl(editUrl);

    if (!isTitleValid || !isUrlValid) return;

    setIsSaving(true);
    try {
      await onSave(id, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        icon: editIcon,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("수정 실패:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setEditIcon(link.icon);
    setTitleError("");
    setUrlError("");
    setIsEditing(false);
  };

  const isFormValid =
    editTitle.trim().length >= 2 &&
    editTitle.trim().length <= 20 &&
    !titleError &&
    !urlError &&
    editUrl.trim() !== "" &&
    editUrl.trim() !== "https://" &&
    editUrl.trim() !== "http://";

  const Icon = (LucideIcons as any)[link.icon] || LucideIcons.Navigation;
  const EditIcon = (LucideIcons as any)[editIcon] || LucideIcons.Navigation;

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-white p-5 rounded-2xl shadow-md border-2 border-blue-500 mb-3 transition-all animate-in fade-in duration-200">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-xl border border-blue-100 shrink-0">
              <EditIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">링크 수정 중</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600">링크 제목</label>
                <span className={`text-[10px] font-semibold ${editTitle.length > 20 ? 'text-red-500' : 'text-slate-400'}`}>
                  {editTitle.length}/20자
                </span>
              </div>
              <Input 
                value={editTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="링크 제목"
                className={`h-9 text-sm font-semibold rounded-xl ${
                  titleError ? 'border-red-500 focus-visible:ring-red-100' : 'border-slate-200'
                }`}
              />
              {titleError && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {titleError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">연결 URL</label>
              <Input 
                value={editUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://"
                className={`h-9 text-xs rounded-xl ${
                  urlError ? 'border-red-500 focus-visible:ring-red-100' : 'border-slate-200'
                }`}
              />
              {urlError && (
                <p className="text-[11px] text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {urlError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">아이콘 프리셋</label>
              <div className="grid grid-cols-5 gap-1">
                {ICON_PRESETS.map((preset) => {
                  const PresetIcon = (LucideIcons as any)[preset.name] || LucideIcons.Navigation;
                  const isSelected = editIcon === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setEditIcon(preset.name)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-150 ${
                        isSelected 
                          ? "border-blue-500 bg-blue-50/50 text-blue-600 font-bold scale-105" 
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-500"
                      }`}
                    >
                      <PresetIcon className="w-4 h-4" />
                      <span className="text-[8px] mt-0.5 truncate max-w-full">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="rounded-lg text-xs font-semibold h-8"
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!isFormValid || isSaving}
              className={`rounded-lg text-xs font-bold h-8 px-4 ${
                isFormValid 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border mb-3 hover:shadow-md transition-shadow">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-slate-600 focus:outline-none rounded-lg hover:bg-slate-50">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex items-center justify-center w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 shrink-0">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0 py-1">
        <h3 className="font-bold text-sm text-slate-800 truncate">{link.title}</h3>
        <p className="text-xs text-slate-500 truncate mt-0.5">{link.url}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 mr-2 border border-slate-200/40 select-none transition-colors" title="누적 클릭 수">
          <MousePointerClick className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span>{link.clicks || 0}</span>
        </div>
        <Switch 
          checked={link.isActive !== false} 
          onCheckedChange={(checked) => onToggle(id, checked)}
          className="data-[state=checked]:bg-emerald-500 mr-2" 
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsEditing(true)}
          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          title="수정"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDeleteClick(link)}
          className="text-slate-400 hover:text-red-600 hover:bg-red-50"
          title="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminDashboard({ user }: { user: User }) {
  const queryClient = useQueryClient();

  // 탭 상태 ("links" = 링크 관리, "profile" = 프로필 설정)
  const [activeTab, setActiveTab] = useState<"links" | "profile">("links");

  // 프로필 설정 상태 선언
  const [profileUsername, setProfileUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [originalDisplayName, setOriginalDisplayName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profilePhotoURL, setProfilePhotoURL] = useState("");

  // 중복 확인 관련 상태
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [isCheckingDisplayName, setIsCheckingDisplayName] = useState(false);
  const [displayNameChecked, setDisplayNameChecked] = useState(false);
  const [displayNameError, setDisplayNameError] = useState("");

  // 다이얼로그 관련 상태 선언
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("https://");
  const [newLinkIcon, setNewLinkIcon] = useState("Link");

  // 삭제 확인 모달 상태 선언
  const [deletingLink, setDeletingLink] = useState<LinkType | null>(null);
  
  // 입력 검증 세분화 에러 상태
  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 1. 유저 링크 리스트 쿼리
  const { data: fetchedLinks = [], isLoading: isLinksLoading } = useQuery<LinkType[]>({
    queryKey: ["links", user.uid],
    queryFn: async () => {
      const linksRef = collection(db, "users", user.uid, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Firestore에 데이터가 전혀 없다면 초기 데이터 시딩 진행
        const batch = writeBatch(db);
        const now = Date.now();
        const initialLinks = linkData.map((link, index) => ({
          ...link,
          createdAt: new Date(now - index * 1000).toISOString(),
        }));
        
        initialLinks.forEach((link) => {
          const docRef = doc(db, "users", user.uid, "links", link.id);
          batch.set(docRef, link);
        });
        
        await batch.commit();
        return initialLinks;
      } else {
        const fetched: LinkType[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push(doc.data() as LinkType);
        });
        return fetched;
      }
    },
    enabled: !!user.uid,
  });

  // 로컬 UI 정렬(dnd-kit) 상태
  const [links, setLinks] = useState<LinkType[]>([]);
  
  // 쿼리 데이터가 성공적으로 페치되면 로컬 상태 초기화
  useEffect(() => {
    if (fetchedLinks) {
      setLinks(fetchedLinks);
    }
  }, [fetchedLinks]);

  // 2. 유저 프로필 데이터 쿼리
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user.uid],
    queryFn: async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        // 최초 가입 유저: 기본 프로필 설정 구성 및 Firestore 생성
        const emailId = user.email ? user.email.split("@")[0] : "user";
        const initialUsername = emailId.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() || `user_${Date.now().toString().slice(-6)}`;
        const initialDisplayName = user.displayName || emailId || "User";
        const initialPhoto = user.photoURL || "";
        const initialBio = "안녕하세요! 저의 마이링크 페이지에 오신 것을 환영합니다.";

        const initialProfile = {
          uid: user.uid,
          displayName: initialDisplayName,
          photoURL: initialPhoto,
          email: user.email || "",
          username: initialUsername,
          bio: initialBio,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(userRef, initialProfile);
        return initialProfile;
      }
    },
    enabled: !!user.uid,
  });

  // 프로필 데이터 쿼리가 페치되면 로컬 인풋 상태 채우기
  useEffect(() => {
    if (userProfile) {
      setProfileUsername(userProfile.username || "");
      setOriginalUsername(userProfile.username || "");
      setProfileDisplayName(userProfile.displayName || "");
      setOriginalDisplayName(userProfile.displayName || "");
      setProfileBio(userProfile.bio || "");
      setProfilePhotoURL(userProfile.photoURL || "");
    }
  }, [userProfile]);

  // 3. 링크 순서 정렬 뮤테이션
  const dragMutation = useMutation({
    mutationFn: async (newLinks: LinkType[]) => {
      const batch = writeBatch(db);
      const now = Date.now();
      newLinks.forEach((link, idx) => {
        const docRef = doc(db, "users", user.uid, "links", link.id);
        const calculatedCreatedAt = new Date(now - idx * 1000).toISOString();
        batch.update(docRef, { createdAt: calculatedCreatedAt });
      });
      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user.uid] });
    },
    onError: (err) => {
      console.error("Firestore 링크 정렬 업데이트 실패:", err);
      toast("링크 정렬 순서 저장에 실패했습니다.");
      setLinks(fetchedLinks); // 실패 시 기존 쿼리 데이터로 롤백
    }
  });

  // 4. 새로운 링크 추가 뮤테이션
  const createLinkMutation = useMutation({
    mutationFn: async (newLinkData: LinkType) => {
      await setDoc(doc(db, "users", user.uid, "links", newLinkData.id), newLinkData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user.uid] });
      setIsAddDialogOpen(false);
      toast("링크가 정상적으로 추가되었습니다.");
    },
    onError: (err) => {
      console.error("Firestore 링크 생성 실패:", err);
      toast("링크 추가에 실패했습니다.");
    }
  });

  // 5. 링크 수정 뮤테이션
  const editLinkMutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: string; updatedData: Partial<LinkType> }) => {
      const now = new Date().toISOString();
      const docRef = doc(db, "users", user.uid, "links", id);
      await updateDoc(docRef, { ...updatedData, updatedAt: now });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user.uid] });
      toast("링크 정보가 수정되었습니다.");
    },
    onError: (err) => {
      console.error("Firestore 링크 수정 실패:", err);
      toast("링크 정보 수정에 실패했습니다.");
    }
  });

  // 6. 링크 삭제 뮤테이션
  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "users", user.uid, "links", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user.uid] });
      setDeletingLink(null);
      toast("링크가 삭제되었습니다.");
    },
    onError: (err) => {
      console.error("Firestore 링크 삭제 실패:", err);
      toast("링크 삭제에 실패했습니다.");
    }
  });

  // 7. 링크 활성화 토글 뮤테이션
  const toggleLinkMutation = useMutation({
    mutationFn: async ({ id, checked }: { id: string; checked: boolean }) => {
      const now = new Date().toISOString();
      const docRef = doc(db, "users", user.uid, "links", id);
      await updateDoc(docRef, { isActive: checked, updatedAt: now });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", user.uid] });
    },
    onError: (err) => {
      console.error("Firestore 링크 활성화 토글 실패:", err);
      toast("링크 활성화 상태 변경에 실패했습니다.");
    }
  });

  // 8. 프로필 변경사항 저장 뮤테이션 (낙관적 업데이트 적용)
  const saveProfileMutation = useMutation({
    mutationFn: async (updatedProfile: { username: string; displayName: string; bio: string; photoURL: string }) => {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...updatedProfile,
        updatedAt: new Date().toISOString()
      });
    },
    onMutate: async (newProfile) => {
      // 진행 중인 프로필 리페치 요청을 취소하여 낙관적 업데이트를 보호합니다.
      await queryClient.cancelQueries({ queryKey: ["profile", user.uid] });

      // 이전 프로필 값을 캐시에서 백업합니다.
      const previousProfile = queryClient.getQueryData(["profile", user.uid]);

      // 새 값으로 낙관적 캐시 업데이트를 수행합니다.
      queryClient.setQueryData(["profile", user.uid], (old: any) => ({
        ...old,
        ...newProfile,
      }));

      // 이전 값을 context로 리턴합니다.
      return { previousProfile };
    },
    onError: (err, newProfile, context) => {
      console.error("Firestore 프로필 업데이트 실패, 롤백 수행:", err);
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile", user.uid], context.previousProfile);
      }
      toast("프로필 저장에 실패했습니다.", {
        description: "원래 상태로 복구됩니다. 잠시 후 다시 시도해 주세요.",
      });
    },
    onSuccess: (_, variables) => {
      setOriginalUsername(variables.username);
      setOriginalDisplayName(variables.displayName);
      setUsernameChecked(false);
      setDisplayNameChecked(false);
      toast("프로필이 성공적으로 저장되었습니다.", {
        description: "변경사항이 퍼블릭 페이지에 즉시 반영됩니다.",
      });
    },
    onSettled: () => {
      // 성공/실패 여부에 상관없이 최종적으로 서버 데이터와 캐시를 매칭시킵니다.
      queryClient.invalidateQueries({ queryKey: ["profile", user.uid] });
    }
  });

  // UI 상태 변수 매핑 (이전의 수동 로딩 overlay 상태들 대체)
  const isUpdating =
    dragMutation.isPending ||
    createLinkMutation.isPending ||
    editLinkMutation.isPending ||
    deleteLinkMutation.isPending ||
    toggleLinkMutation.isPending;
  const isProfileSaving = saveProfileMutation.isPending;
  const isLoading = isLinksLoading || isProfileLoading;

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      let newLinks: LinkType[] = [];
      setLinks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        newLinks = arrayMove(items, oldIndex, newIndex);
        return newLinks;
      });

      // 뮤테이션 구동
      dragMutation.mutate(newLinks);
    }
  }

  // 제목 글자 수 및 필수 입력 유효성 검증 함수
  const validateTitle = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError("링크 제목을 입력해 주세요.");
      return false;
    }
    if (trimmed.length < 2) {
      setTitleError("제목은 최소 2글자 이상 입력해야 합니다.");
      return false;
    }
    if (trimmed.length > 20) {
      setTitleError("제목은 최대 20자까지만 입력 가능합니다.");
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleTitleChange = (val: string) => {
    setNewLinkTitle(val);
    validateTitle(val);
  };

  // URL 호스트, 정밀 도메인 패턴, 중복 유효성 검증 함수
  const validateUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || trimmed === "https://" || trimmed === "http://") {
      setUrlError("URL을 입력해 주세요.");
      return false;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setUrlError("URL은 http:// 또는 https://로 시작해야 합니다.");
      return false;
    }
    
    // 정교한 도메인 검증 정규표현식
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
    if (!urlPattern.test(trimmed)) {
      setUrlError("올바른 URL 도메인 형식이 아닙니다.");
      return false;
    }

    // 중복 URL 체크 (기존 등록된 URL 목록 비교)
    const isDuplicate = links.some(
      (link) => link.url.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setUrlError("이미 등록된 URL 주소입니다. 다른 주소를 입력해 주세요.");
      return false;
    }

    setUrlError("");
    return true;
  };

  const handleUrlChange = (val: string) => {
    setNewLinkUrl(val);
    if (val) {
      validateUrl(val);
    } else {
      setUrlError("URL을 입력해 주세요.");
    }
  };

  // 새로운 링크 다이얼로그 열기
  const handleOpenAddDialog = () => {
    setNewLinkTitle("");
    setNewLinkUrl("https://");
    setNewLinkIcon("Link");
    setTitleError("");
    setUrlError("");
    setIsAddDialogOpen(true);
  };

  // 모달 폼 제출 핸들러
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isTitleValid = validateTitle(newLinkTitle);
    const isUrlValid = validateUrl(newLinkUrl);
    
    if (!isTitleValid || !isUrlValid) return;

    const newId = `link-${Date.now()}`;
    const newLinkData: LinkType = {
      id: newId,
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
      icon: newLinkIcon,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    // 뮤테이션 구동
    createLinkMutation.mutate(newLinkData);
  };

  async function handleSaveEditedLink(id: string, updatedData: Partial<LinkType>) {
    // 뮤테이션 구동
    editLinkMutation.mutate({ id, updatedData });
  }

  async function handleConfirmDelete() {
    if (!deletingLink) return;
    // 뮤테이션 구동
    deleteLinkMutation.mutate(deletingLink.id);
  }

  async function handleToggleLink(id: string, checked: boolean) {
    // 뮤테이션 구동
    toggleLinkMutation.mutate({ id, checked });
  }

  // 사용자 고유 주소(username) 중복 검사
  const checkUsernameDuplicate = async () => {
    const trimmed = profileUsername.trim().toLowerCase();
    if (!trimmed) {
      setUsernameError("고유 주소(username)를 입력해 주세요.");
      return;
    }
    if (!/^[a-z0-9_]{2,20}$/.test(trimmed)) {
      setUsernameError("영문 소문자, 숫자, 언더바(_)만 사용하여 2~20자 입력해 주세요.");
      return;
    }

    setIsCheckingUsername(true);
    setUsernameError("");
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", trimmed));
      const querySnapshot = await getDocs(q);
      
      let isDuplicate = false;
      querySnapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          isDuplicate = true;
        }
      });

      if (isDuplicate) {
        setUsernameError("이미 존재하는 고유 주소입니다. 다른 주소를 입력해 주세요.");
        setUsernameChecked(false);
      } else {
        setUsernameChecked(true);
        setUsernameError("");
        toast("사용 가능한 고유 주소입니다.", {
          description: `@${trimmed} 주소를 사용할 수 있습니다.`,
        });
      }
    } catch (error) {
      console.error("username 중복 검사 에러:", error);
      setUsernameError("중복 검사 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // 표시 이름(displayName) 중복 검사
  const checkDisplayNameDuplicate = async () => {
    const trimmed = profileDisplayName.trim();
    if (!trimmed) {
      setDisplayNameError("표시 이름을 입력해 주세요.");
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 20) {
      setDisplayNameError("표시 이름은 2글자 이상, 20글자 이하여야 합니다.");
      return;
    }

    setIsCheckingDisplayName(true);
    setDisplayNameError("");
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("displayName", "==", trimmed));
      const querySnapshot = await getDocs(q);
      
      let isDuplicate = false;
      querySnapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          isDuplicate = true;
        }
      });

      if (isDuplicate) {
        setDisplayNameError("이미 사용 중인 표시 이름입니다.");
        setDisplayNameChecked(false);
      } else {
        setDisplayNameChecked(true);
        setDisplayNameError("");
        toast("사용 가능한 표시 이름입니다.", {
          description: `"${trimmed}" 표시 이름을 사용할 수 있습니다.`,
        });
      }
    } catch (error) {
      console.error("displayName 중복 검사 에러:", error);
      setDisplayNameError("중복 검사 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingDisplayName(false);
    }
  };

  // 프로필 정보 저장
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = profileUsername.trim().toLowerCase();
    const trimmedDisplayName = profileDisplayName.trim();

    if (!trimmedUsername || !trimmedDisplayName) {
      toast("필수 항목을 입력해 주세요.", {
        description: "고유 주소와 표시 이름은 필수입니다.",
      });
      return;
    }

    // 뮤테이션 구동
    saveProfileMutation.mutate({
      username: trimmedUsername,
      displayName: trimmedDisplayName,
      bio: profileBio.trim(),
      photoURL: profilePhotoURL.trim()
    });
  };

  // 폼 제출 버튼 활성화 상태 조건 정의
  const isFormValid =
    newLinkTitle.trim().length >= 2 &&
    newLinkTitle.trim().length <= 20 &&
    !titleError &&
    !urlError &&
    newLinkUrl.trim() !== "" &&
    newLinkUrl.trim() !== "https://" &&
    newLinkUrl.trim() !== "http://";

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 overflow-hidden font-sans relative">
      {/* Left Area - Editor */}
      <div className="w-full lg:w-[60%] h-full overflow-y-auto p-6 md:p-12 border-r bg-slate-50 relative">
        {/* Syncing Loading Overlay */}
        {(isUpdating || isProfileSaving) && (
          <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-30 flex items-center justify-center animate-in fade-in duration-200">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <LucideIcons.Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-sm font-bold text-slate-700">변경사항 동기화 중...</span>
            </div>
          </div>
        )}
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-3xl font-black tracking-tight">마이페이지 설정 관리</h1>
            {activeTab === "links" && (
              <Button 
                onClick={handleOpenAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 shadow-sm shadow-blue-200 hover:scale-102 transition-transform duration-200"
              >
                + 새로운 링크 추가
              </Button>
            )}
          </div>

          {/* Premium Segmented control tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50 mb-8 max-w-md">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === "links"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100 scale-102"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LucideIcons.Link className="w-4 h-4" />
              링크 관리
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-white text-blue-600 shadow-sm border border-slate-100 scale-102"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LucideIcons.User className="w-4 h-4" />
              프로필 설정
            </button>
          </div>
          
          {activeTab === "links" ? (
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8">
              <p className="text-sm font-semibold text-blue-800 mb-4">현재 화면에 표시할 링크를 편집하고 순서를 변경하세요.</p>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border mb-3 animate-pulse">
                      <div className="w-5 h-5 bg-slate-200 rounded shrink-0 animate-pulse" />
                      <div className="w-10 h-10 bg-slate-100 rounded-lg border border-slate-50 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                      </div>
                      <div className="w-10 h-6 bg-slate-200 rounded-full shrink-0" />
                      <div className="w-8 h-8 bg-slate-200 rounded shrink-0" />
                    </div>
                  ))}
                </div>
              ) : links.length === 0 ? (
                <div className="bg-white/60 border border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400">
                  <LucideIcons.Link className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">등록된 링크가 없습니다.</p>
                  <p className="text-xs mt-1">상단의 '+ 새로운 링크 추가'를 눌러 링크를 등록해보세요.</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {links.map(link => (
                      <SortableItem 
                        key={link.id} 
                        id={link.id} 
                        link={link} 
                        links={links}
                        onSave={handleSaveEditedLink}
                        onDeleteClick={setDeletingLink}
                        onToggle={handleToggleLink}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6 mb-8 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-3 border-slate-100">
                <LucideIcons.UserCog className="w-5 h-5 text-blue-600" />
                내 프로필 정보 편집
              </h2>

              {/* Avatar Image Url */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <LucideIcons.Image className="w-4 h-4 text-purple-500" />
                  프로필 아바타 이미지 주소
                </label>
                <div className="flex gap-3 items-center">
                  <Avatar className="w-16 h-16 border border-slate-200 shrink-0">
                    {profilePhotoURL ? (
                      <AvatarImage src={profilePhotoURL} alt="Avatar Preview" />
                    ) : (
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profileUsername || "user"}`} />
                    )}
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <Input
                      value={profilePhotoURL}
                      onChange={(e) => setProfilePhotoURL(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="rounded-xl border-slate-200 focus:border-blue-500 text-xs h-10"
                    />
                    <p className="text-[10px] text-slate-400 font-semibold">직접 사용할 프로필 이미지 주소 URL을 입력하거나 비워두면 자동으로 기본 아바타를 생성합니다.</p>
                  </div>
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <LucideIcons.Globe className="w-4 h-4 text-emerald-500" />
                    내 페이지 고유 주소 (username)
                  </label>
                  {profileUsername.trim().toLowerCase() !== originalUsername && (
                    <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 rounded px-1.5 py-0.5 font-bold">
                      변경됨 (중복 검사 필요)
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">@</span>
                    <Input
                      value={profileUsername}
                      onChange={(e) => {
                        const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                        setProfileUsername(sanitized);
                        setUsernameChecked(false);
                        setUsernameError("");
                      }}
                      placeholder="username"
                      className={`pl-7 rounded-xl border-slate-200 focus:border-blue-500 font-semibold h-11 ${
                        usernameError ? 'border-red-500' : usernameChecked ? 'border-emerald-500' : ''
                      }`}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={checkUsernameDuplicate}
                    disabled={isCheckingUsername || profileUsername.trim() === "" || profileUsername.trim().toLowerCase() === originalUsername}
                    className={`rounded-xl px-4 font-bold text-xs h-11 shrink-0 ${
                      profileUsername.trim().toLowerCase() === originalUsername
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {isCheckingUsername ? "확인 중..." : "중복 확인"}
                  </Button>
                </div>
                {usernameError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                    <LucideIcons.AlertCircle className="w-3.5 h-3.5" />
                    {usernameError}
                  </p>
                )}
                {usernameChecked && profileUsername.trim().toLowerCase() !== originalUsername && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 animate-in fade-in duration-150">
                    <LucideIcons.CheckCircle2 className="w-3.5 h-3.5" />
                    사용 가능한 고유 주소입니다.
                  </p>
                )}
                <p className="text-[11px] text-slate-400 font-medium">내 퍼블릭 페이지 URL 경로에 적용됩니다. (예: mylink.com/username) 영문 소문자, 숫자, 언더바(_)만 사용하여 2~20자까지 가능합니다.</p>
              </div>

              {/* Display Name Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <LucideIcons.User className="w-4 h-4 text-blue-500" />
                    표시 이름 (displayName)
                  </label>
                  {profileDisplayName.trim() !== originalDisplayName && (
                    <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 rounded px-1.5 py-0.5 font-bold">
                      변경됨 (중복 검사 권장)
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={profileDisplayName}
                    onChange={(e) => {
                      setProfileDisplayName(e.target.value);
                      setDisplayNameChecked(false);
                      setDisplayNameError("");
                    }}
                    placeholder="이름 또는 브랜드명"
                    className={`rounded-xl border-slate-200 focus:border-blue-500 font-semibold h-11 ${
                      displayNameError ? 'border-red-500' : displayNameChecked ? 'border-emerald-500' : ''
                    }`}
                    required
                  />
                  <Button
                    type="button"
                    onClick={checkDisplayNameDuplicate}
                    disabled={isCheckingDisplayName || profileDisplayName.trim() === "" || profileDisplayName.trim() === originalDisplayName}
                    className={`rounded-xl px-4 font-bold text-xs h-11 shrink-0 ${
                      profileDisplayName.trim() === originalDisplayName
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    {isCheckingDisplayName ? "확인 중..." : "중복 확인"}
                  </Button>
                </div>
                {displayNameError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                    <LucideIcons.AlertCircle className="w-3.5 h-3.5" />
                    {displayNameError}
                  </p>
                )}
                {displayNameChecked && profileDisplayName.trim() !== originalDisplayName && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 animate-in fade-in duration-150">
                    <LucideIcons.CheckCircle2 className="w-3.5 h-3.5" />
                    사용 가능한 표시 이름입니다.
                  </p>
                )}
                <p className="text-[11px] text-slate-400 font-medium">프로필 화면 최상단에 노출되는 이름입니다.</p>
              </div>

              {/* Bio TextArea */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <LucideIcons.TextQuote className="w-4 h-4 text-amber-500" />
                    소개글 (bio)
                  </label>
                  <span className={`text-[10px] font-bold ${profileBio.length > 100 ? 'text-red-500' : 'text-slate-400'}`}>
                    {profileBio.length}/100자
                  </span>
                </div>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value.slice(0, 100))}
                  placeholder="방문자들에게 전할 환영 인사를 남겨보세요."
                  rows={3}
                  className="w-full p-3.5 text-sm font-semibold rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none transition-all scrollbar-hide"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    isProfileSaving ||
                    profileUsername.trim() === "" ||
                    profileDisplayName.trim() === "" ||
                    (profileUsername.trim().toLowerCase() !== originalUsername && !usernameChecked) ||
                    (profileDisplayName.trim() !== originalDisplayName && !displayNameChecked)
                  }
                  className={`rounded-2xl h-12 px-8 font-bold transition-all duration-200 ${
                    (!isProfileSaving &&
                     profileUsername.trim() !== "" && 
                     profileDisplayName.trim() !== "" && 
                     (profileUsername.trim().toLowerCase() === originalUsername || usernameChecked) &&
                     (profileDisplayName.trim() === originalDisplayName || displayNameChecked))
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isProfileSaving ? "저장 중..." : "변경사항 저장"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Area - Live Preview Mockup */}
      <div className="hidden lg:flex w-[40%] h-full items-center justify-center p-8 bg-slate-100 relative">
        <div className="absolute top-6 right-8 text-sm uppercase tracking-widest font-bold text-slate-400">Live Preview</div>
        <div className="absolute bottom-6 underline text-sm text-slate-400 font-medium">✨ 변경사항이 실시간으로 적용됩니다.</div>
        
        {/* Smartphone Frame Mockup */}
        <div className="w-[375px] h-[750px] bg-white border-[14px] border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative">
          {/* Mock Notch */}
          <div className="w-[120px] h-[30px] bg-slate-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />
          
          {/* Scrollable Screen Content */}
          <div className="h-full w-full overflow-y-auto bg-slate-50 relative z-10 scrollbar-hide">
            <PublicProfile 
              username={profileDisplayName || profileUsername || "User"} 
              avatarUrl={profilePhotoURL || undefined} 
              bio={profileBio}
              links={links} 
            />
          </div>
        </div>
      </div>

      {/* --- PREMIUM CUSTOM DIALOG (MODAL) --- */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          {/* Modal Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setIsAddDialogOpen(false)} />
          
          {/* Modal Content Box */}
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative z-10 transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">새로운 링크 추가</h2>
                <p className="text-xs text-slate-500 mt-1">프로필 페이지에 노출될 링크 정보를 설정합니다.</p>
              </div>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                onClick={() => setIsAddDialogOpen(false)}
                className="rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <LucideIcons.X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateLink} className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin">
              {/* 제목 입력 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <LucideIcons.Type className="w-4 h-4 text-blue-500" />
                    링크 제목
                  </label>
                  <span className={`text-xs font-semibold ${newLinkTitle.length > 20 ? 'text-red-500' : 'text-slate-400'}`}>
                    {newLinkTitle.length}/20자
                  </span>
                </div>
                <Input 
                  value={newLinkTitle} 
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="예: 공식 인스타그램, 개인 블로그 등"
                  className={`rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-100 font-semibold h-11 ${
                    titleError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                  }`}
                  required
                  maxLength={30}
                  autoFocus
                />
                {titleError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                    <LucideIcons.AlertCircle className="w-3.5 h-3.5" />
                    {titleError}
                  </p>
                )}
              </div>

              {/* URL 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <LucideIcons.Link2 className="w-4 h-4 text-emerald-500" />
                  연결 URL
                </label>
                <Input 
                  value={newLinkUrl} 
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className={`rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-100 h-11 ${
                    urlError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                  }`}
                  required
                />
                {urlError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                    <LucideIcons.AlertCircle className="w-3.5 h-3.5" />
                    {urlError}
                  </p>
                )}
              </div>

              {/* 아이콘 선택 그리드 */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <LucideIcons.Smile className="w-4 h-4 text-amber-500" />
                  아이콘 프리셋
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ICON_PRESETS.map((preset) => {
                    const PresetIcon = (LucideIcons as any)[preset.name] || LucideIcons.Navigation;
                    const isSelected = newLinkIcon === preset.name;
                    
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setNewLinkIcon(preset.name)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 gap-1.5 ${
                          isSelected 
                            ? "border-blue-500 bg-blue-50/50 text-blue-600 font-bold scale-102 shadow-sm" 
                            : "border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <PresetIcon className={`w-5 h-5 ${isSelected ? "text-blue-500" : "text-slate-500"}`} />
                        <span className="text-[11px] truncate w-full">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddDialogOpen(false)}
                className="rounded-xl px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 h-11"
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleCreateLink}
                disabled={!isFormValid}
                className={`rounded-xl px-6 py-2.5 font-bold h-11 transition-all duration-200 ${
                  isFormValid 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                링크 추가하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION DIALOG (MODAL) --- */}
      {deletingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setDeletingLink(null)} />
          
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative z-10 transform transition-all animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">정말 삭제하시겠습니까?</h2>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">삭제 대상 링크</span>
                <span className="text-sm font-bold text-slate-700">{deletingLink.title}</span>
                <span className="text-xs text-slate-500 block truncate mt-0.5">{deletingLink.url}</span>
              </div>
              <p className="text-sm font-semibold text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDeletingLink(null)}
                className="rounded-xl px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 h-11"
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2.5 font-bold h-11 transition-all duration-200 shadow-md shadow-red-200"
              >
                삭제하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

