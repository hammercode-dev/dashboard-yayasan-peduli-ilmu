"use client"

import React, { useState, useRef, useMemo } from "react"
import { Upload, FileText, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useCreateDonationBulkMutation } from "../donation.api"

import { useGetProgramDonationsQuery } from "@/features/program/program.api"
import { useGetDonationEvidencesQuery } from "../donation.api"

type Step = "upload" | "confirm" | "processing" | "success"

interface BulkImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BulkImportModal({ isOpen, onClose }: BulkImportModalProps) {
  const [step, setStep] = useState<Step>("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [createDonationBulk, { isLoading }] = useCreateDonationBulkMutation()

  const isValidCSV = (file: File) => {
    return file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")
  }

  const resetState = () => {
    setStep("upload")
    setSelectedFile(null)
    setIsDragOver(false)
    setErrorMessage(null)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setErrorMessage(null)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    if (!isValidCSV(file)) {
      setErrorMessage("File harus berformat .csv")
      return
    }

    setSelectedFile(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isValidCSV(file)) {
      setErrorMessage("File harus berformat .csv")
      return
    }

    setSelectedFile(file)
  }

  const params = useMemo(
    () => ({
      query: "",
      page: 1,
      status: "all",
    }),
    []
  )

  const { refetch } = useGetDonationEvidencesQuery(params, {
    refetchOnMountOrArgChange: true,
  })

  const { refetch: refetchPrograms } = useGetProgramDonationsQuery(params, {
    refetchOnMountOrArgChange: true,
  })

  const handleStartImport = async () => {
    if (!selectedFile) {
      setErrorMessage("Silakan pilih file terlebih dahulu")
      return
    }

    try {
      setErrorMessage(null)
      setStep("processing")

      const formData = new FormData()
      formData.append("file", selectedFile)

      await createDonationBulk(formData).unwrap()

      await refetch()
      await refetchPrograms()

      setStep("success")
    } catch (error: any) {
      console.log("Status:", error.status)
      console.log("Data dari Server:", error.data)

      const message = error?.data?.message || "Gagal mengimpor data"
      setErrorMessage(message)
      setStep("confirm")
    }
  }

  const downloadTemplate = () => {
    const template =
      "full_name,email,phone_number,amount,payment_method,program_id,evidence_url,donation_upload_at,description\n" +
      "John Doe,john@example.com,08123456789,100000,bsi,91,https://uegsbnqzpdfvntuiuold.supabase.co/storage/v1/object/public/donation-evidence/Screenshot%202026-02-19%20at%2014.22.22.png,2023-10-10,Bukti transfer donasi\n"

    const blob = new Blob([template], {
      type: "text/csv;charset=utf-8;",
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "template_impor_donasi.csv"
    a.click()

    URL.revokeObjectURL(url)
  }

  const STEP_TITLE = {
    upload: "Impor Donasi",
    confirm: "Konfirmasi Impor",
    processing: "Sedang Diproses...",
    success: "Impor Berhasil",
  }

  const STEP_DESCRIPTION = {
    upload: "Unggah file CSV untuk mengimpor data donasi secara massal.",
    confirm: "Pastikan file yang dipilih sudah benar sebelum memulai impor.",
    processing: "Mohon tunggu sementara sistem memproses data Anda.",
    success: "Data donasi berhasil diimpor ke dalam sistem.",
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{STEP_TITLE[step]}</DialogTitle>

          <DialogDescription>{STEP_DESCRIPTION[step]}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* ================= UPLOAD STEP ================= */}
          {step === "upload" && (
            <>
              <div
                onDragOver={e => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                )}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">Seret dan lepas file CSV di sini</p>
                <p className="text-sm text-muted-foreground">
                  atau klik untuk memilih file
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFile && (
                <div className="flex items-center gap-3 p-3 border rounded-md bg-secondary/50">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1 truncate text-sm italic">
                    {selectedFile.name}
                  </div>
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              )}

              <Button
                variant="link"
                size="sm"
                onClick={downloadTemplate}
                className="w-full"
              >
                Unduh Template CSV
              </Button>

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Batal
                </Button>

                <Button
                  disabled={!selectedFile}
                  onClick={() => setStep("confirm")}
                  className="flex-1"
                >
                  Lanjut
                </Button>
              </div>
            </>
          )}

          {/* ================= CONFIRM STEP ================= */}
          {step === "confirm" && (
            <>
              <div className="rounded-lg bg-secondary p-4 text-sm">
                <p>
                  <strong>File:</strong> {selectedFile?.name}
                </p>
                <p>
                  <strong>Status:</strong> Siap untuk diproses.
                </p>
              </div>

              {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("upload")}
                  className="flex-1"
                >
                  Kembali
                </Button>

                <Button
                  onClick={handleStartImport}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Mulai Impor"
                  )}
                </Button>
              </div>
            </>
          )}

          {/* ================= PROCESSING STEP ================= */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm animate-pulse">
                Mengunggah dan memproses data...
              </p>
            </div>
          )}

          {/* ================= SUCCESS STEP ================= */}
          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>

              <Button onClick={handleClose} className="w-full">
                Selesai
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
