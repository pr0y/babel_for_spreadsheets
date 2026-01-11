import Papa from 'papaparse';

export interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          return;
        }

        const data = results.data as string[][];
        
        if (data.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }

        // First row is headers
        const headers = data[0];
        const rows = data.slice(1).filter(row => 
          // Filter out empty rows
          row.some(cell => cell && cell.trim() !== '')
        );

        if (rows.length === 0) {
          reject(new Error('CSV file has no data rows'));
          return;
        }

        resolve({ headers, rows });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
      skipEmptyLines: true,
    });
  });
}

export function serializeCSV(headers: string[], rows: string[][]): string {
  const data = [headers, ...rows];
  return Papa.unparse(data);
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function isNumericColumn(rows: string[][], columnIndex: number): boolean {
  // Check first 10 rows to determine if column is numeric
  const sampleSize = Math.min(10, rows.length);
  let numericCount = 0;

  for (let i = 0; i < sampleSize; i++) {
    const value = rows[i]?.[columnIndex];
    if (value && !isNaN(Number(value.replace(/[,\s]/g, '')))) {
      numericCount++;
    }
  }

  // If more than 70% are numeric, consider it a numeric column
  return numericCount / sampleSize > 0.7;
}
