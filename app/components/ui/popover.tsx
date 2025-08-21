import React from "react";
import { useEffect, useRef, useState, isValidElement, cloneElement, type ReactNode, type ReactElement } from "react";
import { cn } from "~/lib/utils";

export const Popover = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      {React.Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child as ReactElement<any>, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

export const PopoverTrigger = ({
  children,
  isOpen,
  setIsOpen,
}: {
  children: ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => setIsOpen?.(!isOpen)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") setIsOpen?.(!isOpen);
    }}
  >
    {children}
  </div>
);

export const PopoverContent = ({
  children,
  isOpen,
  className,
}: {
  children: ReactNode;
  isOpen?: boolean;
  className?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-[9999] mt-2 rounded-md border border-gray-200 bg-white shadow-lg",
        className
      )}
      style={{ minWidth: "300px" }}
    >
      {children}
    </div>
  );
};
