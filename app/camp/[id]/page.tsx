'use client';

import { use } from 'react';
import { LOCATIONS } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Calendar, Users, MapPin, Phone, Mail, Camera, Settings, Home, GraduationCap } from 'lucide-react';
import { notFound } from 'next/navigation';
import CampSection from '@/components/camp/CampSection';
import CampHeroCard from '@/components/camp/CampHeroCard';
import { getAllCampSections } from '@/lib/camp-content';

export default function CampDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const camp = LOCATIONS.find(loc => loc.id === id && loc.id !== 'common');

  if (!camp) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>SMIS 데스크로 돌아가기</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <CampHeroCard camp={camp} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Camp Sections */}
        <section className="space-y-12">
          {getAllCampSections(camp.id).map((section, index) => {
            const getIcon = () => {
              switch (section.id) {
                case 'overview':
                  return <BookOpen className="w-6 h-6 text-blue-600" />;
                case 'schedule':
                  return <Calendar className="w-6 h-6 text-green-600" />;
                case 'mentors':
                  return <GraduationCap className="w-6 h-6 text-purple-600" />;
                case 'management':
                  return <Settings className="w-6 h-6 text-red-600" />;
                case 'environment':
                  return <Home className="w-6 h-6 text-orange-600" />;
                case 'activities':
                  return <Camera className="w-6 h-6 text-yellow-600" />;
                default:
                  return <BookOpen className="w-6 h-6 text-blue-600" />;
              }
            };

            return (
              <CampSection
                key={section.id}
                id={section.id}
                title={section.title}
                description={section.description}
                icon={getIcon()}
                campId={camp.id}
                detailContent={section.detailContent}
                iconBgColor={section.iconBgColor}
              />
            );
          })}
        </section>

        {/* Contact Section */}
        <section className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">문의하기</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="tel:010-6711-7933"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all"
            >
              <Phone className="w-6 h-6" />
              <div>
                <div className="font-semibold">전화 문의</div>
                <div className="text-sm text-blue-100">010-6711-7933</div>
              </div>
            </a>
            <a
              href="mailto:camp@smis.co.kr"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 transition-all"
            >
              <Mail className="w-6 h-6" />
              <div>
                <div className="font-semibold">이메일 문의</div>
                <div className="text-sm text-blue-100">camp@smis.co.kr</div>
              </div>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            {/* 회사 정보 */}
            <div>
              <h3 className="text-white font-bold text-base mb-3">회사 정보</h3>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-white">회사명: (주)에스엠아이에스</p>
                <p>대표: 김선희</p>
                <p>법인사업자 등록번호: 427-88-03423</p>
                <p>주소: 경기 성남시 분당구 장미로 78 SMIS 312호</p>
                <p>
                  상담 문의: 신선웅{' '}
                  <a href="tel:010-6711-7933" className="hover:text-white transition-colors">
                    (010-6711-7933)
                  </a>
                </p>
              </div>
            </div>

            {/* 법률 문서 */}
            <div>
              <h3 className="text-white font-bold text-base mb-3">법률 문서</h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    서비스 이용약관
                  </Link>
                </li>
              </ul>
            </div>

            {/* 소셜 링크 */}
            <div>
              <h3 className="text-white font-bold text-base mb-3">소셜 링크</h3>
              <ul className="space-y-1 text-xs">
                <li>
                  <a 
                    href="https://www.youtube.com/@smiscamp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>유튜브 채널</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://pf.kakao.com/_Axafxcb/chat" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>카카오톡 채널</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.smisedu.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>공식 홈페이지</span>
                    <span className="text-xs">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-xs border-t border-gray-800 pt-6">
            <p>&copy; {new Date().getFullYear()} (주)에스엠아이에스. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
