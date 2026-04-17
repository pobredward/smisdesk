'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video, FolderTree, Users, MessageSquare, LogOut, ExternalLink } from 'lucide-react';
import { useClients } from '@/lib/hooks/useClients';

export default function AdminDashboard() {
  const router = useRouter();
  const { clients, loading } = useClients();

  const handleLogout = () => {
    sessionStorage.removeItem('admin');
    localStorage.removeItem('admin_auth');
    router.push('/');
  };

  const menuItems = [
    {
      title: 'FAQ 관리',
      icon: MessageSquare,
      href: '/admin/faqs',
      iconColor: 'text-blue-600',
    },
    {
      title: '카테고리 관리',
      icon: FolderTree,
      href: '/admin/categories',
      iconColor: 'text-purple-600',
    },
    {
      title: '거래처 관리',
      icon: Users,
      href: '/admin/clients',
      iconColor: 'text-orange-600',
    },
    {
      title: '영상 설정',
      icon: Video,
      href: '/admin/video',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <h1 className="text-lg font-bold text-gray-900">관리자 대시보드</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col items-center justify-center gap-3 hover:border-gray-300"
            >
              <item.icon className={`w-8 h-8 ${item.iconColor}`} />
              <span className="text-sm font-medium text-gray-700 text-center">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* 거래처 페이지 바로가기 */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-base font-semibold text-gray-900">거래처 페이지</h2>
          </div>
          
          {loading ? (
            <div className="text-sm text-gray-500 py-4">로딩 중...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {clients
                .filter(c => c.clientId !== 'common')
                .map((client) => (
                  <Link
                    key={client.id}
                    href={`/${client.clientId}`}
                    target="_blank"
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-orange-300 transition-all duration-200 hover:shadow-lg overflow-hidden"
                  >
                    <div className="p-5 flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <Users className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                          {client.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">/{client.clientId}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-orange-600 transition-colors">
                        <span>페이지 보기</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
          
          {!loading && clients.filter(c => c.clientId !== 'common').length === 0 && (
            <p className="text-sm text-gray-500 py-4">등록된 거래처가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
