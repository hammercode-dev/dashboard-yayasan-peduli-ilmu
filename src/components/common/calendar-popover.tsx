"use client"

import * as React from "react"
import { format, parseISO, isValid } from "date-fns"
import { id as idDateFns } from "date-fns/locale"
import { id as idRdp } from "react-day-picker/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field"
import { cn } from "@/lib/utils"

const DEFAULT_DATE_FORMAT = "dd MMM yyyy"

export type CalendarPopoverError =
  | { message?: string }
  | Array<{ message?: string }>

export interface CalendarPopoverProps {
  value?: Date | string | null
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  /** When used in a form, pass form errors to show validation message below the trigger */
  error?: CalendarPopoverError
  dateFormat?: string
  fromDate?: Date
  toDate?: Date
  mode?: "single" | "range"
  rangeValue?: DateRange | undefined
  onRangeChange?: (range: DateRange | undefined) => void
  triggerClassName?: string
  contentClassName?: string
  "aria-invalid"?: boolean
}

function normalizeValue(
  value: Date | string | null | undefined
): Date | undefined {
  if (value == null) return undefined
  if (value instanceof Date) return isValid(value) ? value : undefined
  const d =
    typeof value === "string"
      ? value.includes("T")
        ? parseISO(value)
        : new Date(value + "T00:00:00")
      : new Date(value)
  return isValid(d) ? d : undefined
}

function normalizeError(
  err: CalendarPopoverError | undefined
): Array<{ message?: string }> | undefined {
  if (err == null) return undefined
  return Array.isArray(err) ? err : [err]
}

export function CalendarPopover({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled = false,
  id,
  name,
  error,
  dateFormat = DEFAULT_DATE_FORMAT,
  fromDate,
  toDate,
  mode = "single",
  rangeValue,
  onRangeChange,
  triggerClassName,
  contentClassName,
  "aria-invalid": ariaInvalid,
}: CalendarPopoverProps) {
  const [open, setOpen] = React.useState(false)
  const date = normalizeValue(value)
  const errors = normalizeError(error)
  const hasError = Boolean(errors?.length)

  const handleSelect = (selected: Date | DateRange | undefined) => {
    if (mode === "single") {
      onChange?.(selected as Date | undefined)
      setOpen(false)
    } else {
      onRangeChange?.(selected as DateRange | undefined)
    }
  }

  const triggerLabel =
    mode === "single"
      ? date
        ? format(date, dateFormat, { locale: idDateFns })
        : placeholder
      : rangeValue?.from
        ? rangeValue.to
          ? `${format(rangeValue.from, dateFormat, { locale: idDateFns })} – ${format(rangeValue.to, dateFormat, { locale: idDateFns })}`
          : format(rangeValue.from, dateFormat, { locale: idDateFns })
        : placeholder

  return (
    <div className="flex flex-col gap-1.5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            id={id}
            name={name}
            aria-invalid={ariaInvalid ?? hasError}
            className={cn(
              "w-full justify-start text-left font-normal hover:bg-white hover:text-black",
              mode === "single" && !date && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0" />
            {triggerLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("w-auto p-0", contentClassName)}
          align="start"
        >
          {mode === "single" ? (
            <Calendar
              mode="single"
              selected={date}
              onSelect={d => handleSelect(d)}
              // fromDate={fromDate}
              // toDate={toDate}
              locale={idRdp}
            />
          ) : (
            <Calendar
              mode="range"
              selected={rangeValue}
              onSelect={r => handleSelect(r)}
              // fromDate={fromDate}
              // toDate={toDate}
              locale={idRdp}
            />
          )}
        </PopoverContent>
      </Popover>
      <FieldError errors={errors} />
    </div>
  )
}
