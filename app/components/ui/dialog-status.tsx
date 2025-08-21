import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "~/components/ui/dialog";

import { cn } from "~/lib/utils";

import { CheckCircle2, XCircle, Info, Loader2 } from "lucide-react";

type StatusType = "success" | "error" | "info" | "loading";

export interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: StatusType;
  title?: string;
  description?: React.ReactNode;
  primaryAction?: { label: string; onClick?: () => void; className?: string };
  secondaryAction?: { label: string; onClick?: () => void; className?: string };
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

const typeStyles: Record<StatusType, { icon: React.ElementType; ring: string; iconColor: string; titleColor: string }> =
  {
    success: {
      icon: CheckCircle2,
      ring: "ring-emerald-200",
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-900",
    },
    error: { icon: XCircle, ring: "ring-rose-200", iconColor: "text-rose-600", titleColor: "text-rose-900" },
    info: { icon: Info, ring: "ring-blue-200", iconColor: "text-blue-600", titleColor: "text-blue-900" },
    loading: { icon: Loader2, ring: "ring-gray-200", iconColor: "text-gray-500", titleColor: "text-gray-900" },
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
}: StatusDialogProps) {
  const { icon: Icon, ring, iconColor, titleColor } = typeStyles[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent className={cn("sm:max-w-md focus-visible:outline-none focus-visible:ring-2", ring)}>
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <Icon className={cn("h-6 w-6", iconColor, type === "loading" && "animate-spin")} />
            <DialogTitle className={cn("text-lg font-semibold", titleColor)}>
              {title ?? (type === "success" ? "Success" : type === "error" ? "Something went wrong" : "Information")}
            </DialogTitle>
          </div>
          {description ? <p className="text-sm text-gray-600">{description}</p> : null}
        </DialogHeader>

        {children ? <div className="mt-2">{children}</div> : null}

        {(primaryAction || secondaryAction) && (
          <DialogFooter>
            {secondaryAction ? (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50",
                  secondaryAction.className
                )}
              >
                {secondaryAction.label}
              </button>
            ) : null}
            {primaryAction ? (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className={cn(
                  "rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90",
                  primaryAction.className
                )}
              >
                {primaryAction.label}
              </button>
            ) : null}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
