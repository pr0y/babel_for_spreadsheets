import { ProgressBar } from './ui/ProgressBar';
import { Button } from './ui/Button';
import { BATCH_SIZE } from '@/lib/constants';

interface TranslationProgressProps {
  currentBatch: number;
  totalBatches: number;
  totalRows: number;
  failedBatches: Set<number>;
  currentRetryCount: number;
  onAbort: () => void;
}

export function TranslationProgress({
  currentBatch,
  totalBatches,
  totalRows,
  failedBatches,
  currentRetryCount,
  onAbort,
}: TranslationProgressProps) {
  const startRow = currentBatch * BATCH_SIZE + 1;
  const endRow = Math.min((currentBatch + 1) * BATCH_SIZE, totalRows);
  const translatedRows = currentBatch * BATCH_SIZE;

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-accent-primary">Translation in Progress</h3>

      <div className="space-y-6">
        <ProgressBar
          current={currentBatch + 1}
          total={totalBatches}
          label="Overall Progress"
        />

        <div className="bg-bg-tertiary rounded-lg p-4 border border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-tertiary mb-1">Current Batch</p>
              <p className="text-text-primary font-semibold">
                Batch {currentBatch + 1} of {totalBatches}
              </p>
              <p className="text-text-secondary text-xs mt-1">
                Rows {startRow}-{endRow}
              </p>
            </div>

            <div>
              <p className="text-text-tertiary mb-1">Rows Translated</p>
              <p className="text-text-primary font-semibold">
                {translatedRows} / {totalRows}
              </p>
            </div>
          </div>
        </div>

        {currentRetryCount > 0 && (
          <div className="bg-accent-error bg-opacity-10 border border-accent-error rounded-lg p-3">
            <p className="text-accent-error text-sm">
              Retry attempt {currentRetryCount}/3...
            </p>
          </div>
        )}

        {failedBatches.size > 0 && (
          <div className="bg-bg-tertiary rounded-lg p-4 border border-border">
            <p className="text-text-secondary text-sm mb-2">
              Failed Batches: {failedBatches.size}
            </p>
            <p className="text-xs text-text-tertiary">
              These rows will be left unchanged in the final output
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-primary rounded-full animate-pulse-slow" />
            <span className="text-sm text-text-secondary">Translating...</span>
          </div>
          
          <Button variant="danger" size="sm" onClick={onAbort}>
            Abort Translation
          </Button>
        </div>
      </div>
    </div>
  );
}
