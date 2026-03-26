'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  type: 'published' | 'draft';
  file: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  async function fetchArticles() {
    try {
      setLoading(true);
      const res = await fetch(`/api/articles?type=${filter}`);
      const data = await res.json();
      
      if (data.success) {
        setArticles(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm('确定要删除这篇文章吗？')) return;
    
    try {
      const res = await fetch(`/api/articles?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        alert('删除失败：' + data.error);
      }
    } catch (err) {
      alert('删除失败');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">🦐 虾大师文章管理</h1>
            <Link
              href="/articles/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              新建文章
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
            <Link href="/articles" className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
              文章列表
            </Link>
            <Link href="/materials" className="py-4 px-1 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700">
              素材库
            </Link>
            <Link href="/settings" className="py-4 px-1 border-b-2 border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700">
              设置
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              全部 ({articles.filter(a => true).length})
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'published'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              已发布 ({articles.filter(a => a.type === 'published').length})
            </button>
            <button
              onClick={() => setFilter('drafts')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'drafts'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              草稿 ({articles.filter(a => a.type === 'draft').length})
            </button>
          </div>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">暂无文章</p>
            <Link href="/articles/new" className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium">
              创建第一篇文章 →
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {articles.map((article) => (
                <li key={article.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.type === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.type === 'published' ? '已发布' : '草稿'}
                          </span>
                          <p className="text-lg font-medium text-blue-600 truncate">
                            {article.title}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {article.date || '未设置日期'}</span>
                          <span>📁 {article.category || '未分类'}</span>
                          {article.tags?.length > 0 && (
                            <span className="flex items-center space-x-1">
                              <span>🏷️</span>
                              {article.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-gray-400">#{tag}</span>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/articles/${article.id}/edit`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => deleteArticle(article.id)}
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
      </main>
    </div>
  );
}
