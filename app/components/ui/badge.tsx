import type { ReactNode } from "react";
import clsx from "clsx";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize",
        className
      )}
    >
      {children}
    </span>
  );
}
