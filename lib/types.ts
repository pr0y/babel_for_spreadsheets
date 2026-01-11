export interface AnalysisContext {
  domain: string;
  style: string;
  preserveTerms: string[];
  notes: string;
}

export type TranslationStatus =
  | 'idle'
  | 'uploaded'
  | 'analyzing'
  | 'translating'
  | 'paused'
  | 'completed'
  | 'aborted';

export interface TranslationState {
  status: TranslationStatus;
  
  // Source data
  headers: string[];
  rows: string[][];
  
  // Configuration
  columnsToTranslate: number[];
  sourceLang: string;
  targetLang: string;
  
  // Analysis result
  context: AnalysisContext | null;
  
  // Progress
  currentBatch: number;
  totalBatches: number;
  
  // Results
  translatedRows: string[][];
  
  // Error tracking
  failedBatches: Set<number>;
  consecutiveFailures: number;
  currentRetryCount: number;
}

export type TranslationAction =
  | { type: 'UPLOAD_CSV'; headers: string[]; rows: string[][] }
  | { type: 'SET_CONFIG'; columnsToTranslate: number[]; sourceLang: string; targetLang: string }
  | { type: 'START_ANALYSIS' }
  | { type: 'ANALYSIS_COMPLETE'; context: AnalysisContext }
  | { type: 'ANALYSIS_FAILED' }
  | { type: 'START_TRANSLATION' }
  | { type: 'START_BATCH'; batch: number }
  | { type: 'BATCH_SUCCESS'; batch: number; rows: string[][] }
  | { type: 'BATCH_RETRY'; batch: number; attempt: number }
  | { type: 'BATCH_FAILED'; batch: number }
  | { type: 'TRANSLATION_COMPLETE' }
  | { type: 'TRANSLATION_ABORTED'; reason: string }
  | { type: 'RESET' };

export interface Language {
  code: string;
  label: string;
  icon?: string;
}
