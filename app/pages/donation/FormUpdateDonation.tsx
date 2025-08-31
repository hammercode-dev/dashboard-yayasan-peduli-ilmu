import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLoaderData, useNavigate } from "react-router";
import FormTitleSection from "./components/FormTitleSection";
import TurndownService from "turndown";
import { useForm, useWatch } from "react-hook-form";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { zodResolver } from "@hookform/resolvers/zod";
import type { loader } from "~/routes/donation";

import { StatusDialog } from "~/components/ui/dialog-status";
import FormFundingSection from "./components/FormFundingSection";
import FormDurationSection from "./components/FormDurationSection";
import FormShortDescSection from "./components/FormShortDescSection";
import FormDescriptionSection from "./components/FormDescriptionSection";
import FormAdditionalInfoSection from "./components/FormAdditionalInfoSection";

import { supabase } from "~/lib/supabase";
import { Button } from "~/components/ui/button";
import { slugify, uploadImageToSupabase } from "~/lib/utils";
import { schema, type FormInput } from "./rules/validation-schema";

type DonationRow = {
  id: string | number;
  title: string;
  title_en: string | null;
  title_ar: string | null;
  slug: string;
  status: "active" | "inactive" | string;
  short_description: string | null;
  short_description_en: string | null;
  short_description_ar: string | null;
  description: string | null;
  description_en: string | null;
  description_ar: string | null;
  target_amount: number;
  collected_amount: number;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  image_url: string | null;
};

export default function FormUpdateDonation() {
  const { data: row } = useLoaderData<typeof loader>() as unknown as { data: DonationRow };
  const navigate = useNavigate();

  const turndown = useMemo(() => new TurndownService(), []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | "info" | "loading">("info");
  const [message, setMessage] = useState<ReactNode>("");

  const mdToHtml = (md: string) => {
    const rawHtml = marked(md);
    return DOMPurify.sanitize(rawHtml as string);
  };

  const toIsoOrNull = (d: Date | null): string | null => (d ? d.toISOString() : null);

  const DEFAULTS: Partial<FormInput> = useMemo(
    () => ({
      title: row.title ?? "",
      title_en: row.title_en ?? "",
      title_ar: row.title_ar ?? "",
      short_description: row.short_description ?? "",
      short_description_en: row.short_description_en ?? "",
      short_description_ar: row.short_description_ar ?? "",
      description: mdToHtml(row.description ?? ""),
      description_en: mdToHtml(row.description_en ?? ""),
      description_ar: mdToHtml(row.description_ar ?? ""),
      target_amount: row.target_amount ?? 1_000_000,
      collected_amount: row.collected_amount ?? 0,
      starts_at: row.starts_at ? new Date(row.starts_at) : null,
      ends_at: row.ends_at ? new Date(row.ends_at) : null,
      location: row.location ?? "",
      image_url: row.image_url ?? "",
      image_file: null,
      slug: row.slug ?? "",
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row.id]
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: DEFAULTS,
  });

  const title = useWatch({ control, name: "title" });
  const slug = useMemo(() => slugify(title ?? ""), [title]);

  const titles: Record<typeof status, string> = {
    success: "Program Updated",
    error: "Update Failed",
    loading: "Please wait",
    info: "Notice",
  };

  useEffect(() => {
    reset(DEFAULTS);
  }, [DEFAULTS, reset]);

  const handleInputChange = useCallback(
    (field: keyof FormInput, value: string | number | Date | null) => {
      setValue(field, value as any, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  const handleCancel = () => {
    reset(DEFAULTS);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = handleSubmit(async (data) => {
    setStatus("loading");
    setMessage("Updating donation program");
    setDialogOpen(true);

    try {
      let finalImageUrl: string = row.image_url ?? "";
      if (data.image_file) {
        const uploadedUrl = await uploadImageToSupabase(data.image_file, "program-images");
        finalImageUrl = uploadedUrl ?? "";
      }

      // Convert the HTML from the editor back to Markdown
      const mdDescription = turndown.turndown(data.description || "");
      const mdDescriptionEn = turndown.turndown(data.description_en || "");
      const mdDescriptionAr = turndown.turndown(data.description_ar || "");

      const payload = {
        title: data.title,
        title_en: data.title_en,
        title_ar: data.title_ar,
        slug: data.slug || slug,
        short_description: data.short_description,
        short_description_en: data.short_description_en,
        short_description_ar: data.short_description_ar,
        description: mdDescription,
        description_en: mdDescriptionEn,
        description_ar: mdDescriptionAr,
        target_amount: data.target_amount,
        collected_amount: data.collected_amount,
        starts_at: toIsoOrNull(data.starts_at ?? null),
        ends_at: toIsoOrNull(data.ends_at ?? null),
        location: data.location,
        image_url: finalImageUrl,
        status: row.status,
      };

      const { error: updateError } = await supabase.from("program_donation").update(payload).eq("id", row.id);

      if (updateError) throw updateError;

      setStatus("success");
      setMessage(
        <>
          <br />
          Your donation program <span className="font-medium">{data?.title ?? "Untitled"}</span> was updated.
          <br />
        </>
      );

      // keep latest values; clear file input
      reset({ ...data, image_file: null });
    } catch (err) {
      console.error("Error updating campaign:", err);
      setStatus("error");
      setMessage(
        <>
          We couldn’t update your program.
          <br />
          <span className="text-xs text-gray-500">
            Reason: {String((err as Error)?.message ?? err ?? "Unknown error")}
          </span>
        </>
      );
    }
  });

  return (
    <>
      <h2 className="text-2xl font-bold py-4">Form Update Program</h2>
      <form className="space-y-6 mb-24" onSubmit={onSubmit}>
        <FormTitleSection errors={errors} register={register} slug={slug} />
        <FormShortDescSection errors={errors} register={register} />
        <FormDescriptionSection errors={errors} control={control} />
        <FormFundingSection errors={errors} control={control} setValue={setValue} />
        <FormDurationSection control={control} handleInputChange={handleInputChange} errors={errors} />
        <FormAdditionalInfoSection register={register} control={control} errors={errors} setValue={setValue} />
        <div className="flex justify-end gap-4">
          <Button type="button" size="lg" variant="outline" className="w-full md:w-auto" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" size="lg" variant="default" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Update..." : "Update Donation Campaign"}
          </Button>
        </div>
      </form>

      {dialogOpen && (
        <StatusDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          type={status}
          title={titles[status]}
          description={message}
          primaryAction={{
            label: "View Program",
            onClick: () => {
              setDialogOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
          }}
          secondaryAction={{
            label: "View List Program",
            onClick: () => navigate(-1),
          }}
        />
      )}
    </>
  );
}
