import { useState, useEffect } from 'react';
import { Select } from './ui/Select';
import { Checkbox } from './ui/Checkbox';
import { Button } from './ui/Button';
import { sourceLanguages, targetLanguages } from '@/lib/languages';
import { isNumericColumn } from '@/lib/csv';

interface TranslationConfigProps {
  headers: string[];
  rows: string[][];
  onStart: (columnsToTranslate: number[], sourceLang: string, targetLang: string) => void;
}

export function TranslationConfig({ headers, rows, onStart }: TranslationConfigProps) {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [selectedColumns, setSelectedColumns] = useState<Set<number>>(new Set());

  // Auto-select text columns on mount
  useEffect(() => {
    const textColumns = new Set<number>();
    headers.forEach((_, idx) => {
      if (!isNumericColumn(rows, idx)) {
        textColumns.add(idx);
      }
    });
    setSelectedColumns(textColumns);
  }, [headers, rows]);

  const toggleColumn = (index: number) => {
    const newSelected = new Set(selectedColumns);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedColumns(newSelected);
  };

  const handleStart = () => {
    if (selectedColumns.size === 0) {
      alert('Please select at least one column to translate');
      return;
    }
    onStart(Array.from(selectedColumns), sourceLang, targetLang);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 text-accent-primary">Translation Configuration</h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Language Selection */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
            Languages
          </h4>
          
          <Select
            label="Source Language"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            options={sourceLanguages.map(lang => ({
              value: lang.code,
              label: lang.label,
              icon: lang.icon,
            }))}
          />
          
          <Select
            label="Target Language"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            options={targetLanguages.map(lang => ({
              value: lang.code,
              label: lang.label,
            }))}
          />
        </div>

        {/* Column Selection */}
        <div>
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
            Columns to Translate
          </h4>
          
          <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
            {headers.map((header, idx) => (
              <Checkbox
                key={idx}
                label={header}
                checked={selectedColumns.has(idx)}
                onChange={() => toggleColumn(idx)}
              />
            ))}
          </div>
          
          <p className="mt-4 text-xs text-text-tertiary">
            {selectedColumns.size} column{selectedColumns.size !== 1 ? 's' : ''} selected
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button size="lg" onClick={handleStart}>
          Analyze & Translate
        </Button>
      </div>
    </div>
  );
}
