"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { format } from "date-fns"
import {
  Controller,
  FormProvider,
  useForm,
  useFieldArray,
  useFormContext,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import RichTextEditor from "@/components/common/rich-text-editor"
import { CalendarPopover } from "@/components/common/calendar-popover"
import {
  Timeline,
  TimelineConnector,
  TimelineTitle,
  TimelineItem,
  TimelineTime,
  TimelineContent,
  TimelineDescription,
} from "@/components/common/timeline"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

import { formatRupiah } from "@/lib/format"
import { parseDateToString } from "@/lib/date"
import { ChevronUp, Loader2, Pencil, Save, Trash2 } from "lucide-react"
import {
  useCreateTimelineItemMutation,
  useUpdateTimelineItemMutation,
  useDeleteTimelineItemMutation,
} from "../timeline.api"
import { timelineFormSchema, type TimelineFormData } from "../timeline.schemas"
import { toast } from "sonner"

export interface TimelineEditorItem {
  id: string
  created_at?: string
  date?: string | null
  activity?: string | null
  activity_en?: string | null
  activity_ar?: string | null
  cost?: string | null
  description?: string | null
  program_id?: string | null
}

function toFormRow(
  item: TimelineEditorItem
): TimelineFormData["timeline"][number] {
  return {
    id: item.id,
    date: parseDateToString(item.date) || format(new Date(), "yyyy-MM-dd"),
    activity: item.activity ?? "",
    activity_en: item.activity_en ?? "",
    activity_ar: item.activity_ar ?? "",
    cost: item.cost ?? "",
    description: item.description ?? "",
  }
}

interface TimelineEditorProps {
  items: TimelineEditorItem[]
  programId: number
  pendingExpandIndex?: number | null
  onExpandApplied?: () => void
  onDraftSaved?: (draftId: string) => void
  onDraftRemoved?: (draftId: string) => void
}

export default function TimelineEditor({
  items,
  programId,
  pendingExpandIndex = null,
  onExpandApplied,
  onDraftSaved,
  onDraftRemoved,
}: TimelineEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{
    index: number
    itemId: string
    activity: string
  } | null>(null)

  const [deleteTimelineItem, { isLoading: isDeleting }] =
    useDeleteTimelineItemMutation()

  const methods = useForm<TimelineFormData>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: {
      timeline: items.map(toFormRow),
    },
    mode: "onChange",
  })

  const { control, reset, getValues, trigger } = methods
  const { fields, remove } = useFieldArray({
    control,
    name: "timeline",
  })
  const prevItemsKey = useRef<string>("")

  useEffect(() => {
    const itemsKey = items.map(i => i.id).join(",")
    if (prevItemsKey.current !== itemsKey) {
      prevItemsKey.current = itemsKey
      reset({ timeline: items.map(toFormRow) })
    }
  }, [items, reset])

  useEffect(() => {
    if (pendingExpandIndex != null && pendingExpandIndex < items.length) {
      setExpandedIndex(pendingExpandIndex)
      const timer = setTimeout(() => onExpandApplied?.(), 300)
      return () => clearTimeout(timer)
    }
  }, [pendingExpandIndex, items.length, onExpandApplied])

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteTimelineItem({
        id: deleteTarget.itemId,
        programId,
      }).unwrap()
      remove(deleteTarget.index)
      setExpandedIndex(null)
      toast.success("Timeline berhasil dihapus")
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Gagal menghapus timeline"
      toast.error(message)
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <FormProvider {...methods}>
      <Timeline>
        {fields.map((field, index) => (
          <TimelineEditorRow
            key={field.id}
            index={index}
            isLast={index === fields.length - 1}
            isExpanded={expandedIndex === index}
            shouldAutoFocus={pendingExpandIndex === index}
            programId={programId}
            onToggleExpand={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
            onSave={async () => {
              const isValid = await trigger(`timeline.${index}`)
              if (!isValid) return
              const row = getValues(`timeline.${index}`)
              return { row, index }
            }}
            onRemove={() => {
              remove(index)
              setExpandedIndex(null)
            }}
            onRequestDelete={(idx, itemId, activity) =>
              setDeleteTarget({ index: idx, itemId, activity })
            }
            onDraftSaved={onDraftSaved}
            onDraftRemoved={onDraftRemoved}
            isDeleting={!!deleteTarget && deleteTarget.index === index}
          />
        ))}
      </Timeline>

      <ConfirmDialog
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
        title="Konfirmasi Hapus"
        confirmText="Hapus"
        description={
          deleteTarget && (
            <>
              Apakah Anda yakin ingin menghapus timeline{" "}
              <span className="font-semibold">{deleteTarget.activity}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </>
          )
        }
      />
    </FormProvider>
  )
}

