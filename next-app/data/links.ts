export type Link = {
  id: string;
  title: string;
  url: string;
  icon: string;
};

export const linkData: Link[] = [
  {
    id: "link-1",
    title: "인스타그램",
    url: "https://instagram.com",
    icon: "Instagram",
  },
  {
    id: "link-2",
    title: "유튜브",
    url: "https://youtube.com",
    icon: "Youtube",
  },
  {
    id: "link-3",
    title: "블로그",
    url: "https://blog.naver.com",
    icon: "BookOpen", // shadcn 아이콘 등에 맞춰 적절히 수정할 수 있습니다
  },
  {
    id: "link-4",
    title: "GitHub",
    url: "https://github.com",
    icon: "Github",
  },
  {
    id: "link-5",
    title: "포트폴리오",
    url: "https://my-portfolio.com",
    icon: "Briefcase",
  },
];
