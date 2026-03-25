// "use client"

// import { useState } from "react"
// import { Controller, useFieldArray, useFormContext } from "react-hook-form"
// import { format } from "date-fns"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Field,
//   FieldContent,
//   FieldError,
//   FieldLabel,
// } from "@/components/ui/field"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// import RichTextEditor from "@/components/common/rich-text-editor"
// import { CalendarPopover } from "@/components/common/calendar-popover"
// import {
//   Timeline,
//   TimelineConnector,
//   TimelineTitle,
//   TimelineItem,
//   TimelineTime,
//   TimelineContent,
//   TimelineDescription,
// } from "@/components/common/timeline"

// import type {
//   ProgramDonationFormData,
//   ProgramTimelineRow,
// } from "../program.schemas"
// import { formatRupiah } from "@/lib/format"
// import { ChevronUp, Pencil, Plus, Trash2 } from "lucide-react"

// const EMPTY_TIMELINE_ROW: ProgramTimelineRow = {
//   date: new Date().toISOString().slice(0, 10),
//   activity: "",
//   activity_en: "",
//   activity_ar: "",
//   cost: "",
//   description: "",
// }

// export default function ProgramTimelineEditor() {
//   const { control, formState } = useFormContext<ProgramDonationFormData>()
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "program_timeline",
//   })
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

