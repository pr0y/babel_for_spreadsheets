import { useReducer } from 'react';
import { TranslationState, TranslationAction } from '@/lib/types';

const initialState: TranslationState = {
  status: 'idle',
  headers: [],
  rows: [],
  columnsToTranslate: [],
  sourceLang: 'auto',
  targetLang: 'en',
  context: null,
  currentBatch: 0,
  totalBatches: 0,
  translatedRows: [],
  failedBatches: new Set(),
  consecutiveFailures: 0,
  currentRetryCount: 0,
};

function translationReducer(state: TranslationState, action: TranslationAction): TranslationState {
  switch (action.type) {
    case 'UPLOAD_CSV':
      return {
        ...initialState,
        status: 'uploaded',
        headers: action.headers,
        rows: action.rows,
      };

    case 'SET_CONFIG':
      return {
        ...state,
        columnsToTranslate: action.columnsToTranslate,
        sourceLang: action.sourceLang,
        targetLang: action.targetLang,
      };

    case 'START_ANALYSIS':
      return {
        ...state,
        status: 'analyzing',
      };

    case 'ANALYSIS_COMPLETE':
      return {
        ...state,
        context: action.context,
      };

    case 'ANALYSIS_FAILED':
      // Continue without context if analysis fails
      return {
        ...state,
        context: null,
      };

    case 'START_TRANSLATION':
      return {
        ...state,
        status: 'translating',
        currentBatch: 0,
        translatedRows: [],
        failedBatches: new Set(),
        consecutiveFailures: 0,
        currentRetryCount: 0,
      };

    case 'START_BATCH':
      return {
        ...state,
        currentBatch: action.batch,
        currentRetryCount: 0,
      };

    case 'BATCH_SUCCESS': {
      const newTranslatedRows = [...state.translatedRows, ...action.rows];
      return {
        ...state,
        translatedRows: newTranslatedRows,
        consecutiveFailures: 0, // Reset on success
        currentRetryCount: 0,
      };
    }

    case 'BATCH_RETRY':
      return {
        ...state,
        currentRetryCount: action.attempt,
      };

    case 'BATCH_FAILED': {
      const newFailedBatches = new Set(state.failedBatches);
      newFailedBatches.add(action.batch);
      return {
        ...state,
        failedBatches: newFailedBatches,
        consecutiveFailures: state.consecutiveFailures + 1,
        currentRetryCount: 0,
      };
    }

    case 'TRANSLATION_COMPLETE':
      return {
        ...state,
        status: 'completed',
      };

    case 'TRANSLATION_ABORTED':
      return {
        ...state,
        status: 'aborted',
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function useTranslation() {
  const [state, dispatch] = useReducer(translationReducer, initialState);
  return { state, dispatch };
}
