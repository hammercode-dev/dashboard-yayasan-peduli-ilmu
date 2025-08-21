import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";

type DateRange = {
  from?: Date;
  to?: Date;
};

export default function DateRangePicker() {
  const [range, setRange] = useState<DateRange>({});

  const formatDate = (date?: Date) => (date ? format(date, "yyyy-MM-dd") : "");

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex gap-2">
        {/* START DATE */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="border px-3 py-2 rounded-md w-full flex items-center justify-between text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span>{formatDate(range.from) || "Start  ssDate"}</span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content sideOffset={5} className="bg-white p-4 rounded-md shadow-lg border z-50">
              <DayPicker mode="range" selected={range} onSelect={setRange} numberOfMonths={1} />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* END DATE */}
        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="border px-3 py-2 rounded-md w-full flex items-center justify-between text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span>{formatDate(range.to) || "End Date"}</span>
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content sideOffset={5} className="bg-white p-4 rounded-md shadow-lg border z-50">
              <DayPicker mode="range" selected={range} onSelect={setRange} numberOfMonths={1} />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
