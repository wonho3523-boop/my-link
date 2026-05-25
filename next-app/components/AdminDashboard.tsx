'use client';

import { useState } from "react";
import { Link as LinkType } from "@/data/links";
import { linkData } from "@/data/links";
import PublicProfile from "./PublicProfile";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import * as LucideIcons from "lucide-react";

interface SortableItemProps {
  id: string;
  link: LinkType;
  onUpdate: (id: string, field: keyof LinkType, value: any) => void;
  onDelete: (id: string) => void;
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

function SortableItem({ id, link, onUpdate, onDelete, onToggle }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = (LucideIcons as any)[link.icon] || LucideIcons.Navigation;

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border mb-3 hover:shadow-md transition-shadow">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-slate-600 focus:outline-none rounded-lg hover:bg-slate-50">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex items-center justify-center w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 shrink-0">
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <Input 
          value={link.title} 
          onChange={(e) => onUpdate(id, "title", e.target.value)}
          placeholder="링크 제목"
          className="h-8 font-semibold text-sm border-transparent hover:border-input focus:border-input px-2"
        />
        <Input 
          value={link.url} 
          onChange={(e) => onUpdate(id, "url", e.target.value)}
          placeholder="https://"
          className="h-8 text-xs text-slate-500 border-transparent hover:border-input focus:border-input px-2 truncate"
        />
      </div>
      <Switch 
        checked={link.isActive !== false} 
        onCheckedChange={(checked) => onToggle(id, checked)}
        className="data-[state=checked]:bg-emerald-500" 
      />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onDelete(id)}
        className="text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function AdminDashboard() {
  const [links, setLinks] = useState<LinkType[]>(linkData);
  
  // 다이얼로그 관련 상태 선언
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("https://");
  const [newLinkIcon, setNewLinkIcon] = useState("Link");
  const [urlError, setUrlError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // URL 유효성 검증 함수
  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError("URL을 입력해 주세요.");
      return false;
    }
    if (!/^https?:\/\//i.test(url)) {
      setUrlError("URL은 http:// 또는 https://로 시작해야 합니다.");
      return false;
    }
    try {
      new URL(url);
      setUrlError("");
      return true;
    } catch (_) {
      setUrlError("올바른 URL 형식이 아닙니다.");
      return false;
    }
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
    setUrlError("");
    setIsAddDialogOpen(true);
  };

  // 모달 폼 제출 핸들러 (로컬 상태 반영)
  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim()) return;
    if (!validateUrl(newLinkUrl)) return;

    const newLink: LinkType = {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
      icon: newLinkIcon,
      isActive: true,
    };

    setLinks([newLink, ...links]);
    setIsAddDialogOpen(false);
  };

  function handleUpdateLink(id: string, field: keyof LinkType, value: any) {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  }

  function handleDeleteLink(id: string) {
    setLinks(links.filter(link => link.id !== id));
  }

  function handleToggleLink(id: string, checked: boolean) {
    setLinks(links.map(link => link.id === id ? { ...link, isActive: checked } : link));
  }

  const isFormValid = newLinkTitle.trim().length >= 1 && !urlError && newLinkUrl.trim() !== "" && newLinkUrl.trim() !== "https://";

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 overflow-hidden font-sans relative">
      {/* Left Area - Editor */}
      <div className="w-full lg:w-[60%] h-full overflow-y-auto p-6 md:p-12 border-r bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-black tracking-tight">링크 설정 관리</h1>
            <Button 
              onClick={handleOpenAddDialog}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 shadow-sm shadow-blue-200 hover:scale-102 transition-transform duration-200"
            >
              + 새로운 링크 추가
            </Button>
          </div>
          
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8">
            <p className="text-sm font-semibold text-blue-800 mb-4">현재 화면에 표시할 링크를 편집하고 순서를 변경하세요.</p>
            {links.length === 0 ? (
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
                      onUpdate={handleUpdateLink}
                      onDelete={handleDeleteLink}
                      onToggle={handleToggleLink}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
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
            <PublicProfile username="관리자" links={links} />
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
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <LucideIcons.Type className="w-4 h-4 text-blue-500" />
                  링크 제목
                </label>
                <Input 
                  value={newLinkTitle} 
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="예: 공식 인스타그램, 개인 블로그 등"
                  className="rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-100 font-semibold h-11"
                  required
                  autoFocus
                />
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
                  className={`rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-100 h-11 ${urlError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
                  required
                />
                {urlError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
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
    </div>
  );
}

