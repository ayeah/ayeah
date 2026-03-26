'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WechatDraft {
  media_id: string;
  title: string;
  author: string;
  update_time: number;
  content?: string;
}

export default function WechatPage() {
  const [drafts, setDrafts] = useState<WechatDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchDrafts();
  }, []);

  async function fetchDrafts() {
    try {
      setLoading(true);
      const res = await fetch('/api/wechat?offset=0&count=20');
      const data = await res.json();

      if (data.success) {
        setDrafts(data.data.drafts || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('获取草稿列表失败');
    } finally {
      setLoading(false);
    }
  }

  async function syncToWechat(articleId: string) {
    if (!confirm('确定要同步这篇文章到微信公众号吗？')) return;

    try {
      setSyncing(true);
      // TODO: 实现文章同步逻辑
      alert('同步功能开发中...');
    } catch (err) {
      alert('同步失败');
    } finally {
      setSyncing(false);
    }
  }

  async function deleteDraft(mediaId: string) {
    if (!confirm('确定要删除这个草稿吗？')) return;

    try {
      const res = await fetch(`/api/wechat?mediaId=${mediaId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setDrafts(drafts.filter(d => d.media_id !== mediaId));
        alert('删除成功');
      } else {
        alert('删除失败：' + data.error);
      }
    } catch (err) {
      alert('删除失败');
    }
  }

  function formatTime(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleString('zh-CN');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">📱 微信公众号管理</h1>
            <Link
              href="/articles"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
            >
              从文章创建
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/" className="py-4 px-1 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700">
              仪表盘
            </Link>
            <Link href="/articles" className="py-4 px-1 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700">
              文章列表
            </Link>
            <Link href="/wechat" className="py-4 px-1 border-b-2 border-green-500 text-green-600 font-medium">
              微信公众号
            </Link>
            <Link href="/settings" className="py-4 px-1 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700">
              设置
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">草稿箱数量</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{drafts.length}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">API 状态</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">✅</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">最后同步</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-600">
                {drafts.length > 0 ? formatTime(drafts[0].update_time) : '暂无'}
              </dd>
            </div>
          </div>
        </div>

        {/* Drafts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
            <p className="mt-2 text-sm">请检查微信公众号配置是否正确</p>
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">暂无草稿</p>
            <Link href="/articles" className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium">
              创建第一篇草稿 →
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">草稿列表</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {drafts.map((draft) => (
                <li key={draft.media_id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-green-600 truncate">
                          📝 {draft.title}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>✍️ {draft.author || '未知'}</span>
                          <span>🕐 {formatTime(draft.update_time)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={`https://mp.weixin.qq.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          预览
                        </a>
                        <button
                          onClick={() => deleteDraft(draft.media_id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Help */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-blue-800 font-medium mb-2">💡 使用指南</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• 在"文章列表"中选择文章，点击"同步到公众号"创建草稿</li>
            <li>• 草稿会自动保存到微信公众号后台</li>
            <li>• 可以在微信公众后台进一步编辑和发布</li>
            <li>• 需要配置 WECHAT_APPID 和 WECHAT_SECRET</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
