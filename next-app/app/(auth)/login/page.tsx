import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-sans">MyLink</CardTitle>
          <CardDescription>이메일로 로그인하거나 가입하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="이메일 주소" />
            </div>
            <div className="space-y-2">
              <Input type="password" placeholder="비밀번호" />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full">로그인 / 회원가입</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
