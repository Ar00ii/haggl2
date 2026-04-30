'use client';

import { AlertCircle, type LucideIcon } from 'lucide-react';
import React, { useId, useState } from 'react';

import { cn } from '@/lib/utils';

export interface AtlasFieldProps {
  label: string;
  /** Render label as floating (animated) label inside the input. */
  floating?: boolean;
  /** Helper text shown below input. */
  helper?: string;
  /** Error message — overrides helper, paints input red. */
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  /** End-aligned slot — buttons, units, kbd hints. */
  endAdornment?: React.ReactNode;
  /** Wrap an existing input/select/textarea or pass standard <input> props. */
  as?: 'input' | 'textarea';
  type?: string;
  rows?: number;
  className?: string;
  inputClassName?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  name?: string;
  id?: string;
  maxLength?: number;
  min?: number;
  max?: number;
}

/**
 * AtlasField — the canonical labelled input for forms across the app
 * (auth, publish, profile edit, api-keys). Replaces ad-hoc
 * `<label><input className="bg-zinc-900 …" /></label>` chains.
 *
 * - Floating label that lifts on focus / when value present.
 * - Optional left icon, end adornment.
 * - Inline helper + error states with shake-free transitions.
 * - All colors via CSS tokens → light + dark mode work without changes.
 */
export function AtlasField({
  label,
  floating = true,
  helper,
  error,
  required,
  icon: Icon,
  endAdornment,
  as = 'input',
  type = 'text',
  rows = 4,
  className,
  inputClassName,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  disabled,
  autoComplete,
  name,
  id,
  maxLength,
  min,
  max,
}: AtlasFieldProps) {
  const reactId = useId();
  const fieldId = id ?? reactId;
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(
    value != null && value !== '' ? true : Boolean(defaultValue),
  );

  const isActive = focused || hasValue || Boolean(placeholder && !floating);
  const InputTag: 'input' | 'textarea' = as;

  const baseInput = cn(
    'w-full bg-transparent text-[var(--text)] outline-none',
    'placeholder:text-[var(--text-muted)] disabled:opacity-50 disabled:cursor-not-allowed',
    'font-light text-[14px]',
    floating ? 'pt-5 pb-2' : 'py-2.5',
    Icon ? 'pl-9' : 'pl-3.5',
    endAdornment ? 'pr-10' : 'pr-3.5',
    inputClassName,
  );

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative rounded-xl transition-all duration-150',
          'bg-[var(--bg)] border',
          error
            ? 'border-red-500/60 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
            : focused
              ? 'border-[var(--brand)]/55 shadow-[0_0_0_3px_rgba(20,241,149,0.14)] bg-[var(--bg-elevated)]'
              : 'border-[var(--border)] hover:border-[var(--border-hover)]',
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
              focused ? 'text-[var(--brand)]' : 'text-[var(--text-muted)]',
            )}
            strokeWidth={1.75}
          />
        )}

        {floating && (
          <label
            htmlFor={fieldId}
            className={cn(
              'pointer-events-none absolute font-light transition-all duration-150',
              Icon ? 'left-9' : 'left-3.5',
              isActive
                ? 'top-1.5 text-[10.5px] uppercase tracking-[0.12em]'
                : 'top-1/2 -translate-y-1/2 text-[13.5px]',
              focused ? 'text-[var(--brand)]' : error ? 'text-red-400' : 'text-[var(--text-muted)]',
            )}
          >
            {label}
            {required && <span className="text-[var(--brand)] ml-0.5">*</span>}
          </label>
        )}

        {!floating && (
          <label
            htmlFor={fieldId}
            className="block px-3.5 pt-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]"
          >
            {label}
            {required && <span className="text-[var(--brand)] ml-0.5">*</span>}
          </label>
        )}

        {InputTag === 'textarea' ? (
          <textarea
            id={fieldId}
            name={name}
            rows={rows}
            value={value as string | undefined}
            defaultValue={defaultValue as string | undefined}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(Boolean(e.target.value));
              onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value));
              onChange?.(e);
            }}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
            className={cn(baseInput, 'resize-y min-h-[88px]')}
          />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value as string | number | undefined}
            defaultValue={defaultValue as string | number | undefined}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(Boolean(e.target.value));
              onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value));
              onChange?.(e);
            }}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            min={min}
            max={max}
            autoComplete={autoComplete}
            className={baseInput}
          />
        )}

        {endAdornment && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {endAdornment}
          </span>
        )}
      </div>

      {(helper || error) && (
        <div
          className={cn(
            'mt-1.5 flex items-center gap-1 text-[11.5px] font-light',
            error ? 'text-red-400' : 'text-[var(--text-muted)]',
          )}
        >
          {error && <AlertCircle className="w-3 h-3 shrink-0" strokeWidth={2} />}
          <span>{error ?? helper}</span>
        </div>
      )}
    </div>
  );
}

export default AtlasField;
