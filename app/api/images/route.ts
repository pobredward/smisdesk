import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campId = searchParams.get('campId');
    const section = searchParams.get('section');

    if (!campId || !section) {
      return NextResponse.json({ error: 'campId and section are required' }, { status: 400 });
    }

    // public 폴더의 이미지 디렉토리 경로
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'camps', campId, section);
    
    try {
      // 디렉토리 내 파일 목록 읽기
      const files = await fs.readdir(imagesDir);
      
      // PNG 파일만 필터링하고 전체 경로로 변환
      const pngFiles = files
        .filter(file => file.toLowerCase().endsWith('.png'))
        .map(file => `/images/camps/${campId}/${section}/${file}`);
      
      return NextResponse.json({ images: pngFiles });
    } catch (dirError) {
      // 디렉토리가 존재하지 않거나 읽을 수 없는 경우
      return NextResponse.json({ images: [] });
    }
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}