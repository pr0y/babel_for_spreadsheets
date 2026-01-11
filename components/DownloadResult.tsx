import { Button } from './ui/Button';
import { serializeCSV, downloadCSV } from '@/lib/csv';
import { PREVIEW_ROW_LIMIT } from '@/lib/constants';

interface DownloadResultProps {
  headers: string[];
  translatedRows: string[][];
  failedBatches: Set<number>;
  onReset: () => void;
}

export function DownloadResult({
  headers,
  translatedRows,
  failedBatches,
  onReset,
}: DownloadResultProps) {
  const handleDownload = () => {
    const csvContent = serializeCSV(headers, translatedRows);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    downloadCSV(csvContent, `translated-${timestamp}.csv`);
  };

  const previewRows = translatedRows.slice(0, PREVIEW_ROW_LIMIT);
  const hasMore = translatedRows.length > PREVIEW_ROW_LIMIT;

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-accent-secondary mb-2">
              Translation Complete!
            </h3>
            <p className="text-text-secondary">
              Successfully translated {translatedRows.length} rows across {headers.length} columns
            </p>
            {failedBatches.size > 0 && (
              <p className="text-accent-error text-sm mt-2">
                Warning: {failedBatches.size} batch(es) failed and were left unchanged
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button size="lg" onClick={handleDownload}>
            Download CSV
          </Button>
          <Button variant="secondary" onClick={onReset}>
            Start Over
          </Button>
        </div>
      </div>

      <div className="card">
        <h4 className="text-lg font-semibold mb-4 text-accent-primary">Preview</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-accent-secondary bg-opacity-10">
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-sm font-semibold text-accent-secondary border-b-2 border-accent-secondary whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={rowIdx % 2 === 0 ? 'bg-bg-secondary' : 'bg-bg-tertiary bg-opacity-30'}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-4 py-2 text-sm text-text-primary border-b border-grid whitespace-nowrap"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {hasMore && (
          <p className="mt-4 text-sm text-text-tertiary text-center">
            ...and {translatedRows.length - PREVIEW_ROW_LIMIT} more rows
          </p>
        )}
      </div>
    </div>
  );
}
