import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { FormError } from "~/components/ui/formError";
import { Label } from "~/components/ui/label";
import Calendar from "~/components/ui/calendar";

import { CalendarIcon } from "lucide-react";

import { cn, formatDate } from "~/lib/utils";

import type { FormInput } from "../rules/validation-schema";
import { useWatch, type FieldErrors } from "react-hook-form";

type DurationSectionProps = {
  control: any;
  handleInputChange: any;
  errors: FieldErrors<FormInput>;
};

const FormDurationSection: React.FC<DurationSectionProps> = ({ control, handleInputChange, errors }) => {
  const startDate = useWatch({ control, name: "starts_at" });
  const endDate = useWatch({ control, name: "ends_at" });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Duration</CardTitle>
        <CardDescription>Set the campaign duration and current status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    aria-invalid={!!errors.starts_at}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-gray-500",
                      errors.starts_at && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(startDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar selected={startDate} onSelect={(date) => handleInputChange("starts_at", date)} />
                </PopoverContent>
              </Popover>
              <FormError name="starts_at" errors={errors} />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    aria-invalid={!!errors.ends_at}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-gray-500",
                      errors.ends_at && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(endDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar selected={endDate} onSelect={(date) => handleInputChange("ends_at", date)} />
                </PopoverContent>
              </Popover>
              <FormError name="ends_at" errors={errors} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Duration Selection</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "3 Months", months: 3 },
                { label: "6 Months", months: 6 },
                { label: "9 Months", months: 9 },
                { label: "1 Year", years: 1 },
              ].map(({ label, months, years }) => (
                <Button
                  key={label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const startDate = new Date();
                    const endDate = new Date();

                    console.log(typeof startDate);

                    if (months) endDate.setMonth(endDate.getMonth() + months);
                    if (years) endDate.setFullYear(endDate.getFullYear() + years);

                    handleInputChange("starts_at", startDate);
                    handleInputChange("ends_at", endDate);
                  }}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {startDate && endDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">Campaign Duration</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {(() => {
                      const start = startDate;
                      const end = endDate;
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      const diffWeeks = Math.floor(diffDays / 7);
                      const diffMonths = Math.floor(diffDays / 30);

                      if (diffDays < 7) {
                        return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
                      } else if (diffDays < 30) {
                        return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} (${diffDays} days)`;
                      } else {
                        return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} (${diffDays} days)`;
                      }
                    })()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {(() => {
                      const start = startDate;
                      const end = endDate;
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays;
                    })()}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">DAYS</div>
                </div>
              </div>

              {endDate <= startDate && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  ⚠️ End date must be after start date
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormDurationSection;
