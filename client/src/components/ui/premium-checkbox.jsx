// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Premium Checkbox Component
 * A beautiful animated checkbox with smooth transitions
 * 
 * @param {string} id - Unique identifier for the checkbox
 * @param {string} label - Main label text
 * @param {string} description - Optional description text
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {function} onChange - Callback when checkbox state changes
 * @param {boolean} disabled - Whether the checkbox is disabled
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} variant - Style variant: 'default' | 'compact'
 */
export function PremiumCheckbox({ 
  id, 
  label, 
  description, 
  checked, 
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default'
}) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const labelSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const isCompact = variant === 'compact';

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`flex items-start cursor-pointer group ${
          isCompact ? 'gap-3' : 'gap-4'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Checkbox Container */}
        <div className="relative flex items-center justify-center mt-0.5">
          {/* Hidden native checkbox for accessibility */}
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
          />
          
          {/* Custom checkbox visual */}
          <motion.div
            className={`
              ${sizeClasses[size]} rounded-md border-2 flex items-center justify-center
              transition-colors duration-200
              ${
                checked
                  ? 'bg-primary border-primary'
                  : 'bg-background border-border group-hover:border-primary/50'
              }
            `}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            <AnimatePresence mode="wait">
              {checked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 25 
                  }}
                >
                  <Check className={`${iconSizes[size]} text-primary-foreground stroke-[3]`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Glow effect on hover */}
          {!disabled && (
            <motion.div
              className="absolute inset-0 rounded-md bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ filter: 'blur(6px)' }}
            />
          )}
        </div>

        {/* Label and Description */}
        <div className="flex-1">
          <div className={`text-foreground font-medium ${labelSizes[size]} leading-tight`}>
            {label}
          </div>
          {description && !isCompact && (
            <div className="text-muted-foreground text-sm leading-relaxed mt-1">
              {description}
            </div>
          )}
        </div>
      </label>
    </div>
  );
}

/**
 * Premium Checkbox Group
 * A group of checkboxes with a title
 */
export function PremiumCheckboxGroup({
  title,
  children,
  className = ''
}) {
  return (
    <div className={className}>
      {title && (
        <h4 className="font-medium text-foreground mb-3">{title}</h4>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

export default PremiumCheckbox;