interface TimelineEditorRowProps {
  index: number
  isLast: boolean
  isExpanded: boolean
  shouldAutoFocus?: boolean
  programId: number
  onToggleExpand: () => void
  onSave: () => Promise<{
    row: TimelineFormData["timeline"][number]
    index: number
  } | void>
  onRemove: () => void
  onRequestDelete: (index: number, itemId: string, activity: string) => void
  onDraftSaved?: (draftId: string) => void
  onDraftRemoved?: (draftId: string) => void
  isDeleting?: boolean
}

function TimelineEditorRow({
  index,
  isLast,
  isExpanded,
  shouldAutoFocus = false,
  programId,
  onToggleExpand,
  onSave,
  onRemove,
  onRequestDelete,
  onDraftSaved,
  onDraftRemoved,
  isDeleting = false,
}: TimelineEditorRowProps) {
  const firstInputRef = useRef<HTMLInputElement>(null)
  const { control, watch, formState } = useFormContext<TimelineFormData>()
  const rowErrors = formState.errors.timeline?.[index]
  const date = watch(`timeline.${index}.date`)
  const activity = watch(`timeline.${index}.activity`)
  const activityEn = watch(`timeline.${index}.activity_en`)
  const cost = watch(`timeline.${index}.cost`)
  const description = watch(`timeline.${index}.description`)
  const itemId = watch(`timeline.${index}.id`)
  const { ref: activityRef, ...activityRegister } = control.register(
    `timeline.${index}.activity` as const
  )

  useEffect(() => {
    if (isExpanded && shouldAutoFocus) {
      const timer = setTimeout(() => {
        const el = firstInputRef.current
        if (el) {
          el.focus()
        }
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isExpanded, shouldAutoFocus])

  const isDraft = typeof itemId === "string" && itemId.startsWith("draft-")

  const [createTimelineItem, { isLoading: isCreating }] =
    useCreateTimelineItemMutation()
  const [updateTimelineItem, { isLoading: isUpdating }] =
    useUpdateTimelineItemMutation()

  const isSaving = isCreating || isUpdating

  const displayDate = date
    ? format(new Date(date + "T00:00:00"), "dd MMM yyyy")
    : "—"
  const displayTitle = activity || activityEn || "(Belum ada judul)"
  const displayDesc =
    description || cost
      ? [description, cost ? formatRupiah(Number(cost) || 0) : null]
          .filter(Boolean)
          .join(" • ") || "Klik Edit untuk mengubah detail timeline"
      : "Klik Edit untuk mengubah detail timeline"

  const handleSave = useCallback(async () => {
    const result = await onSave()
    if (!result) return
    const { row } = result

    if (isDraft) {
      try {
        const res = await createTimelineItem({
          program_id: programId,
          date: row.date,
          activity: row.activity,
          activity_en: row.activity_en,
          activity_ar: row.activity_ar,
          cost: row.cost,
          description: row.description,
        }).unwrap()
        onRemove()
        onDraftSaved?.(row.id)
        toast.success(res.message || "Timeline berhasil disimpan")
      } catch (err) {
        const message =
          err && typeof err === "object" && "data" in err
            ? (err as { data?: { message?: string } }).data?.message
            : "Gagal menyimpan"
        toast.error(message)
      }
    } else {
      try {
        const res = await updateTimelineItem({
          id: row.id,
          programId,
          date: row.date,
          activity: row.activity,
          activity_en: row.activity_en,
          activity_ar: row.activity_ar,
          cost: row.cost,
          description: row.description,
        }).unwrap()
        toast.success(res.message || "Timeline berhasil diperbarui")
      } catch (err) {
        const message =
          err && typeof err === "object" && "data" in err
            ? (err as { data?: { message?: string } }).data?.message
            : "Gagal menyimpan timeline"
        toast.error(message)
      }
    }
  }, [
    isDraft,
    programId,
    onSave,
    onRemove,
    onDraftSaved,
    createTimelineItem,
    updateTimelineItem,
  ])

  const handleDelete = useCallback(() => {
    if (isDraft) {
      onDraftRemoved?.(itemId)
      onRemove()
      return
    }
    onRequestDelete(index, itemId, displayTitle)
  }, [
    isDraft,
    itemId,
    index,
    displayTitle,
    onDraftRemoved,
    onRemove,
    onRequestDelete,
  ])

  return (
    <TimelineItem last={isLast} status="upcoming">
      <TimelineConnector status="upcoming">
        <span className="text-xs font-medium">{index + 1}</span>
      </TimelineConnector>
      <TimelineContent>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <TimelineTime>{displayDate}</TimelineTime>
            <TimelineTitle>{displayTitle}</TimelineTitle>
            {!isExpanded && (
              <TimelineDescription>{displayDesc}</TimelineDescription>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-green-600 hover:text-green-700 hover:bg-green-500/10"
              onClick={onToggleExpand}
              disabled={isDeleting}
              aria-label={isExpanded ? "Tutup" : "Edit"}
            >
              {isExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <Pencil className="size-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-red-600 hover:bg-red-500/10"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="Hapus"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
              <Field>
                <FieldLabel>
                  Tanggal <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Controller
                    name={`timeline.${index}.date`}
                    control={control}
                    render={({ field }) => (
                      <CalendarPopover
                        value={field.value}
                        onChange={d =>
                          field.onChange(d ? format(d, "yyyy-MM-dd") : "")
                        }
                        placeholder="Pilih tanggal"
                      />
                    )}
                  />
                </FieldContent>
                {rowErrors?.date && <FieldError errors={[rowErrors.date]} />}
              </Field>

              <Field>
                <FieldLabel>
                  Judul Kegiatan (ID / EN / AR){" "}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Tabs defaultValue="id" className="w-full">
                    <TabsList>
                      <TabsTrigger value="id">ID</TabsTrigger>
                      <TabsTrigger value="en">EN</TabsTrigger>
                      <TabsTrigger value="ar">AR</TabsTrigger>
                    </TabsList>
                    <TabsContent value="id">
                      <Input
                        {...activityRegister}
                        ref={el => {
                          firstInputRef.current = el
                          activityRef(el)
                        }}
                        placeholder="Judul dalam Bahasa Indonesia"
                        aria-invalid={!!rowErrors?.activity}
                      />
                    </TabsContent>
                    <TabsContent value="en">
                      <Input
                        {...control.register(
                          `timeline.${index}.activity_en` as const
                        )}
                        placeholder="Activity title in English"
                        aria-invalid={!!rowErrors?.activity_en}
                      />
                    </TabsContent>
                    <TabsContent value="ar">
                      <Input
                        {...control.register(
                          `timeline.${index}.activity_ar` as const
                        )}
                        placeholder="عنوان النشاط بالعربية"
                        dir="rtl"
                        aria-invalid={!!rowErrors?.activity_ar}
                      />
                    </TabsContent>
                  </Tabs>
                </FieldContent>
                <FieldError
                  errors={[
                    rowErrors?.activity,
                    rowErrors?.activity_en,
                    rowErrors?.activity_ar,
                  ]}
                />
              </Field>

              <Field>
                <FieldLabel>
                  Biaya (Rp) <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Controller
                    name={`timeline.${index}.cost`}
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-1">
                        <Input
                          type="number"
                          {...field}
                          placeholder="0"
                          onChange={e => field.onChange(e.target.value)}
                          aria-invalid={!!rowErrors?.cost}
                        />
                        {field.value && (
                          <p className="text-xs text-muted-foreground">
                            {formatRupiah(Number(field.value) || 0)}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </FieldContent>
                {rowErrors?.cost && <FieldError errors={[rowErrors.cost]} />}
              </Field>

              <Field>
                <FieldLabel>
                  Deskripsi <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Controller
                    name={`timeline.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Masukkan deskripsi kegiatan..."
                        aria-invalid={!!rowErrors?.description}
                      />
                    )}
                  />
                </FieldContent>
                {rowErrors?.description && (
                  <FieldError errors={[rowErrors.description]} />
                )}
              </Field>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <Save className="size-4 mr-2" />
                )}
                Simpan
              </Button>
            </div>
          </div>
        )}
      </TimelineContent>
    </TimelineItem>
  )
}