//   return (
//     <div>
//       <div className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <h2 className="text-lg font-bold">Timeline Program</h2>
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={() => {
//             append(EMPTY_TIMELINE_ROW)
//             setExpandedIndex(fields.length)
//           }}
//         >
//           <Plus className="size-4 mr-1" />
//           Tambah timeline
//         </Button>
//       </div>
//       <div>
//         {fields.length === 0 ? (
//           <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
//             <p className="text-sm">Belum ada timeline</p>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               className="mt-3"
//               onClick={() => {
//                 append(EMPTY_TIMELINE_ROW)
//                 setExpandedIndex(0)
//               }}
//             >
//               <Plus className="size-4 mr-1" />
//               Tambah timeline
//             </Button>
//           </div>
//         ) : (
//           <Timeline>
//             {fields.map((field, index) => (
//               <TimelineRow
//                 key={field.id}
//                 index={index}
//                 isLast={index === fields.length - 1}
//                 isExpanded={expandedIndex === index}
//                 onToggleExpand={() =>
//                   setExpandedIndex(expandedIndex === index ? null : index)
//                 }
//                 onRemove={() => {
//                   remove(index)
//                   setExpandedIndex(null)
//                 }}
//               />
//             ))}
//           </Timeline>
//         )}
//         {formState.errors.program_timeline?.root && (
//           <FieldError
//             errors={[
//               formState.errors.program_timeline.root as { message?: string },
//             ]}
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// interface TimelineRowProps {
//   index: number
//   isLast: boolean
//   isExpanded: boolean
//   onToggleExpand: () => void
//   onRemove: () => void
// }

// function TimelineRow({
//   index,
//   isLast,
//   isExpanded,
//   onToggleExpand,
//   onRemove,
// }: TimelineRowProps) {
//   const { control, watch, formState } =
//     useFormContext<ProgramDonationFormData>()
//   const rowErrors = formState.errors.program_timeline?.[index]
//   const date = watch(`program_timeline.${index}.date`)
//   const activity = watch(`program_timeline.${index}.activity`)

//   const displayDate = date
//     ? format(new Date(date + "T00:00:00"), "dd MMM yyyy")
//     : "—"
//   const displayTitle = activity || "(Belum ada judul)"

//   return (
//     <TimelineItem last={isLast} status="upcoming">
//       <TimelineConnector status="upcoming">
//         <span className="text-xs font-medium">{index + 1}</span>
//       </TimelineConnector>
//       <TimelineContent>
//         <div className="flex items-start justify-between gap-2">
//           <div className="min-w-0 flex-1">
//             <TimelineTime>{displayDate}</TimelineTime>
//             <TimelineTitle>{displayTitle}</TimelineTitle>
//             {!isExpanded && (
//               <TimelineDescription>
//                 Klik Edit untuk mengubah detail timeline
//               </TimelineDescription>
//             )}
//           </div>
//           <div className="flex shrink-0 gap-1">
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               className="size-8"
//               onClick={onToggleExpand}
//               aria-label={isExpanded ? "Tutup" : "Edit"}
//             >
//               {isExpanded ? (
//                 <ChevronUp className="size-4" />
//               ) : (
//                 <Pencil className="size-4" />
//               )}
//             </Button>
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               className="size-8 text-destructive hover:text-destructive"
//               onClick={onRemove}
//               aria-label="Hapus"
//             >
//               <Trash2 className="size-4" />
//             </Button>
//           </div>
//         </div>

//         {isExpanded && (
//           <div className="mt-4 space-y-4 rounded-lg border bg-muted/30 p-4">
//             <Field>
//               <FieldLabel>Tanggal</FieldLabel>
//               <FieldContent>
//                 <Controller
//                   name={`program_timeline.${index}.date`}
//                   control={control}
//                   render={({ field }) => (
//                     <CalendarPopover
//                       value={field.value}
//                       onChange={d =>
//                         field.onChange(d ? format(d, "yyyy-MM-dd") : "")
//                       }
//                       placeholder="Pilih tanggal"
//                     />
//                   )}
//                 />
//               </FieldContent>
//             </Field>

//             <Field>
//               <FieldLabel>
//                 Judul Kegiatan (ID / EN / AR){" "}
//                 <span className="text-red-500">*</span>
//               </FieldLabel>
//               <FieldContent>
//                 <Tabs defaultValue="id" className="w-full">
//                   <TabsList>
//                     <TabsTrigger value="id">ID</TabsTrigger>
//                     <TabsTrigger value="en">EN</TabsTrigger>
//                     <TabsTrigger value="ar">AR</TabsTrigger>
//                   </TabsList>
//                   <TabsContent value="id">
//                     <Input
//                       {...control.register(
//                         `program_timeline.${index}.activity` as const
//                       )}
//                       placeholder="Judul dalam Bahasa Indonesia"
//                       aria-invalid={!!rowErrors?.activity}
//                     />
//                   </TabsContent>
//                   <TabsContent value="en">
//                     <Input
//                       {...control.register(
//                         `program_timeline.${index}.activity_en` as const
//                       )}
//                       placeholder="Activity title in English"
//                       aria-invalid={!!rowErrors?.activity_en}
//                     />
//                   </TabsContent>
//                   <TabsContent value="ar">
//                     <Input
//                       {...control.register(
//                         `program_timeline.${index}.activity_ar` as const
//                       )}
//                       placeholder="عنوان النشاط بالعربية"
//                       dir="rtl"
//                       aria-invalid={!!rowErrors?.activity_ar}
//                     />
//                   </TabsContent>
//                 </Tabs>
//                 <FieldError
//                   errors={[
//                     rowErrors?.activity,
//                     rowErrors?.activity_en,
//                     rowErrors?.activity_ar,
//                   ]}
//                 />
//               </FieldContent>
//             </Field>

//             <Field>
//               <FieldLabel>
//                 Biaya (Rp) <span className="text-red-500">*</span>
//               </FieldLabel>
//               <FieldContent>
//                 <Controller
//                   name={`program_timeline.${index}.cost`}
//                   control={control}
//                   render={({ field }) => (
//                     <div className="space-y-1">
//                       <Input
//                         type="number"
//                         {...field}
//                         placeholder="0"
//                         onChange={e => field.onChange(e.target.value)}
//                         aria-invalid={!!rowErrors?.cost}
//                       />
//                       {field.value && (
//                         <p className="text-xs text-muted-foreground">
//                           {formatRupiah(Number(field.value) || 0)}
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 />
//                 <FieldError errors={[rowErrors?.cost]} />
//               </FieldContent>
//             </Field>

//             <Field>
//               <FieldLabel>
//                 Deskripsi <span className="text-red-500">*</span>
//               </FieldLabel>
//               <FieldContent>
//                 <Controller
//                   name={`program_timeline.${index}.description`}
//                   control={control}
//                   render={({ field }) => (
//                     <RichTextEditor
//                       value={field.value ?? ""}
//                       onChange={field.onChange}
//                       placeholder="Masukkan deskripsi kegiatan..."
//                       aria-invalid={!!rowErrors?.description}
//                     />
//                   )}
//                 />
//                 <FieldError errors={[rowErrors?.description]} />
//               </FieldContent>
//             </Field>
//           </div>
//         )}
//       </TimelineContent>
//     </TimelineItem>
//   )
// }
