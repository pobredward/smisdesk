/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 16.x 기본 설정
  // Webpack을 기본으로 사용 (Vercel 배포 호환성)
  images: {
    qualities: [75, 85, 90],
  },
}

module.exports = nextConfig