interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-secondary">{label}</span>
          <span className="text-sm text-text-tertiary">
            {current} / {total}
          </span>
        </div>
      )}
      <div className="w-full h-3 bg-bg-tertiary rounded-full overflow-hidden border border-border">
        <div 
          className="h-full bg-gradient-to-r from-accent-primary to-amber-500 transition-all duration-300 relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-20 animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
}
