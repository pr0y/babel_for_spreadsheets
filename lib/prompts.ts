import { AnalysisContext } from './types';

export function buildAnalysisPrompt(
  headers: string[],
  sampleRows: string[][]
): string {
  return `Analyze this spreadsheet data to help with translation.

## Column Headers
${JSON.stringify(headers)}

## Sample Rows (first ${sampleRows.length} rows)
${JSON.stringify(sampleRows)}

## Task
Provide a JSON response with:
{
  "domain": "brief description of what this data is about",
  "style": "the writing style used (formal, casual, technical, etc.)",
  "preserveTerms": ["list", "of", "terms", "to", "keep", "unchanged"],
  "notes": "any other translation considerations"
}

Respond with ONLY the JSON object, no markdown formatting.`;
}

export function buildTranslationPrompt(
  context: AnalysisContext | null,
  headers: string[],
  batch: string[][],
  columnsToTranslate: number[],
  sourceLang: string,
  targetLang: string
): string {
  const sourceDisplay = sourceLang === 'auto' ? 'the source language' : sourceLang;
  
  // Build context section
  let contextSection = '';
  if (context) {
    contextSection = `## Context
Domain: ${context.domain}
Style: ${context.style}
Keep unchanged: ${context.preserveTerms.join(', ')}
Notes: ${context.notes}

`;
  }

  // Build column info
  const columnInfo = headers
    .map((header, idx) => 
      columnsToTranslate.includes(idx) 
        ? `  ${idx}: "${header}" [TRANSLATE]`
        : `  ${idx}: "${header}" [KEEP AS-IS]`
    )
    .join('\n');

  return `Translate spreadsheet data from ${sourceDisplay} to ${targetLang}.

${contextSection}## Column Structure
${columnInfo}

## Data to Translate (${batch.length} rows)
${JSON.stringify(batch)}

## Instructions
1. Translate ONLY the values in columns with [TRANSLATE] markers
2. Keep all other columns exactly as-is (no modifications)
3. Preserve numbers, dates, codes, and terms marked as "keep unchanged" 
4. Maintain the exact array structure (same number of rows and columns)
5. Each translated row must be a valid array with the same column count

Respond with ONLY a JSON array of arrays (same structure as input), no markdown formatting or explanation.`;
}
