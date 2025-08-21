import { useRef, useState } from "react";
import { useWatch } from "react-hook-form";

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { FormError } from "~/components/ui/formError";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

import { cn } from "~/lib/utils";

import { X } from "lucide-react";

import type { FormInput } from "../rules/validation-schema";

interface AdditionalInfoProps {
  register: any;
  errors: any;
  setValue: (name: keyof FormInput, value: any) => void;
  control: any;
}

const FormAdditionalInfoSection = ({ register, errors, setValue, control }: AdditionalInfoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const title = useWatch({ control, name: "title" });

  const imageUrl = useWatch({ control, name: "image_url" });

  const [imagePreview, setImagePreview] = useState<string | null>(imageUrl || null);

  const handleImageUpload = (file: File) => {
    const campaignTitle = title || "campaign";
    const extension = file.name.split(".").pop();
    const slugifiedTitle = campaignTitle.toLowerCase().replace(/\s+/g, "-");
    const newFileName = `${slugifiedTitle}.${extension}`;

    // Create a new File object with the renamed file
    const renamedFile = new File([file], newFileName, { type: file.type });

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setImagePreview(previewUrl);

      // Store renamed file instead of just base64
      setValue("image_url", renamedFile.name); // store just the name in form
      setValue("image_file", renamedFile); // store the actual file (for backend)
    };
    reader.readAsDataURL(renamedFile);
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("image_url", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>Location and media information for the campaign.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Field */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter Campaign location"
              aria-invalid={!!errors.location}
              className={cn(errors.location && "border-red-500")}
              {...register("location")}
            />
            <FormError name="location" errors={errors} />
          </div>

          {/* Campaign Image Upload */}
          <div className="space-y-2">
            <Label>Campaign Image</Label>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>

              {imagePreview && (
                <div className="relative">
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <img src={imagePreview} alt="Campaign preview" className="w-full h-48 object-cover" />
                    <div className="p-3 bg-white border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <div className="font-medium">Preview</div>
                          <div className="text-xs text-gray-500">{imageUrl?.split("/").pop() || "Selected Image"}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeImage}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormAdditionalInfoSection;
