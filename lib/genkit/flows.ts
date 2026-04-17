import { ai, chatFlowSchema, chatResponseSchema } from './config';
import { googleAI } from '@genkit-ai/google-genai';

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: chatFlowSchema,
    outputSchema: chatResponseSchema,
  },
  async ({ query, faqs }) => {
    if (faqs.length === 0) {
      return {
        answer: '죄송합니다. 현재 FAQ 데이터가 없습니다. 관리자에게 문의해주세요.',
        sources: [],
      };
    }

    const queryLower = query.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/);

    // 질문에서 카테고리 키워드 추출
    const categoryKeywords: Record<string, string[]> = {
      '등록': ['등록', '모집', '신청', '학년', '성별'],
      '프로그램(수업)': ['수업', '원어민', '교재', '레벨', '패턴', '인문학', 'STEAM', '멘토링'],
      '야외활동': ['액티비티', '박물관', '런닝맨', '바운스', '체육'],
      '반배정': ['반', '배정', '편성', '룸메이트', '레벨테스트'],
      '환자': ['병원', '약', '주사', '아프', '치료'],
      '원어민 선생님': ['원어민', '선생님', '채용', '교육'],
      '멘토 선생님': ['멘토', '한국인', '선생님'],
      '생활&숙소': ['방', '숙소', '룸메', '청소', '세탁', '드림렌즈'],
      '식단': ['식사', '음식', '밥', '식단', '뷔페'],
    };

    // 질문에서 언급된 카테고리 찾기
    let queryCategoryHint: string | null = null;
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        queryCategoryHint = category;
        break;
      }
    }

    // FAQ를 청크로 분할하여 처리 (장문 텍스트 대응)
    const processedFaqs = faqs.flatMap((faq) => {
      const answerLength = faq.answer.length;
      
      // 답변이 500자 이상이면 청크로 분할
      if (answerLength > 500) {
        const chunks: typeof faqs = [];
        const sentences = faq.answer.split(/\.\s+/);
        let currentChunk = '';
        
        sentences.forEach((sentence, idx) => {
          if (currentChunk.length + sentence.length > 500 && currentChunk) {
            chunks.push({
              question: faq.question,
              answer: currentChunk.trim() + '.',
              category: faq.category,
            });
            currentChunk = sentence;
          } else {
            currentChunk += (currentChunk ? '. ' : '') + sentence;
          }
          
          // 마지막 문장 처리
          if (idx === sentences.length - 1 && currentChunk) {
            chunks.push({
              question: faq.question,
              answer: currentChunk.trim(),
              category: faq.category,
            });
          }
        });
        
        return chunks.length > 0 ? chunks : [faq];
      }
      
      return [faq];
    });

    const scoredFaqs = processedFaqs.map((faq) => {
      const questionLower = faq.question.toLowerCase();
      const answerLower = faq.answer.toLowerCase();

      let score = 0;

      // 카테고리 매칭 보너스
      if (queryCategoryHint && faq.category === queryCategoryHint) {
        score += 30;
      }

      // 완전 일치
      if (questionLower.includes(queryLower)) {
        score += 100;
      }

      if (answerLower.includes(queryLower)) {
        score += 50;
      }

      // 부분 일치
      queryWords.forEach((word) => {
        if (word.length < 2) return;
        if (questionLower.includes(word)) score += 10;
        if (answerLower.includes(word)) score += 5;
      });

      // 주요 키워드 가중치
      const importantKeywords = ['인원', '용돈', '휴대폰', '통화', '간식', '액티비티', '적응', '반', '수업', '선생님', '병원'];
      importantKeywords.forEach((keyword) => {
        if (queryLower.includes(keyword) && 
            (questionLower.includes(keyword) || answerLower.includes(keyword))) {
          score += 15;
        }
      });

      return { faq, score };
    });

    const relevantFaqs = scoredFaqs
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // 상위 5개로 증가 (장문 대응)
      .map((item) => item.faq);

    if (relevantFaqs.length === 0) {
      return {
        answer: '죄송합니다. 질문하신 내용과 관련된 FAQ를 찾지 못했습니다. 다른 방식으로 질문해주시거나, 캠프 담당자(camp@smis.co.kr)에게 문의해주세요.',
        sources: [],
      };
    }

    const context = relevantFaqs
      .map(
        (faq, idx) =>
          `[관련정보 ${idx + 1}]\n질문: ${faq.question}\n내용: ${faq.answer}`
      )
      .join('\n\n');

    const prompt = `당신은 SMIS 제주 여름캠프의 친절한 안내 챗봇입니다.

다음 관련 정보를 참고하여 사용자의 질문에 답변하세요.

${context}

[사용자 질문]
${query}

답변 규칙:
1. 제공된 정보를 기반으로 정확하게 답변하세요.
2. 여러 정보가 있다면 종합하여 완전한 답변을 만드세요.
3. 자연스럽고 친절한 한국어로 작성하세요.
4. 답변은 2-3 문단으로 구성하세요.
5. 정보에 없는 내용은 추측하지 말고, "정확한 정보는 캠프 담당자에게 문의해주세요"라고 안내하세요.
6. 부모님이나 보호자를 대상으로 답변한다고 생각하고, 정중하고 자세하게 설명하세요.`;

    try {
      const response = await ai.generate({
        model: googleAI.model('gemini-2.5-flash'),
        prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      // 중복 제거된 출처 반환
      const uniqueSources = [...new Set(relevantFaqs.map((faq) => faq.question))];

      return {
        answer: response.text,
        sources: uniqueSources,
      };
    } catch (error) {
      console.error('Genkit generation error:', error);
      
      return {
        answer: relevantFaqs[0].answer,
        sources: [relevantFaqs[0].question],
      };
    }
  }
);
