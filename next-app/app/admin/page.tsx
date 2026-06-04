'use client';

import Header from "@/components/Header";
import LoginPrompt from "@/components/LoginPrompt";
import AdminDashboard from "@/components/AdminDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">인증 상태를 확인 중입니다...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      {user ? (
        <main className="flex-1">
          <AdminDashboard user={user} />
        </main>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
