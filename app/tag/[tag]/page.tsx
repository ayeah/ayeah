// 标签页面 - 服务端组件用于静态生成
import { TagPageClient } from './page-client';

// 生成静态参数
export function generateStaticParams() {
  return [
    { tag: 'openclaw' },
    { tag: 'agents' },
    { tag: 'skills' },
    { tag: 'resources' },
    { tag: 'news' },
  ];
}

interface PageProps {
  params: Promise<{ tag: string }>;
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  return <TagPageClient tag={tag} />;
}
