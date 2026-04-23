import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ScheduleProgram, CreateProgramRequest } from '@/lib/schedule-types';

// JSON 파일로 데이터 저장 (추후 DB 연동 가능)
const DATA_DIR = path.join(process.cwd(), 'data', 'schedule');

// 데이터 디렉토리 확인 및 생성
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// 프로그램 데이터 파일 경로
function getDataFilePath(campId: string) {
  return path.join(DATA_DIR, `${campId}-programs.json`);
}

// 프로그램 목록 조회
export async function GET(request: NextRequest) {
  try {
    await ensureDataDir();
    
    const { searchParams } = new URL(request.url);
    const campId = searchParams.get('campId') || 'je';
    const programType = searchParams.get('programType');
    
    const filePath = getDataFilePath(campId);
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      let programs: ScheduleProgram[] = JSON.parse(data);
      
      // 프로그램 타입으로 필터링
      if (programType) {
        programs = programs.filter(p => p.programType === programType);
      }
      
      // 순서대로 정렬
      programs.sort((a, b) => a.order - b.order);
      
      return NextResponse.json({
        programs,
        total: programs.length
      });
    } catch (fileError) {
      // 파일이 없으면 빈 배열 반환
      return NextResponse.json({
        programs: [],
        total: 0
      });
    }
  } catch (error) {
    console.error('Schedule API GET 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 새 프로그램 생성
export async function POST(request: NextRequest) {
  try {
    await ensureDataDir();
    
    const body: CreateProgramRequest = await request.json();
    const { campId, programType, timeSlot, title, description, content } = body;
    
    if (!campId || !programType || !timeSlot || !title) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }
    
    const filePath = getDataFilePath(campId);
    
    // 기존 데이터 로드
    let programs: ScheduleProgram[] = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      programs = JSON.parse(data);
    } catch {
      // 파일이 없으면 빈 배열로 시작
    }
    
    // 새 프로그램 생성
    const newProgram: ScheduleProgram = {
      id: `${campId}-${programType}-${Date.now()}`,
      campId,
      programType,
      timeSlot,
      title,
      description,
      content,
      images: [],
      isActive: true,
      order: programs.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    programs.push(newProgram);
    
    // 파일에 저장
    await fs.writeFile(filePath, JSON.stringify(programs, null, 2));
    
    return NextResponse.json(newProgram, { status: 201 });
  } catch (error) {
    console.error('Schedule API POST 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}