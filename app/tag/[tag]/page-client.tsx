'use client';

import { motion } from 'framer-motion';
import { Tag, ArrowLeft, FileText, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface TagPageClientProps {
  tag: string;
}

const tagInfo: Record<string, { title: string; description: string; color: string }> = {
  openclaw: {
    title: 'OpenClaw',
    description: '探索 OpenClaw 智能体框架的无限可能，从入门到精通的完整指南',
    color: 'from-purple-500 to-pink-500',
  },
  agents: {
    title: 'AI 智能体',
    description: '深入解析 AI Agent 架构设计、开发实践与前沿应用案例',
    color: 'from-cyan-500 to-blue-500',
  },
  skills: {
    title: '技能开发',
    description: '分享实用的 AI 技能开发技巧、工具使用和最佳实践',
    color: 'from-green-500 to-emerald-500',
  },
  resources: {
    title: '资源分享',
    description: '精选 AI 开发相关工具、文档、教程等实用资源',
    color: 'from-yellow-500 to-orange-500',
  },
  news: {
    title: 'AI 前沿',
    description: '追踪 AI 领域最新动态、技术突破和行业资讯',
    color: 'from-red-500 to-pink-500',
  },
};

export function TagPageClient({ tag }: TagPageClientProps) {
  const info = tagInfo[tag] || {
    title: tag,
    description: `探索关于 ${tag} 的相关内容`,
    color: 'from-slate-500 to-gray-500',
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>返回首页</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full bg-gradient-to-r ${info.color}`}>
                <Tag className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{info.title}</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">{info.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">3</div><div className="text-slate-400 text-sm">精选文章</div></div>
            <div><div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">5+</div><div className="text-slate-400 text-sm">主题分类</div></div>
            <div><div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">100+</div><div className="text-slate-400 text-sm">技术要点</div></div>
            <div><div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">∞</div><div className="text-slate-400 text-sm">探索可能</div></div>
          </div>
        </div>
      </section>

      {/* Articles placeholder */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-slate-800/50 rounded-full border border-white/10">
            <FileText className="w-5 h-5 text-slate-400 mr-3" />
            <span className="text-slate-400">更多内容即将推出...</span>
          </div>
        </div>
      </section>
    </div>
  );
}