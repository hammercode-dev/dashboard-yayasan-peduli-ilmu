import { Controller } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormError } from "~/components/ui/formError";
import { Label } from "~/components/ui/label";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";

import type { FieldErrors } from "react-hook-form";

type DonationDescriptionFormValues = {
  description: string;
  description_en: string;
  description_ar: string;
};

type FormDescriptionSectionProps = {
  errors: FieldErrors<DonationDescriptionFormValues>;
  control: any;
};

function FormDescriptionSection({ errors, control }: FormDescriptionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Descriptions</CardTitle>
        <CardDescription>Full descriptions that will appear on the campaign page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="description" className="">
            Detailed Description * <FormError name="description" errors={errors} />
          </Label>
          <br />
          <Card>
            <CardContent>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="px-2">
                    <SimpleEditor value={field.value} onChange={field.onChange} name="description" />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="description_en" className="">
            Detailed English Description * <FormError name="description_en" errors={errors} />
          </Label>
          <br />
          <Card>
            <CardContent>
              <Controller
                name="description_en"
                control={control}
                render={({ field }) => (
                  <div className="px-2">
                    <SimpleEditor value={field.value} onChange={field.onChange} name="description_en" />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="description_ar" className="">
            Detailed Arabic Description * <FormError name="description_ar" errors={errors} />
          </Label>
          <br />
          <Card>
            <CardContent>
              <Controller
                name="description_ar"
                control={control}
                render={({ field }) => (
                  <div className="px-2">
                    <SimpleEditor value={field.value} onChange={field.onChange} name="description_ar" />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

export default FormDescriptionSection;
