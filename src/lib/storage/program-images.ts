import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

export const PROGRAM_IMAGES_BUCKET = "program-images"
export const PROGRAM_IMAGE_MAX_BYTES = 500 * 1024 // 500KB
export const PROGRAM_IMAGE_UPLOAD_PREFIX = "uploads/"

type ValidationResult = { ok: true } | { ok: false; message: string }

type UploadResult =
  | { ok: true; path: string; publicUrl: string }
  | { ok: false; message: string }

export function validateProgramImageFile(file: File): ValidationResult {
  if (file.size > PROGRAM_IMAGE_MAX_BYTES) {
    return {
      ok: false,
      message: "Ukuran file terlalu besar. Maksimum 500KB.",
    }
  }

  if (!file.type.startsWith("image/")) {
    return {
      ok: false,
      message: "File harus berupa gambar",
    }
  }

  return { ok: true }
}

export async function uploadProgramImage(file: File): Promise<UploadResult> {
  try {
    const supabase = createClient()

    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${PROGRAM_IMAGE_UPLOAD_PREFIX}${fileName}`

    const { data, error } = await supabase.storage
      .from(PROGRAM_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      return {
        ok: false,
        message: `Gagal upload: ${error.message}`,
      }
    }

    const { data: urlData } = supabase.storage
      .from(PROGRAM_IMAGES_BUCKET)
      .getPublicUrl(data.path)

    return {
      ok: true,
      path: data.path,
      publicUrl: urlData.publicUrl,
    }
  } catch (err) {
    console.error("Upload error:", err)
    return {
      ok: false,
      message: "Terjadi kesalahan saat upload gambar",
    }
  }
}

export async function removeProgramImagesByPaths(
  paths: string[]
): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase.storage
      .from(PROGRAM_IMAGES_BUCKET)
      .remove(paths)

    if (error) {
      console.error("Failed to delete image:", error)
    }
  } catch (err) {
    console.error("Delete error:", err)
  }
}
