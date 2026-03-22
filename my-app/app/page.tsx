export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8 dark:bg-black">
      <main className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          송원호
        </h1>
        <p className="max-w-[400px] text-lg text-zinc-600 dark:text-zinc-400">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>
      </main>
    </div>
  );
}
