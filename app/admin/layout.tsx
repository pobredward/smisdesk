'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // 개발 단계에서는 자동 로그인
    if (process.env.NODE_ENV === 'development') {
      sessionStorage.setItem('admin', 'true');
    } else {
      // 프로덕션에서만 인증 체크
      const isAdmin = sessionStorage.getItem('admin');
      if (!isAdmin) {
        router.push('/');
      }
    }
  }, [router]);

  return <>{children}</>;
}
