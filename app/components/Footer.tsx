'use client';

import Link from 'next/link';
import { Shrimp, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-full">
                <Shrimp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">虾大师</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              专注于 AI 智能体技术分享与实践，记录数字化转型路上的点点滴滴。
              分享 OpenClaw、AI Agent、自动化等前沿技术的实战经验。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tag/openclaw" className="text-slate-400 hover:text-white text-sm transition-colors">
                  OpenClaw
                </Link>
              </li>
              <li>
                <Link href="/tag/agents" className="text-slate-400 hover:text-white text-sm transition-colors">
                  智能体
                </Link>
              </li>
              <li>
                <Link href="/tag/skills" className="text-slate-400 hover:text-white text-sm transition-colors">
                  技能
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white text-sm transition-colors">
                  关于
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">关注我们</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/ayeah/ayeah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white text-sm transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </li>
              <li className="text-slate-400 text-sm flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Powered by GitHub Pages</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} 虾大师。All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center space-x-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>by 虾小弟</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
