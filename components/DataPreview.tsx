import { PREVIEW_ROW_LIMIT } from '@/lib/constants';

interface DataPreviewProps {
  headers: string[];
  rows: string[][];
}

export function DataPreview({ headers, rows }: DataPreviewProps) {
  const previewRows = rows.slice(0, PREVIEW_ROW_LIMIT);
  const hasMore = rows.length > PREVIEW_ROW_LIMIT;

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 text-accent-primary">Data Preview</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-accent-primary bg-opacity-10">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-sm font-semibold text-accent-primary border-b-2 border-accent-primary whitespace-nowrap sticky top-0"
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
          ...and {rows.length - PREVIEW_ROW_LIMIT} more rows
        </p>
      )}
      
      <p className="mt-2 text-xs text-text-secondary text-center">
        Total: {rows.length} rows × {headers.length} columns
      </p>
    </div>
  );
}
