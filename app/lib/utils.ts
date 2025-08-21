import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | null) => {
  if (!date) return "Select date";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export async function uploadImageToSupabase(
  file: File | undefined | null,
  storageName: string
): Promise<string | null> {
  if (!file) return null;

  // Use a deterministic but collision-resistant path
  const path = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from(storageName).upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(storageName).getPublicUrl(path);
  return urlData?.publicUrl ?? null;
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-");
