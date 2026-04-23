import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ScheduleProgram, UpdateProgramRequest } from '@/lib/schedule-types';

const DATA_DIR = path.join(process.cwd(), 'data', 'schedule');

function getDataFilePath(campId: string) {
  return path.join(DATA_DIR, `${campId}-programs.json`);
}

// 개별 프로그램 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const campId = searchParams.get('campId') || 'je';
    
    const filePath = getDataFilePath(campId);
    const data = await fs.readFile(filePath, 'utf-8');
    const programs: ScheduleProgram[] = JSON.parse(data);
    
    const program = programs.find(p => p.id === id);
    
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(program);
  } catch (error) {
    console.error('Schedule GET by ID 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 프로그램 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateProgramRequest = await request.json();
    const campId = body.campId || 'je';
    
    const filePath = getDataFilePath(campId);
    const data = await fs.readFile(filePath, 'utf-8');
    const programs: ScheduleProgram[] = JSON.parse(data);
    
    const index = programs.findIndex(p => p.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    // 프로그램 업데이트
    programs[index] = {
      ...programs[index],
      ...body,
      updatedAt: new Date()
    };
    
    await fs.writeFile(filePath, JSON.stringify(programs, null, 2));
    
    return NextResponse.json(programs[index]);
  } catch (error) {
    console.error('Schedule PUT 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 프로그램 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const campId = searchParams.get('campId') || 'je';
    
    const filePath = getDataFilePath(campId);
    const data = await fs.readFile(filePath, 'utf-8');
    let programs: ScheduleProgram[] = JSON.parse(data);
    
    const initialLength = programs.length;
    programs = programs.filter(p => p.id !== id);
    
    if (programs.length === initialLength) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }
    
    await fs.writeFile(filePath, JSON.stringify(programs, null, 2));
    
    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Schedule DELETE 오류:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}