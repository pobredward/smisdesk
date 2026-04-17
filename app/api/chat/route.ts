import { NextRequest, NextResponse } from 'next/server';
import { chatFlow } from '@/lib/genkit/flows';

export async function POST(req: NextRequest) {
  try {
    const { query, faqs } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: '질문을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!faqs || !Array.isArray(faqs)) {
      return NextResponse.json(
        { error: 'FAQ 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    const result = await chatFlow({ query, faqs });

    return NextResponse.json({
      answer: result.answer,
      sources: result.sources || [],
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}
