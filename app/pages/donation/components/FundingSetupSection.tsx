import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const financialSchema = z.object({
  target_amount: z
    .string()
    .min(1, "Target amount is required")
    .refine((val) => Number(val) > 0, {
      message: "Target must be greater than 0",
    }),
  collected_amount: z
    .string()
    .min(1, "Collected amount is required")
    .refine((val) => Number(val) >= 0, {
      message: "Collected must be 0 or more",
    }),
});

type FinancialFormData = z.infer<typeof financialSchema>;

const presetAmounts = [1000000, 5000000, 10000000, 25000000, 50000000, 100000000];

export default function FundingSetupSection({ onChange }: { onChange?: (data: FinancialFormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FinancialFormData>({
    resolver: zodResolver(financialSchema),
    defaultValues: {
      target_amount: "",
      collected_amount: "",
    },
  });

  const target = Number(watch("target_amount"));
  const collected = Number(watch("collected_amount"));
  const progress = target > 0 ? Math.round((collected / target) * 100) : 0;

  useEffect(() => {
    if (onChange) {
      onChange({
        target_amount: watch("target_amount"),
        collected_amount: watch("collected_amount"),
      });
    }
  }, [watch("target_amount"), watch("collected_amount")]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Information</CardTitle>
        <CardDescription>Set target and collected amounts for the donation campaign.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="target_amount">Target Amount</Label>
          <Input type="number" min="0" placeholder="0.00" {...register("target_amount")} />
          {errors.target_amount && <span className="text-xs text-red-500">{errors.target_amount.message}</span>}
        </div>

        <div className="space-y-2">
          <Label>Quick Target Amount Selection</Label>
          <div className="flex flex-wrap gap-2">
            {presetAmounts.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue("target_amount", amt.toString())}
                className="text-xs"
              >
                Rp {amt.toLocaleString("id-ID")}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="collected_amount">Collected Amount</Label>
          <Input type="number" min="0" placeholder="0" {...register("collected_amount")} />
          {errors.collected_amount && <span className="text-xs text-red-500">{errors.collected_amount.message}</span>}
        </div>

        {/* Progress Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-900">Funding Progress</h4>
            <span className="text-sm font-medium text-green-700">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-green-200 rounded-full h-2 mb-3">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-green-700 font-medium">Collected</div>
              <div className="text-green-900 font-semibold">
                {collected.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </div>
            </div>
            <div>
              <div className="text-green-700 font-medium">Remaining</div>
              <div className="text-green-900 font-semibold">
                {Math.max(target - collected, 0).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
