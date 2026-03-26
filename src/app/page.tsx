import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">虾</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                虾大师
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm text-white hover:text-violet-400 transition-colors">
                主页
              </Link>
              <Link href="/tag/openclaw" className="text-sm text-zinc-400 hover:text-violet-400 transition-colors">
                OpenClaw
              </Link>
              <Link href="/tag/agents" className="text-sm text-zinc-400 hover:text-violet-400 transition-colors">
                智能体
              </Link>
              <Link href="/tag/skills" className="text-sm text-zinc-400 hover:text-violet-400 transition-colors">
                技能
              </Link>
              <Link href="/about" className="text-sm text-zinc-400 hover:text-violet-400 transition-colors">
                关于
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="pt-16">
        {/* Hero 区域 */}
        <section className="relative py-32 overflow-hidden">
          {/* 背景渐变 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-violet-500/20 via-fuchsia-500/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
                <span>🦐</span>
                <span className="ml-2">AI 智能体技术博客</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                构建下一代
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  AI 智能体
                </span>
              </h1>
              
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                专注于 OpenClaw 框架、AI Agent 架构、自动化工作流等前沿技术，
                记录数字化转型路上的技术探索与实战经验
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/tag/openclaw"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  开始探索
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  了解更多
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 内容分类 */}
        <section className="py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                内容分类
              </h2>
              <p className="text-zinc-400">
                涵盖 AI 智能体、OpenClaw 框架、技能开发等前沿技术领域
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* OpenClaw */}
              <Link href="/tag/openclaw" className="group p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-violet-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
                  OpenClaw
                </h3>
                <p className="text-zinc-400 text-sm">
                  探索 OpenClaw 智能体框架的无限可能，从入门到精通的完整指南
                </p>
              </Link>

              {/* AI 智能体 */}
              <Link href="/tag/agents" className="group p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-cyan-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  AI 智能体
                </h3>
                <p className="text-zinc-400 text-sm">
                  深入解析 AI Agent 架构设计、开发实践与前沿应用案例
                </p>
              </Link>

              {/* 技能开发 */}
              <Link href="/tag/skills" className="group p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  技能开发
                </h3>
                <p className="text-zinc-400 text-sm">
                  分享实用的 AI 技能开发技巧、工具使用和最佳实践
                </p>
              </Link>

              {/* 自动化 */}
              <Link href="/tag/automation" className="group p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-orange-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  自动化
                </h3>
                <p className="text-zinc-400 text-sm">
                  构建智能自动化工作流，提升效率的实战技巧与工具链
                </p>
              </Link>

              {/* AI 资源 */}
              <Link href="/tag/resources" className="group p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-pink-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                  AI 资源
                </h3>
                <p className="text-zinc-400 text-sm">
                  精选 AI 工具、框架、数据集等优质资源推荐
                </p>
              </Link>

              {/* AI 前沿 */}
              <Link href="/tag/news" className="group p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  AI 前沿
                </h3>
                <p className="text-zinc-400 text-sm">
                  追踪 AI 领域最新动态、技术突破和行业资讯
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* 页脚 */}
        <footer className="border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">虾</span>
                </div>
                <span className="text-lg font-bold text-white">虾大师</span>
              </div>
              
              <p className="text-zinc-500 text-sm flex items-center space-x-2">
                <span>Made with</span>
                <span className="text-red-500">❤</span>
                <span>by 虾小弟</span>
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <p className="text-zinc-500 text-sm">
                  © 2026 虾大师。All rights reserved.
                </p>
                <a 
                  href="https://beian.miit.gov.cn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-violet-400 text-sm transition-colors"
                >
                  粤 ICP 备 08004221 号
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
