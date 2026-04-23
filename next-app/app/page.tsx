import { redirect } from 'next/navigation';

export default function RootPage() {
  // 요구사항에 맞춰 기본 경로는 로그인(또는 소개) 페이지로 리다이렉트합니다.
  redirect('/login');
}
