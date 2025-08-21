import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TurndownService from "turndown";

import { Button } from "~/components/ui/button";
import { StatusDialog } from "~/components/ui/dialog-status";
import FormTitleSection from "./components/FormTitleSection";
import FormShortDescSection from "./components/FormShortDescSection";
import FormDescriptionSection from "./components/FormDescriptionSection";
import FormFundingSection from "./components/FormFundingSection";
import FormDurationSection from "~/pages/donation/components/FormDurationSection";
import FormAdditionalInfoSection from "~/pages/donation/components/FormAdditionalInfoSection";

import { supabase } from "~/lib/supabase";
import { slugify, uploadImageToSupabase } from "~/lib/utils";
import { schema, type FormInput } from "./rules/validation-schema";

export default function FormCreateDonation() {
  const navigate = useNavigate();
  const turndown = useMemo(() => new TurndownService(), []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "info" | "loading">("info");
  const [message, setMessage] = useState<ReactNode>("");

  const DEFAULTS: Partial<FormInput> = {
    title: "",
    title_en: "",
    title_ar: "",
    short_description: "",
    short_description_en: "",
    short_description_ar: "",
    description: "",
    description_en: "",
    description_ar: "",
    target_amount: 1_000_000,
    collected_amount: 0,
    starts_at: null,
    ends_at: null,
    location: "",
    image_url: "",
    image_file: null,
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: DEFAULTS,
  });

  const title = useWatch({ control, name: "title" });
  const slug = useMemo(() => slugify(title ?? ""), [title]);

  const handleInputChange = useCallback(
    (field: keyof FormInput, value: string | number | Date | null) => {
      setValue(field, value as any, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    setMessage("Creating donation program");
    setDialogOpen(true);

    try {
      const publicUrl = await uploadImageToSupabase(data.image_file, "program-images");

      // Convert HTML from editor to Markdown
      const mdDescription = turndown.turndown(data.description || "");
      const mdDescriptionEn = turndown.turndown(data.description_en || "");
      const mdDescriptionAr = turndown.turndown(data.description_ar || "");

      const { error: insertError } = await supabase.from("program_donation").insert({
        title: data.title,
        title_en: data.title_en,
        title_ar: data.title_ar,
        slug,
        status: "active",
        short_description: data.short_description,
        short_description_en: data.short_description_en,
        short_description_ar: data.short_description_ar,
        description: mdDescription,
        description_en: mdDescriptionEn,
        description_ar: mdDescriptionAr,
        target_amount: data.target_amount,
        collected_amount: data.collected_amount,
        starts_at: data.starts_at,
        ends_at: data.ends_at,
        location: data.location,
        image_url: publicUrl,
      });

      if (insertError) throw insertError;

      setStatus("success");
      setMessage(
        <>
          <br />
          Your donation program <span className="font-medium">{data?.title ?? "Untitled"}</span> was created.
          <br />
        </>
      );
      reset(DEFAULTS);
      setValue("image_file", null);
      setTimeout(() => setFocus("title"), 1);
    } catch (err) {
      console.error("Error creating campaign:", err);
      setStatus("error");
      setMessage(
        <>
          We couldn’t create your program.
          <br />
          <span className="text-xs text-gray-500">Reason: {`${err} ?? "Unknown error"`}</span>
        </>
      );
    }
  });

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormTitleSection errors={errors} register={register} slug={slug} />
        <FormShortDescSection errors={errors} register={register} />
        <FormDescriptionSection errors={errors} control={control} />
        <FormFundingSection errors={errors} control={control} setValue={setValue} />
        <FormDurationSection control={control} handleInputChange={handleInputChange} errors={errors} />
        <FormAdditionalInfoSection register={register} control={control} errors={errors} setValue={setValue} />
        <div className="flex justify-end">
          <Button type="submit" size="lg" variant="default" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Donation Campaign"}
          </Button>
        </div>
      </form>

      {dialogOpen && (
        <StatusDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          type={status}
          title={
            status === "success"
              ? "Program Created"
              : status === "error"
                ? "Creation Failed"
                : status === "loading"
                  ? "Please wait"
                  : "Notice"
          }
          description={message}
          secondaryAction={{
            label: status === "success" ? "Lihat List Donation" : "Close",
            onClick: () => {
              setDialogOpen(false);
              if (status === "success") {
                navigate(-1);
              }
            },
          }}
          primaryAction={
            status === "success"
              ? {
                  label: "Create Another",
                  onClick: () => {
                    setDialogOpen(false);
                  },
                }
              : status === "error"
                ? {
                    label: "Try Again",
                    onClick: () => {
                      setDialogOpen(false);
                    },
                  }
                : undefined
          }
        />
      )}
    </>
  );
}
