import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormError } from "~/components/ui/formError";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Controller, useWatch, type FieldErrors } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { useMemo } from "react";

type DonationFundingFormValues = {
  target_amount: number;
  collected_amount: number;
};

type FormFundingSectionProps = {
  errors: FieldErrors<DonationFundingFormValues>;
  control: any;
  setValue: any;
};

const formatCurrencyIDR = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

function FormFundingSection({ errors, control, setValue }: FormFundingSectionProps) {
  const targetAmount = useWatch({ control, name: "target_amount" });
  const collectedAmount = useWatch({ control, name: "collected_amount" });

  const PRESET_AMOUNTS = [1_000_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000];

  const progress = useMemo(() => {
    const target = Number(targetAmount || 0);
    const collected = Number(collectedAmount || 0);
    if (!target || target <= 0) return 0;
    return Math.min(Math.round((collected / target) * 100), 100);
  }, [targetAmount, collectedAmount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Information</CardTitle>
        <CardDescription>Set target and collected amounts for the donation campaign.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_amount">Target Amount</Label>
            <Controller
              name="target_amount"
              control={control}
              render={({ field }) => (
                <Input
                  id="target_amount"
                  type="number"
                  inputMode="numeric"
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  aria-invalid={!!errors.target_amount}
                  aria-describedby={errors.target_amount ? "target-error" : undefined}
                  className={cn(errors.target_amount && "border-red-500")}
                />
              )}
            />
            <FormError name="target_amount" errors={errors} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Quick Target Amount Selection</Label>
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setValue("target_amount", amount, { shouldValidate: true, shouldDirty: true })}
              >
                Rp {amount.toLocaleString("id-ID")}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="collected_amount">Collected Amount</Label>
          <Controller
            name="collected_amount"
            control={control}
            render={({ field }) => (
              <Input
                id="collected_amount"
                type="number"
                inputMode="numeric"
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
                aria-invalid={!!errors.collected_amount}
                aria-describedby={errors.collected_amount ? "collected-error" : undefined}
                className={cn(errors.collected_amount && "border-red-500")}
              />
            )}
          />
          <FormError name="collected_amount" errors={errors} />
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-900">Funding Progress</h4>
            <span className="text-sm font-medium text-green-700">{progress} %</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-green-200 rounded-full h-2 mb-3" aria-label="Funding progress">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-green-700 font-medium">Collected</div>
              <div className="text-green-900 font-semibold">{formatCurrencyIDR(collectedAmount)}</div>
            </div>
            <div>
              <div className="text-green-700 font-medium">Remaining</div>
              <div className="text-green-900 font-semibold">
                {formatCurrencyIDR(Math.max(Number(targetAmount || 0) - Number(collectedAmount || 0), 0))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FormFundingSection;
