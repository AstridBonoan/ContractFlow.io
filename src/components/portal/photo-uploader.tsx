"use client";

import { useCallback, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function PhotoUploader({ files, onChange }: PhotoUploaderProps) {
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
      onChange([...files, ...list].slice(0, 10));
    },
    [files, onChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
          dragging
            ? "border-amber-500 bg-amber-50"
            : "border-slate-300 bg-slate-50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="photo-upload"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <label htmlFor="photo-upload" className="flex cursor-pointer flex-col items-center">
          <ImagePlus className="h-10 w-10 text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700">
            Drag & drop photos here, or click to browse
          </p>
          <p className="text-xs text-slate-500">Up to 10 images (stored in Supabase when configured)</p>
        </label>
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {files.map((file, i) => (
            <div key={`${file.name}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
