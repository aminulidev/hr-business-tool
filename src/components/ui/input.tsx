import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const isInvalid = React.useMemo(() => {
    if (type !== 'number' || props.value === undefined || props.value === '') return false;
    const num = Number(props.value);
    if (isNaN(num)) return true;
    if (props.min !== undefined && num < Number(props.min)) return true;
    if (props.max !== undefined && num > Number(props.max)) return true;
    return false;
  }, [type, props.min, props.max, props.value]);

  const errorMessage = React.useMemo(() => {
    if (!isInvalid) return null;
    const num = Number(props.value);
    if (isNaN(num)) return "Must be a valid number";
    if (props.min !== undefined && num < Number(props.min)) {
      if (Number(props.min) === 0) return "Must be a positive number";
      return `Must be at least ${props.min}`;
    }
    if (props.max !== undefined && num > Number(props.max)) return `Must be at most ${props.max}`;
    return "Invalid input";
  }, [isInvalid, props.min, props.max, props.value]);

  return (
    <>
      <input
        type={type}
        data-slot="input"
        aria-invalid={isInvalid}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          isInvalid ? "border-red-500 focus-visible:ring-red-500/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40" : "",
          className
        )}
        {...props}
      />
      {isInvalid && (
        <div className="text-[13px] font-medium text-red-500 mt-1.5 animate-in slide-in-from-top-1 fade-in-0 duration-200" aria-live="polite">
          {errorMessage}
        </div>
      )}
    </>
  )
}

export { Input }

