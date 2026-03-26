'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Code, 
  ArrowRight, 
  TrendingUp,
  Globe,
  Rocket,
  ChevronRight,
  TerminalSquare,
  Layers,
  Cpu,
  Network,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

const features = [
  {
    icon: Zap,
    title: 'OpenClaw',
    description: '探索 OpenClaw 智能体框架的无限可能，从入门到精通的完整指南',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    href: '/tag/openclaw',
    color: '#8b5cf6',
  },
  {
    icon: Brain,
    title: 'AI 智能体',
    description: '深入解析 AI Agent 架构设计、开发实践与前沿应用案例',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    href: '/tag/agents',
    color: '#06b6d4',
  },
  {
    icon: Code,
    title: '技能开发',
    description: '分享实用的 AI 技能开发技巧、工具使用和最佳实践',
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    href: '/tag/skills',
    color: '#10b981',
  },
  {
    icon: TerminalSquare,
    title: '自动化',
    description: '构建智能自动化工作流，提升效率的实战技巧与工具链',
    gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    href: '/tag/automation',
    color: '#f59e0b',
  },
  {
    icon: Globe,
    title: 'AI 资源',
    description: '精选 AI 工具、框架、数据集等优质资源推荐',
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    href: '/tag/resources',
    color: '#ec4899',
  },
  {
    icon: TrendingUp,
    title: 'AI 前沿',
    description: '追踪 AI 领域最新动态、技术突破和行业资讯',
    gradient: 'from-blue-400 via-indigo-500 to-purple-500',
    href: '/tag/news',
    color: '#3b82f6',
  },
];

const stats = [
  { value: '100+', label: '技术文章' },
  { value: '50+', label: '实战案例' },
  { value: '10+', label: '开源项目' },
  { value: '24/7', label: '持续更新' },
];

const codeLines = [
  { text: 'import { OpenClaw } from "@openclaw/core"', highlight: true },
  { text: '', highlight: false },
  { text: '// 初始化智能体', highlight: false },
  { text: 'const agent = new OpenClaw({', highlight: true },
  { text: '  model: "qwen3.5-plus",', highlight: false },
  { text: '  skills: ["web-search", "browser"],', highlight: true },
  { text: '  memory: "lancedb"', highlight: false },
  { text: '})', highlight: true },
  { text: '', highlight: false },
  { text: 'await agent.run("分析今日 AI 动态")', highlight: true },
];

// 等距网格背景组件
function IsometricGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 主网格 */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #808080 1px, transparent 1px),
            linear-gradient(to bottom, #808080 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* 对角线网格 */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #808080 1px, transparent 1px),
            linear-gradient(-45deg, #808080 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
}

// 聚光灯效果组件
function Spotlight() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-30"
      style={
        {
          '--x': `${springX.get()}px`,
          '--y': `${springY.get()}px`,
          background: 'radial-gradient(600px circle at var(--x) var(--y), rgba(139,92,246,0.06), transparent 40%)',
        } as React.CSSProperties
      }
    />
  );
}

// 导航栏
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              虾大师
            </span>
          </Link>
          
          <div className="flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-white hover:text-white hover:bg-white/5 rounded-lg transition-all">
              主页
            </Link>
            <Link href="/tag/openclaw" className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              OpenClaw
            </Link>
            <Link href="/tag/agents" className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              智能体
            </Link>
            <Link href="/tag/skills" className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              技能
            </Link>
            <Link href="/about" className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
              关于
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// 英雄区域
function HeroSection() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, 50]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* 渐变光晕 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-500/15 via-fuchsia-500/10 to-transparent rounded-full blur-3xl" />
      
      {/* 右上角装饰 */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      
      {/* 左下角装饰 */}
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />

      <motion.div 
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 左侧内容 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 标签 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI 智能体技术博客</span>
            </motion.div>

            {/* 标题 */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1]"
            >
              构建下一代
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  AI 智能体
                </span>
                <motion.div 
                  className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            </motion.h1>

            {/* 描述 */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl"
            >
              专注于 OpenClaw 框架、AI Agent 架构、自动化工作流等前沿技术，
              记录数字化转型路上的技术探索与实战经验
            </motion.p>

            {/* CTA 按钮 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/tag/openclaw"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <span>开始探索</span>
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                了解更多
              </Link>
            </motion.div>

            {/* 数据统计 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/5"
            >
              {stats.map((stat, index) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* 右侧代码预览 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="relative group">
              {/* 外发光 */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              {/* 代码卡片 */}
              <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {/* 顶部栏 */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono">agent.ts</div>
                  <div className="w-10" />
                </div>
                
                {/* 代码内容 */}
                <div className="p-6 font-mono text-sm leading-relaxed">
                  {codeLines.map((line, index) => (
                    <div 
                      key={index}
                      className={`transition-all duration-300 ${
                        line.highlight 
                          ? 'text-violet-400' 
                          : 'text-slate-500'
                      }`}
                    >
                      <span className="text-slate-700 select-none mr-4">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {line.text}
                    </div>
                  ))}
                  
                  {/* 光标动画 */}
                  <motion.div
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block w-2 h-5 bg-violet-400 rounded-sm mt-2"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// 功能卡片
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Link href={feature.href}>
        <div className="group relative p-6 bg-[#0a0a0a]/50 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden">
          {/* 悬停渐变 */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
          
          {/* 顶部边框渐变 */}
          <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          <div className="relative">
            {/* 图标 */}
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5`}>
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            
            {/* 标题 */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
              {feature.title}
            </h3>
            
            {/* 描述 */}
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {feature.description}
            </p>
            
            {/* 链接 */}
            <div className="flex items-center text-violet-400 text-sm font-medium">
              <span>查看详情</span>
              <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// 功能区域
function FeaturesSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
            <Layers className="w-4 h-4" />
            <span>内容分类</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            探索<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">内容</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            涵盖 AI 智能体、OpenClaw 框架、技能开发等前沿技术领域
          </p>
        </motion.div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA 区域
function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 via-fuchsia-950/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1),transparent_70%)]" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Rocket className="w-16 h-16 text-violet-400 mx-auto mb-8" />
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            准备好开始<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">探索</span>了吗？
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            浏览我们的博客，发现更多 AI 智能体技术的精彩内容和实战经验
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tag/openclaw"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-violet-900 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <span>浏览博客</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              关于本站
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 页脚
function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">虾大师</span>
          </div>
          
          <p className="text-slate-500 text-sm flex items-center space-x-2">
            <span>Made with</span>
            <span className="text-red-500">❤</span>
            <span>by 虾小弟</span>
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 虾大师。All rights reserved.
            </p>
            <a 
              href="https://beian.miit.gov.cn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-violet-400 text-sm transition-colors"
            >
              粤 ICP 备 08004221 号
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// 主页面组件
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景网格 */}
      <IsometricGrid />
      
      {/* 聚光灯效果 */}
      <Spotlight />
      
      {/* 导航栏 */}
      <Navbar />
      
      {/* 英雄区域 */}
      <HeroSection />
      
      {/* 功能区域 */}
      <FeaturesSection />
      
      {/* CTA 区域 */}
      <CTASection />
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
}
