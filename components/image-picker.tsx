'use client';

import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

export function ImagePicker({
  label = 'Add image',
  onChange
}: {
  label?: string;
  onChange: (file: File | null, previewUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0] || null;
          if (!file) {
            setPreview(null);
            onChange(null, null);
            return;
          }
          const url = URL.createObjectURL(file);
          setPreview(url);
          onChange(file, url);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        <ImagePlus size={16} />
        {label}
      </button>
      {preview ? (
        <div className="relative overflow-hidden rounded-3xl border bg-slate-50 p-2">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white p-2 shadow"
            onClick={() => {
              setPreview(null);
              onChange(null, null);
              if (inputRef.current) inputRef.current.value = '';
            }}
          >
            <X size={14} />
          </button>
          <img src={preview} alt="Preview" className="max-h-72 w-full rounded-2xl object-cover" />
        </div>
      ) : null}
    </div>
  );
}
