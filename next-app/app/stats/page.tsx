'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link as LinkType } from "@/data/links";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { Loader2, MousePointerClick, Link2, TrendingUp, BarChart3 } from "lucide-react";

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // 1. 비로그인 유저 리다이렉트 처리
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // 2. 유저 링크 리스트 쿼리
  const { data: links = [], isLoading: dataLoading } = useQuery<LinkType[]>({
    queryKey: ["links", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const linksRef = collection(db, "users", user.uid, "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetched: LinkType[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push(doc.data() as LinkType);
      });
      return fetched;
    },
    enabled: !!user?.uid,
  });

  // 로딩 상태 렌더링
  if (authLoading || dataLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold text-slate-500">통계 데이터를 불러오는 중입니다...</span>
        </div>
      </div>
    );
  }

  // 3. 통계 데이터 계산
  const activeLinks = links.filter(link => link.isActive !== false);
  const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  
  // 가장 높은 클릭 수 링크 찾기
  const sortedByClicks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
  const topLink = sortedByClicks[0];
  const topLinkTitle = topLink && (topLink.clicks || 0) > 0 ? topLink.title : "기록 없음";

  // 차트용 데이터 가공 (클릭 수 기준 정렬 또는 최근 등록 순 등)
  // 여기서는 보기 좋게 클릭 수가 높은 링크부터 순서대로 시각화합니다.
  const chartData = sortedByClicks.map(link => ({
    name: link.title,
    clicks: link.clicks || 0,
  }));

  // 차트 컬러 설정
  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "hsl(var(--primary))",
    },
  };

  // 막대 그래프 테마 색상 배열 (인디고, 바이올렛, 블루 등 모던 테마 매칭)
  const COLORS = [
    "#3b82f6", // blue-500
    "#6366f1", // indigo-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#14b8a6", // teal-500
    "#f59e0b", // amber-500
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Title Section */}
        <div className="flex items-center gap-3 border-b pb-5 border-slate-200/60">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">통계 대시보드</h1>
            <p className="text-sm text-slate-500 mt-1">내 마이링크 페이지의 방문자 반응과 링크별 클릭 성과를 분석합니다.</p>
          </div>
        </div>

        {/* 3-Column Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Clicks */}
          <Card className="rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">총 클릭 수</span>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">{totalClicks.toLocaleString()}</h2>
                <p className="text-[10px] text-slate-500 font-semibold">전체 링크의 누적 아웃바운드 클릭 수</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <MousePointerClick className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Active Links */}
          <Card className="rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">노출 중인 링크</span>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">{activeLinks.length}개</h2>
                <p className="text-[10px] text-slate-500 font-semibold">전체 {links.length}개 중 활성화된 링크</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Top Performing Link */}
          <Card className="rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1 max-w-[70%]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">가장 인기 있는 링크</span>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight truncate mt-1.5">{topLinkTitle}</h2>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {topLink && (topLink.clicks || 0) > 0 
                    ? `누적 클릭 ${topLink.clicks}회 달성` 
                    : "클릭된 링크가 아직 없습니다"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden p-6 md:p-8">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-lg font-bold text-slate-800">링크별 클릭 수 통계</CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-1">등록된 전체 링크의 클릭 성과를 그래프로 비교해 보세요.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 h-[350px] md:h-[400px]">
            {chartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl text-slate-400">
                <Link2 className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-semibold">시각화할 링크 데이터가 없습니다.</p>
                <p className="text-xs mt-1">마이페이지에서 새로운 링크를 등록해 보세요.</p>
              </div>
            ) : totalClicks === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl text-slate-400">
                <MousePointerClick className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-semibold">아직 발생한 클릭이 존재하지 않습니다.</p>
                <p className="text-xs mt-1">방문자들이 링크를 클릭하면 실시간 통계가 제공됩니다.</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={chartData} 
                    margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false}
                      className="text-[11px] font-bold text-slate-500"
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false}
                      allowDecimals={false}
                      className="text-[11px] font-mono text-slate-400"
                    />
                    <ChartTooltip 
                      cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
                      content={<ChartTooltipContent indicator="dot" />} 
                    />
                    <Bar 
                      dataKey="clicks" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={50}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
