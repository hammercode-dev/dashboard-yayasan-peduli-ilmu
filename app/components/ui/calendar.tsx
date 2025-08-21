import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

const Calendar = ({
  selected,
  onSelect,
  className,
}: {
  selected?: Date | null;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    return selected || new Date();
  });

  useEffect(() => {
    if (selected) {
      setCurrentDate(selected);
    }
  }, [selected]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onSelect?.(newDate);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      selected &&
      selected.getDate() === day &&
      selected.getMonth() === currentDate.getMonth() &&
      selected.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className={cn("p-4 bg-white w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <div className="font-semibold text-gray-900 text-sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button type="button" onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="p-2 text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {emptyDays.map((day) => (
          <div key={`empty-${day}`} className="p-2"></div>
        ))}
        {days.map((day) => {
          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              className={cn(
                "p-2 text-sm rounded-md hover:bg-gray-100 transition-colors min-h-[32px] flex items-center justify-center",
                selected && "bg-blue-600 text-white hover:bg-blue-700",
                today && !selected && "bg-blue-100 text-blue-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
