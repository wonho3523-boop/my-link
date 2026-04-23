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

interface SortableItemProps {
  id: string;
  link: LinkType;
  onUpdate: (id: string, field: keyof LinkType, value: any) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, checked: boolean) => void;
}

function SortableItem({ id, link, onUpdate, onDelete, onToggle }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border mb-3">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-slate-400 hover:text-slate-600 focus:outline-none rounded-lg hover:bg-slate-50">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1 space-y-2">
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
          className="h-8 text-xs text-slate-500 border-transparent hover:border-input focus:border-input px-2"
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
        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function AdminDashboard() {
  const [links, setLinks] = useState<LinkType[]>(linkData);

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

  function handleAddLink() {
    const newLink: LinkType = {
      id: `link-${Date.now()}`,
      title: "새로운 링크",
      url: "https://",
      icon: "Navigation",
      isActive: true,
    };
    setLinks([newLink, ...links]);
  }

  function handleUpdateLink(id: string, field: keyof LinkType, value: any) {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  }

  function handleDeleteLink(id: string) {
    setLinks(links.filter(link => link.id !== id));
  }

  function handleToggleLink(id: string, checked: boolean) {
    setLinks(links.map(link => link.id === id ? { ...link, isActive: checked } : link));
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Left Area - Editor */}
      <div className="w-full lg:w-[60%] h-full overflow-y-auto p-6 md:p-12 border-r bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-black tracking-tight">링크 설정 관리</h1>
            <Button 
              onClick={handleAddLink}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 shadow-sm shadow-blue-200"
            >
              + 새로운 링크 추가
            </Button>
          </div>
          
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 mb-8">
            <p className="text-sm font-semibold text-blue-800 mb-4">현재 화면에 표시할 링크를 편집하고 순서를 변경하세요.</p>
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
    </div>
  );
}
