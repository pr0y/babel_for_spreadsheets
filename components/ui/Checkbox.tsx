import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        className={`w-5 h-5 rounded border-2 border-border bg-bg-tertiary checked:bg-accent-primary checked:border-accent-primary focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-secondary transition-all cursor-pointer transform checked:scale-110 ${className}`}
        {...props}
      />
      <span className="text-text-primary group-hover:text-accent-primary transition-colors select-none">
        {label}
      </span>
    </label>
  );
}
