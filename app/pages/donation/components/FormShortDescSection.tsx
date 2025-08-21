import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormError } from "~/components/ui/formError";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { type FormInput } from "../rules/validation-schema";

type DonationShortDescFormValues = {
  short_description: string;
  short_description_en: string;
  short_description_ar: string;
};

type FormShortDescSectionProps = {
  errors: FieldErrors<DonationShortDescFormValues>;
  register: UseFormRegister<FormInput>;
};

function FormShortDescSection({ errors, register }: FormShortDescSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Short Descriptions</CardTitle>
        <CardDescription>Brief descriptions that will appear in previews and summaries.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              placeholder="Brief description"
              aria-invalid={!!errors?.short_description}
              aria-describedby={errors.short_description ? "sd-error" : undefined}
              className={cn(errors?.short_description && "border-red-500")}
              {...register("short_description")}
            />
            <FormError name="short_description" errors={errors} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_description_en">Short Description (English)</Label>
            <Input
              id="short_description_en"
              placeholder="Brief description in English"
              aria-invalid={!!errors?.short_description_en}
              aria-describedby={errors.short_description_en ? "sde-error" : undefined}
              className={cn(errors?.short_description_en && "border-red-500")}
              {...register("short_description_en")}
            />
            <FormError name="short_description_en" errors={errors} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_description_ar">Short Description (Arabic)</Label>
            <Input
              id="short_description_ar"
              placeholder="وصف مختصر بالعربية"
              dir="rtl"
              aria-invalid={!!errors?.short_description_ar}
              aria-describedby={errors.short_description_ar ? "sda-error" : undefined}
              className={cn(errors?.short_description_ar && "border-red-500")}
              {...register("short_description_ar")}
            />
            <FormError name="short_description_ar" errors={errors} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FormShortDescSection;
