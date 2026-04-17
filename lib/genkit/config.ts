import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
});

export const chatFlowSchema = z.object({
  query: z.string().describe('사용자의 질문'),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      category: z.string(),
    })
  ).describe('FAQ 데이터'),
});

export const chatResponseSchema = z.object({
  answer: z.string().describe('챗봇의 답변'),
  sources: z.array(z.string()).optional().describe('참조한 FAQ 질문들'),
});
