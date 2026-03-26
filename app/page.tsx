'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, Code, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Zap,
    title: 'OpenClaw',
    description: '探索 OpenClaw 智能体框架的无限可能，从入门到精通的完整指南',
    color: 'from-purple-500 to-pink-500',
    href: '/tag/openclaw',
  },
  {
    icon: Brain,
    title: 'AI 智能体',
    description: '深入解析 AI Agent 架构设计、开发实践与前沿应用案例',
    color: 'from-cyan-500 to-blue-500',
    href: '/tag/agents',
  },
  {
    icon: Code,
    title: '技能开发',
    description: '分享实用的 AI 技能开发技巧、工具使用和最佳实践',
    color: 'from-green-500 to-emerald-500',
    href: '/tag/skills',
  },
  {
    icon: TrendingUp,
    title: 'AI 前沿',
    description: '追踪 AI 领域最新动态、技术突破和行业资讯',
    color: 'from-orange-500 to-red-500',
    href: '/tag/news',
  },
];

const stats = [
  { value: '100+', label: '技术文章' },
  { value: '50+', label: '实战案例' },
  { value: '10+', label: '开源项目' },
  { value: '∞', label: '探索可能' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-2xl opacity-50" />
                <div className="relative bg-gradient-to-r from-purple-500 to-cyan-500 p-6 rounded-full">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                虾大师
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
              AI 智能体技术分享与实践
            </p>

            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              专注于 OpenClaw、AI Agent、自动化等前沿技术，记录数字化转型路上的技术探索与实战经验
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog2016/"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span>探索博客</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <span>了解更多</span>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              探索精彩内容
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              涵盖 AI 智能体、OpenClaw 框架、技能开发等前沿技术领域
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.href}>
                  <div className="group relative p-8 bg-slate-800/50 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className="relative flex items-start space-x-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${feature.color}`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center text-purple-400 font-medium">
                          <span>查看详情</span>
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-900 to-cyan-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              准备好开始探索了吗？
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              浏览我们的博客，发现更多 AI 智能体技术的精彩 content
            </p>
            <Link
              href="/blog2016/"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-900 font-semibold rounded-full hover:bg-slate-100 transition-all duration-300 transform hover:scale-105"
            >
              <span>访问博客</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
