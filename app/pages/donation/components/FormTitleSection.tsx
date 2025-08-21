import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormError } from "~/components/ui/formError";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";
import { type FormInput } from "../rules/validation-schema";

type DonationTitleFormValues = {
  title: string;
  title_en: string;
  title_ar: string;
};

type FormTitleSectionProps = {
  errors: FieldErrors<DonationTitleFormValues>;
  register: UseFormRegister<FormInput>;
  slug: string;
};

export default function FormTitleSection({ errors, register, slug }: FormTitleSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title &amp; Identification</CardTitle>
        <CardDescription>Set the title, slug, and multilingual titles for your donation campaign.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter donation title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={cn(errors.title && "border-red-500")}
              {...register("title")}
            />
            <FormError name="title" errors={errors} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title_en">Title (English) *</Label>
            <Input
              id="title_en"
              placeholder="English title"
              aria-invalid={!!errors?.title_en}
              aria-describedby={errors.title_en ? "title-en-error" : undefined}
              className={cn(errors?.title_en && "border-red-500")}
              {...register("title_en")}
            />
            <FormError name="title_en" errors={errors} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title_ar">Title (Arabic) *</Label>
            <Input
              id="title_ar"
              placeholder="العنوان بالعربية"
              dir="rtl"
              aria-invalid={!!errors?.title_ar}
              aria-describedby={errors.title_ar ? "title-ar-error" : undefined}
              className={cn(errors?.title_ar && "border-red-500")}
              {...register("title_ar")}
            />
            <FormError name="title_ar" errors={errors} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={slug} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
