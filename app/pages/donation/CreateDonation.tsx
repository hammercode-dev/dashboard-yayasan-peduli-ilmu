import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "~/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "~/lib/supabase";

// import { SimpleEditor } from "~/components/editor/tiptap-templates/simple/simple-editor";
// import type { Editor } from "@tiptap/react";

import TurndownService from "turndown";

// import Tiptap from "~/components/ui/tiptap/tiptap";

export default function CreateProgramDonation() {
  const navigate = useNavigate();
  const turndownService = new TurndownService();

  const initialData = {
    title: "",
    slug: "",
    short_description: "",
    description: "hello there",
    title_en: "",
    short_description_en: "",
    description_en: "",
    title_ar: "",
    short_description_ar: "",
    description_ar: "",
    imageFile: "",
    previewImageUrl: "",
    target_amount: "",
    starts_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    ends_at: "",
    location: "",
  };

  const [form, setForm] = useState(initialData);
  // const editorRef = useRef<Editor | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  useEffect(() => {
    const slug = form.title.toLowerCase().replace(/\s+/g, "-");
    setForm((prev) => ({ ...prev, slug }));
  }, [form.title]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "imageFile" && files) {
      const file = files[0];
      setForm({
        ...form,
        imageFile: file,
        previewImageUrl: URL.createObjectURL(file),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let image_url: string | null = null;

      if (form.imageFile) {
        const fileExt = form.imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from("program-images")
          .upload(fileName, form.imageFile);

        if (uploadError) {
          console.error("Image upload failed:", uploadError.message);
          return;
        }

        image_url = data?.path ?? null;
      }

      // const description = editorRef.current?.getHTML() ?? ""; // Or getJSON()

      const newData = {
        title: form.title,
        slug: form.slug,
        short_description: form.short_description,
        // description,
        description: turndownService.turndown(form.description),
        title_en: form.title_en,
        short_description_en: form.short_description_en,
        description_en: form.description_en,
        title_ar: form.title_ar,
        short_description_ar: form.short_description_ar,
        description_ar: form.description_ar,
        image_url,
        target_amount: parseFloat(form.target_amount),
        collected_amount: 0,
        status: "active",
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        location: form.location,
      };

      // const { error: insertError } = await supabase.from("program_donation").insert(newData);

      // if (insertError) {
      //   console.error("Error inserting data:", insertError.message);
      //   return;
      // }

      console.log({ newData });

      // setSubmittedData(newData);
      // setShowSuccessModal(true);
      // setForm(initialData);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="title_en">Title (English)</Label>
              <Input name="title_en" value={form.title_en} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="title_ar">Title (Arabic)</Label>
              <Input name="title_ar" value={form.title_ar} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input name="slug" value={form.slug} onChange={handleChange} disabled />
            </div>

            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea name="short_description" value={form.short_description} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="short_description_en">Short Description (English)</Label>
              <Textarea
                name="short_description_en"
                value={form.short_description_en}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="short_description_ar">Short Description (Arabic)</Label>
              <Textarea
                name="short_description_ar"
                value={form.short_description_ar}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              {/* <Textarea name="description" value={form.description} onChange={handleChange} required /> */}
              <Card className="p-2">
                {/* <SimpleEditor
                  name="description"
                  value={form.description}
                  onChange={(html) => setForm((prev) => ({ ...prev, description: html }))}
                /> */}
              </Card>
            </div>

            <div>
              <Label htmlFor="description_en">Description (English)</Label>
              {/* <Textarea name="description_en" value={form.description_en} onChange={handleChange} required /> */}
              <Card className="p-2">{/* <SimpleEditor /> */}</Card>
            </div>

            <div>
              <Label htmlFor="description_ar">Description (Arabic)</Label>
              <Textarea name="description_ar" value={form.description_ar} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="target_amount">Target Amount</Label>
              <Input type="number" name="target_amount" value={form.target_amount} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input name="location" value={form.location} onChange={handleChange} required />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="starts_at">Start Date</Label>
                <Input type="datetime-local" name="starts_at" value={form.starts_at} onChange={handleChange} required />
              </div>
              <div className="flex-1">
                <Label htmlFor="ends_at">End Date</Label>
                <Input type="datetime-local" name="ends_at" value={form.ends_at} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="imageFile">Image Upload</Label>
              <Input type="file" name="imageFile" accept="image/*" onChange={handleChange} />
              {form.previewImageUrl && (
                <img
                  src={form.previewImageUrl}
                  alt="Preview"
                  className="mt-2 rounded-md w-full max-h-64 object-cover"
                />
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Donation Program"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="animate-fade-in shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={24} />
              <DialogTitle className="text-green-600">Program Created Successfully</DialogTitle>
            </div>
          </DialogHeader>
          <div className="mt-2 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Title:</strong> {submittedData?.title}
            </p>
            <p>
              <strong>Target:</strong> {submittedData?.target_amount?.toLocaleString()} IDR
            </p>
            <p>
              <strong>Location:</strong> {submittedData?.location}
            </p>
            {submittedData?.starts_at && (
              <p>
                <strong>Starts:</strong> {new Date(submittedData.starts_at).toLocaleString()}
              </p>
            )}
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowSuccessModal(false);
              }}
            >
              Create Another
            </Button>
            <Button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/donation");
              }}
            >
              Go to List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
