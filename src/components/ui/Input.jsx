// Usage:
//   <Input
//     label="Email address"
//     type="email"
//     placeholder="you@example.com"
//     value={email}
//     onChange={(e) => setEmail(e.target.value)}
//     error={fieldErrors.email}
//     icon={<Mail size={18} />}
//   />
//
//   <Input
//     label="Event description"
//     as="textarea"
//     rows={5}
//     value={description}
//     onChange={(e) => setDescription(e.target.value)}
//   />

import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label = '',
    helper = '',
    error = '',
    icon = null,
    right = null,
    as = 'input',
    className = '',
    id,
    disabled = false,
    ...props
  },
  ref
) {
  const fieldId =
    id ??
    (typeof label === 'string'
      ? label.toLowerCase().replace(/\s+/g, '-')
      : undefined);

  const hasError = Boolean(error);
  const Tag = as;

  return (
    <div className={`flex flex-col gap-1-5 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-primary select-none mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span
            aria-hidden="true"
            className="absolute left-3.5 pointer-events-none text-muted"
          >
            {icon}
          </span>
        )}
        <Tag
          ref={ref}
          id={fieldId}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            helper
              ? `${fieldId}-error`
              : helper
                ? `${fieldId}-helper`
                : undefined
          }
          className={`w-full bg-bg text-primary border rounded-card text-base placeholder:text-muted transition-color duration-180 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation 
            ${icon ? 'pl-10' : 'pl-4'} 
            ${right ? 'pr-11' : 'pr-4'} 
            ${as === 'testarea' ? 'py-3 resize-y min -h-[120px] leading-relaxed' : 'h-12'} 
            ${
              hasError
                ? 'border-error focus:ring-error/30'
                : 'border-border focus:ring-accent/30 focus: border-accent'
            }
            `}
          {...props}
        />

        {right && (
          <span className="absolute right-3.5 flex items-center">{right}</span>
        )}
      </div>
      {hasError ? (
        <p id={`${fieldId}-error`} className="text-xs text-error leading snug">
          {error}
        </p>
      ) : helper ? (
        <p id={`${fieldId}-helper`} className="text-xs text-muted leading-snug">
          {helper}
        </p>
      ) : null}
    </div>
  );
});
export default Input;
