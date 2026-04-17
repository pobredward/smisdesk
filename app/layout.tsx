import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMIS 데스크 - SMIS 캠프 종합 정보 포털",
  description: "SMIS 제주캠프, 싱가포르&말레이시아 주니어캠프, 말레이시아 가족캠프의 모든 정보를 한곳에서 확인하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
