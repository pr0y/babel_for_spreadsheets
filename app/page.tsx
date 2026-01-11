'use client';

import { useCallback, useRef } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { TranslationConfig } from '@/components/TranslationConfig';
import { TranslationProgress } from '@/components/TranslationProgress';
import { DownloadResult } from '@/components/DownloadResult';
import { useTranslation } from '@/hooks/useTranslation';
import { parseCSV } from '@/lib/csv';
import { BATCH_SIZE, ANALYSIS_SAMPLE_SIZE, MAX_CONSECUTIVE_FAILURES, RATE_LIMIT_DELAY } from '@/lib/constants';
import { AnalysisContext } from '@/lib/types';

export default function Home() {
  const { state, dispatch } = useTranslation();
  const abortRef = useRef(false);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const { headers, rows } = await parseCSV(file);
      dispatch({ type: 'UPLOAD_CSV', headers, rows });
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to parse CSV');
    }
  }, [dispatch]);

  const runTranslation = async (
    rows: string[][],
    headers: string[],
    columnsToTranslate: number[],
    sourceLang: string,
    targetLang: string,
    context: AnalysisContext | null
  ) => {
    const totalBatches = Math.ceil(rows.length / BATCH_SIZE);
    const allTranslatedRows: string[][] = [];
    const failedBatchIndices = new Set<number>();
    let consecutiveFailures = 0;

    for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
      if (abortRef.current) {
        dispatch({ type: 'TRANSLATION_ABORTED', reason: 'User aborted' });
        return;
      }

      dispatch({ type: 'START_BATCH', batch: batchIdx });

      const start = batchIdx * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, rows.length);
      const batch = rows.slice(start, end);

      let success = false;
      let attempts = 0;

      while (!success && attempts < 3) {
        attempts++;
        
        if (attempts > 1) {
          dispatch({ type: 'BATCH_RETRY', batch: batchIdx, attempt: attempts });
          await new Promise(resolve => setTimeout(resolve, 500 * attempts));
        }

        try {
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

          const response = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              batch,
              headers,
              columnsToTranslate,
              context,
              sourceLang,
              targetLang,
            }),
          });

          if (response.ok) {
            const { translatedBatch } = await response.json();
            dispatch({ type: 'BATCH_SUCCESS', batch: batchIdx, rows: translatedBatch });
            allTranslatedRows.push(...translatedBatch);
            consecutiveFailures = 0;
            success = true;
          }
        } catch (error) {
          console.error(`Batch ${batchIdx} attempt ${attempts} failed:`, error);
        }
      }

      if (!success) {
        dispatch({ type: 'BATCH_FAILED', batch: batchIdx });
        failedBatchIndices.add(batchIdx);
        consecutiveFailures++;
        
        // Use original rows for failed batches
        allTranslatedRows.push(...batch);

        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          dispatch({ 
            type: 'TRANSLATION_ABORTED', 
            reason: 'Too many consecutive batch failures' 
          });
          alert('Translation aborted due to repeated failures. Partial results available for download.');
          return;
        }
      }
    }

    dispatch({ type: 'TRANSLATION_COMPLETE' });
  };

  const handleConfigStart = useCallback(
    async (columnsToTranslate: number[], sourceLang: string, targetLang: string) => {
      abortRef.current = false;
      dispatch({ type: 'SET_CONFIG', columnsToTranslate, sourceLang, targetLang });
      dispatch({ type: 'START_ANALYSIS' });

      // Run pre-analysis
      let context: AnalysisContext | null = null;
      try {
        const sampleRows = state.rows.slice(0, ANALYSIS_SAMPLE_SIZE);
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ headers: state.headers, sampleRows }),
        });

        if (response.ok) {
          const analysisResult = await response.json();
          context = analysisResult;
          dispatch({ type: 'ANALYSIS_COMPLETE', context: analysisResult });
        } else {
          console.error('Analysis failed, continuing without context');
          dispatch({ type: 'ANALYSIS_FAILED' });
        }
      } catch (error) {
        console.error('Analysis error:', error);
        dispatch({ type: 'ANALYSIS_FAILED' });
      }

      // Start translation
      dispatch({ type: 'START_TRANSLATION' });
      await runTranslation(
        state.rows,
        state.headers,
        columnsToTranslate,
        sourceLang,
        targetLang,
        context
      );
    },
    [state.rows, state.headers, dispatch]
  );

  const handleAbort = useCallback(() => {
    if (confirm('Are you sure you want to abort the translation?')) {
      abortRef.current = true;
    }
  }, []);

  const handleReset = useCallback(() => {
    abortRef.current = false;
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-accent-primary mb-2">
            Babel for Spreadsheets
          </h1>
          <p className="text-text-secondary text-lg">
            Proof of Concept for Babel | To be integrated into Babel
          </p>
        </header>

        {state.status === 'idle' && (
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {state.status === 'uploaded' && (
          <div className="space-y-6 animate-fade-in">
            <DataPreview headers={state.headers} rows={state.rows} />
            <TranslationConfig
              headers={state.headers}
              rows={state.rows}
              onStart={handleConfigStart}
            />
          </div>
        )}

        {(state.status === 'analyzing') && (
          <div className="card animate-fade-in">
            <p className="text-center text-text-secondary">
              Analyzing your data...
            </p>
          </div>
        )}

        {state.status === 'translating' && (
          <div className="animate-fade-in">
            <TranslationProgress
              currentBatch={state.currentBatch}
              totalBatches={Math.ceil(state.rows.length / BATCH_SIZE)}
              totalRows={state.rows.length}
              failedBatches={state.failedBatches}
              currentRetryCount={state.currentRetryCount}
              onAbort={handleAbort}
            />
          </div>
        )}

        {(state.status === 'completed' || state.status === 'aborted') && (
          <div className="animate-fade-in">
            <DownloadResult
              headers={state.headers}
              translatedRows={state.translatedRows}
              failedBatches={state.failedBatches}
              onReset={handleReset}
            />
          </div>
        )}
      </div>
    </main>
  );
}
