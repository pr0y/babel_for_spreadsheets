import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { buildTranslationPrompt } from '@/lib/prompts';
import { AnalysisContext } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { 
      batch, 
      headers, 
      columnsToTranslate, 
      context, 
      sourceLang, 
      targetLang 
    } = await request.json();

    if (!batch || !headers || !columnsToTranslate || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = buildTranslationPrompt(
      context as AnalysisContext | null,
      headers,
      batch,
      columnsToTranslate,
      sourceLang,
      targetLang
    );

    const response = await callLLM(prompt);

    // Parse the JSON response
    // Remove markdown code blocks if present
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const translatedBatch: string[][] = JSON.parse(cleanedResponse);

    // Validate the response
    if (!Array.isArray(translatedBatch) || translatedBatch.length !== batch.length) {
      throw new Error('Invalid translation response format');
    }

    return NextResponse.json({ translatedBatch });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate batch', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
