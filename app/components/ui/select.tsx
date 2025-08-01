import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "~/lib/utils";

export type Option = { label: string; value: string };

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleSelect({ options, value, onChange, placeholder = "Select...", className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("relative w-full", className)} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <span className={cn(value ? "" : "text-muted-foreground")}>{selected?.label || placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-popover bg-popover shadow-md">
          <ul className="max-h-60 overflow-auto py-1 text-sm">
            {options.map((option) => (
              <li
                key={option.value}
                className={cn(
                  "flex items-center justify-between cursor-pointer select-none px-3 py-2 hover:bg-accent",
                  value === option.value ? "bg-accent text-accent-foreground" : ""
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
                {value === option.value && <Check className="h-4 w-4 text-green-600" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
