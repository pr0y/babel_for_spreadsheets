import { NextRequest, NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm';
import { buildAnalysisPrompt } from '@/lib/prompts';
import { AnalysisContext } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { headers, sampleRows } = await request.json();

    if (!headers || !sampleRows) {
      return NextResponse.json(
        { error: 'Missing headers or sampleRows' },
        { status: 400 }
      );
    }

    const prompt = buildAnalysisPrompt(headers, sampleRows);
    const response = await callLLM(prompt);

    // Parse the JSON response
    // Remove markdown code blocks if present
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const context: AnalysisContext = JSON.parse(cleanedResponse);

    return NextResponse.json(context);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
