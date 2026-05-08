import { forwardRef } from 'react';
import Spinner from '../loaders/Spinner';
import { Ghost } from 'lucide-react';
import  {VARIANTS, SIZES}  from '../../config/constants';


const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon = null,
    iconRight = null,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`relative inline-flex items-center justify-center whitespace-nowrap font-semibold tracking-wide border select-none transition-all duration-180 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visble:ring-offset-2 focus-visble:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.97] touch-manipulation 
      ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 18 : 15} className="text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}

      <span className={loading ? 'opacity-0 absolute' : ''}>{children}</span>

      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
});
export default Button;
