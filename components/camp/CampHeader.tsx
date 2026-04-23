'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CampHeaderProps {
  clientId: string;
}

export default function CampHeader({ clientId }: CampHeaderProps) {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link 
          href={`/${clientId}`} 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>SMIS 데스크로 돌아가기</span>
        </Link>
      </div>
    </nav>
  );
}