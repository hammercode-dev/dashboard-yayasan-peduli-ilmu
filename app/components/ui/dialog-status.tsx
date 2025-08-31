import type React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CheckCircle2, XCircle, Info, Loader2, X } from "lucide-react";
import { cn } from "~/lib/utils";

type StatusType = "success" | "error" | "info" | "loading";

export interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: StatusType;
  title?: string;
  description?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
  };
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  showCloseButton?: boolean;
}

const typeStyles: Record<
  StatusType,
  {
    icon: React.ElementType;
    containerBg: string;
    iconBg: string;
    iconColor: string;
    titleColor: string;
    descriptionColor: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    containerBg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleColor: "text-emerald-900 dark:text-emerald-100",
    descriptionColor: "text-emerald-700 dark:text-emerald-300",
  },
  error: {
    icon: XCircle,
    containerBg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-100",
    descriptionColor: "text-red-700 dark:text-red-300",
  },
  info: {
    icon: Info,
    containerBg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-100",
    descriptionColor: "text-blue-700 dark:text-blue-300",
  },
  loading: {
    icon: Loader2,
    containerBg: "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800/30",
    iconBg: "bg-gray-100 dark:bg-gray-900/30",
    iconColor: "text-gray-600 dark:text-gray-400",
    titleColor: "text-gray-900 dark:text-gray-100",
    descriptionColor: "text-gray-700 dark:text-gray-300",
  },
};

export function StatusDialog({
  open,
  onOpenChange,
  type = "info",
  title,
  description,
  primaryAction,
  secondaryAction,
  trigger,
  children,
  showCloseButton = true,
}: StatusDialogProps) {
  const { icon: Icon, containerBg, iconBg, iconColor, titleColor, descriptionColor } = typeStyles[type];

  const defaultTitle = {
    success: "Success",
    error: "Something went wrong",
    info: "Information",
    loading: "Loading...",
  }[type];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white dark:bg-gray-950 p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl sm:max-w-md md:max-w-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400"
          )}
        >
          <div className={cn("rounded-t-xl border-b p-8 pb-6 relative", containerBg)}>
            {/* Close button positioned absolutely in top-right */}
            {showCloseButton && (
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-gray-950 dark:focus:ring-blue-400">
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}

            {/* Centered content layout */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Large prominent status icon */}
              <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-full", iconBg)}>
                <Icon
                  className={cn("h-8 w-8", iconColor, {
                    "animate-spin": type === "loading",
                  })}
                  aria-hidden="true"
                />
              </div>

              {/* Centered title and description */}
              <div className="space-y-2 max-w-xs">
                <DialogPrimitive.Title className={cn("text-xl font-semibold leading-tight tracking-tight", titleColor)}>
                  {title ?? defaultTitle}
                </DialogPrimitive.Title>

                {description && (
                  <DialogPrimitive.Description className={cn("text-sm leading-relaxed", descriptionColor)}>
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
            </div>
          </div>

          {children && (
            <div className="px-8 py-6 text-center">
              <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
            </div>
          )}

          {/* Footer with actions */}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-center">
              {secondaryAction && (
                <button
                  type="button"
                  onClick={secondaryAction.onClick}
                  disabled={secondaryAction.disabled}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-900 transition-colors",
                    "hover:bg-gray-50 hover:text-gray-900",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400",
                    secondaryAction.className
                  )}
                >
                  {secondaryAction.label}
                </button>
              )}

              {primaryAction && (
                <button
                  type="button"
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled || primaryAction.loading}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-gray-50 transition-colors",
                    "hover:bg-gray-900/90",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-blue-400",
                    primaryAction.className
                  )}
                >
                  {primaryAction.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  {primaryAction.label}
                </button>
              )}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
