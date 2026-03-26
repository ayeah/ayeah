'use client';

import { motion } from 'framer-motion';
import { BookOpen, Heart, Zap, Globe, Code, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-slate-900" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              关于虾大师
            </h1>
            <p className="text-xl text-slate-400">
              一个专注于 AI 智能体技术的博客
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <div className="bg-slate-800/50 rounded-2xl p-8 md:p-12 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-purple-400" />
                本站简介
              </h2>
              
              <p className="text-slate-300 leading-relaxed mb-6">
                虾大师是一个专注于<strong className="text-purple-400">AI 智能体（AI Agent）</strong>技术分享与实践的技术博客。在这里，我们记录数字化转型路上的技术探索、实战经验和深度思考。
              </p>

              <p className="text-slate-300 leading-relaxed mb-6">
                随着人工智能技术的飞速发展，AI Agent 正在成为连接人类与数字世界的桥梁。从 OpenClaw 这样的开源框架，到各种智能体应用场景，我们致力于分享最前沿的技术动态、最实用的开发技巧，以及最真实的项目经验。
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-3 text-cyan-400" />
                内容方向
              </h2>

              <p className="text-slate-300 leading-relaxed mb-6">
                <strong className="text-purple-400">OpenClaw 技术栈</strong> - 作为本站的核心关注点，我们深入探讨 OpenClaw 框架的各个方面。从基础概念到高级应用，从技能开发到智能体编排，提供完整的学习路径和实战指南。无论是初学者还是有经验的开发者，都能在这里找到有价值的内容。
              </p>

              <p className="text-slate-300 leading-relaxed mb-6">
                <strong className="text-cyan-400">AI 智能体开发</strong> - 分享 AI Agent 的架构设计、开发流程和最佳实践。涵盖任务规划、工具使用、记忆管理、多智能体协作等核心主题。通过实际案例，展示如何构建实用、可靠的智能体系统。
              </p>

              <p className="text-slate-300 leading-relaxed mb-6">
                <strong className="text-green-400">技能与工具</strong> - 介绍各种 AI 技能的开发方法，包括 Web 搜索、文档处理、消息推送、数据管理等实用功能。同时分享开发过程中使用的工具和技巧，提高开发效率。
              </p>

              <p className="text-slate-300 leading-relaxed mb-6">
                <strong className="text-orange-400">AI 前沿资讯</strong> - 追踪人工智能领域的最新动态，包括技术突破、产品发布、行业趋势等。帮助读者保持对前沿技术的敏感度，把握发展方向。
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center">
                <Code className="w-6 h-6 mr-3 text-green-400" />
                技术栈
              </h2>

              <p className="text-slate-300 leading-relaxed mb-6">
                本站采用现代化的技术栈构建，确保良好的用户体验和可维护性：
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start text-slate-300">
                  <span className="text-purple-400 mr-3">▸</span>
                  <span><strong className="text-white">Next.js 16</strong> - 基于 React 的现代化 Web 框架，提供优秀的性能和开发体验</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-cyan-400 mr-3">▸</span>
                  <span><strong className="text-white">TypeScript</strong> - 类型安全的 JavaScript 超集，提高代码质量和可维护性</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-green-400 mr-3">▸</span>
                  <span><strong className="text-white">Tailwind CSS</strong> - 实用优先的 CSS 框架，快速构建现代化界面</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-orange-400 mr-3">▸</span>
                  <span><strong className="text-white">GitHub Pages</strong> - 免费、可靠的静态网站托管服务</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-pink-400 mr-3">▸</span>
                  <span><strong className="text-white">Framer Motion</strong> - 流畅的动画库，提升用户体验</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-pink-400" />
                关于我们
              </h2>

              <p className="text-slate-300 leading-relaxed mb-6">
                虾大师由一群热爱 AI 技术的开发者创建和维护。我们相信，技术的价值在于分享和应用。通过博客这个平台，我们希望：
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start text-slate-300">
                  <span className="text-purple-400 mr-3">✓</span>
                  <span>帮助开发者快速入门 AI Agent 开发</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-cyan-400 mr-3">✓</span>
                  <span>分享实战经验，避免常见陷阱</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>建立技术交流社区，促进知识共享</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-orange-400 mr-3">✓</span>
                  <span>推动 OpenClaw 等开源项目的发展</span>
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-blue-400" />
                联系我们
              </h2>

              <p className="text-slate-300 leading-relaxed mb-6">
                我们欢迎各种形式的交流和合作。如果您有任何问题、建议或想法，欢迎通过以下方式联系我们：
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <a
                  href="https://github.com/ayeah/ayeah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Code className="w-5 h-5 mr-2" />
                  GitHub
                </a>
                <Link
                  href="/blog2016/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-lg transition-all"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  浏览博客
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-slate-400 text-center italic flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Made with love by 虾小弟
                  <Heart className="w-5 h-5 ml-2 text-red-500" />
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
