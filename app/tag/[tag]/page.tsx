'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft, Zap, Brain, Code, BookOpen, TrendingUp, Sparkles } from 'lucide-react';

// 标签配置
const tagConfig: Record<string, { title: string; description: string; icon: any; color: string }> = {
  openclaw: {
    title: 'OpenClaw',
    description: '探索 OpenClaw 智能体框架的无限可能，从入门到精通的完整指南',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
  },
  agents: {
    title: 'AI 智能体',
    description: '深入解析 AI Agent 架构设计、开发实践与前沿应用案例',
    icon: Brain,
    color: 'from-cyan-500 to-blue-500',
  },
  skills: {
    title: '技能开发',
    description: '分享实用的 AI 技能开发技巧、工具使用和最佳实践',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
  },
  resources: {
    title: 'AI 资源',
    description: '精选 AI 学习资源、工具推荐和实用链接',
    icon: BookOpen,
    color: 'from-yellow-500 to-orange-500',
  },
  news: {
    title: 'AI 新闻',
    description: '追踪 AI 领域最新动态、技术突破和行业资讯',
    icon: TrendingUp,
    color: 'from-red-500 to-rose-500',
  },
};

// 示例文章数据
const sampleArticles: Record<string, Array<{ title: string; excerpt: string; date: string; readTime: string; slug: string }>> = {
  openclaw: [
    {
      title: 'OpenClaw 入门指南：从零开始构建你的第一个 AI 智能体',
      excerpt: '本文将带你一步步了解 OpenClaw 的核心概念，从环境配置到第一个智能体的完整开发流程。',
      date: '2026-03-25',
      readTime: '8 分钟',
      slug: 'openclaw-getting-started',
    },
    {
      title: 'OpenClaw 技能开发详解：打造你的专属工具库',
      excerpt: '深入探讨 OpenClaw 技能系统，学习如何创建、测试和发布自定义技能。',
      date: '2026-03-20',
      readTime: '12 分钟',
      slug: 'openclaw-skill-development',
    },
    {
      title: 'OpenClaw 与企业微信集成：实战案例分析',
      excerpt: '分享如何将 OpenClaw 与企业微信深度集成，实现消息推送、待办管理等功能。',
      date: '2026-03-15',
      readTime: '10 分钟',
      slug: 'openclaw-wecom-integration',
    },
    {
      title: 'OpenClaw 高级技巧：多智能体协作与任务编排',
      excerpt: '探索 OpenClaw 的高级用法，学习如何构建复杂的多智能体系统。',
      date: '2026-03-10',
      readTime: '15 分钟',
      slug: 'openclaw-multi-agent',
    },
  ],
  agents: [
    {
      title: 'AI Agent 架构设计：从理论到实践',
      excerpt: '全面解析 AI Agent 的核心组件，包括感知、规划、执行和记忆系统。',
      date: '2026-03-24',
      readTime: '10 分钟',
      slug: 'ai-agent-architecture',
    },
    {
      title: '构建任务型智能体：最佳实践与常见陷阱',
      excerpt: '分享任务型智能体的开发经验，帮助你避免常见错误。',
      date: '2026-03-18',
      readTime: '8 分钟',
      slug: 'task-agent-best-practices',
    },
    {
      title: '智能体记忆系统设计：让 AI 记住更多',
      excerpt: '探讨智能体记忆系统的设计模式，实现长期记忆和上下文理解。',
      date: '2026-03-12',
      readTime: '12 分钟',
      slug: 'agent-memory-system',
    },
  ],
  skills: [
    {
      title: '从零开发一个 Web 搜索技能',
      excerpt: '详细讲解如何集成搜索引擎 API，为智能体添加网络搜索能力。',
      date: '2026-03-23',
      readTime: '10 分钟',
      slug: 'web-search-skill',
    },
    {
      title: '文档处理技能开发：支持多种格式',
      excerpt: '学习如何处理 PDF、Word、Excel 等多种文档格式。',
      date: '2026-03-17',
      readTime: '8 分钟',
      slug: 'document-processing-skill',
    },
    {
      title: '消息推送技能：打通通知最后一公里',
      excerpt: '实现与企业微信、钉钉、Telegram 等平台的消息推送集成。',
      date: '2026-03-11',
      readTime: '6 分钟',
      slug: 'notification-skill',
    },
  ],
  resources: [
    {
      title: '2026 年 AI 学习资源清单',
      excerpt: '精心整理的 AI 学习资源，包括课程、书籍、论文和工具。',
      date: '2026-03-22',
      readTime: '5 分钟',
      slug: 'ai-learning-resources-2026',
    },
    {
      title: '开源 AI 框架对比：选型指南',
      excerpt: '对比主流 AI 框架的特点，帮助你做出正确的技术选型。',
      date: '2026-03-16',
      readTime: '10 分钟',
      slug: 'ai-framework-comparison',
    },
  ],
  news: [
    {
      title: 'GPT-5 发布：AI 能力的新里程碑',
      excerpt: '解读 GPT-5 的新特性和对 AI 行业的影响。',
      date: '2026-03-26',
      readTime: '5 分钟',
      slug: 'gpt5-release',
    },
    {
      title: 'OpenClaw 2.0 正式发布：重大更新一览',
      excerpt: 'OpenClaw 2.0 带来全新架构和众多新特性。',
      date: '2026-03-21',
      readTime: '6 分钟',
      slug: 'openclaw-2-release',
    },
    {
      title: 'AI Agent 市场规模预测：2026 年将达到千亿美元',
      excerpt: '分析 AI Agent 市场的发展趋势和商业机会。',
      date: '2026-03-14',
      readTime: '4 分钟',
      slug: 'ai-agent-market-2026',
    },
  ],
};

export default function TagPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const tag = params?.tag as string;
  const config = tagConfig[tag];

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">标签不存在</h1>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            返回首页 →
          </Link>
        </div>
      </div>
    );
  }

  const articles = sampleArticles[tag] || [];
  const Icon = config.icon;

  if (!mounted) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Link>

            <div className="flex justify-center mb-6">
              <div className={`p-6 rounded-2xl bg-gradient-to-r ${config.color}`}>
                <Icon className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              {config.title}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {config.description}
            </p>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              相关文章
            </h2>
            <span className="text-slate-400">
              共 {articles.length} 篇
            </span>
          </div>

          <div className="space-y-6">
            {articles.map((article, index) => (
              <article
                key={article.slug}
                className="group"
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                }}
              >
                <Link href={`/blog2016/${article.slug}`}>
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {article.title}
                      </h3>
                      <Sparkles className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                    
                    <p className="text-slate-400 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {article.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center">
                        <Tag className="w-4 h-4 mr-1" />
                        {config.title}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                暂无文章，敬请期待
              </p>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
