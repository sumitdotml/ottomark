"use client";

import { useRef } from "react";

interface UploadButtonProps {
  onUpload: (file: File) => Promise<void> | void;
}

export default function UploadButton({ onUpload }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void onUpload(file);
          }
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-accent px-8 py-4 font-display text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
      >
        <span className="relative z-10">Upload Gameplay Video</span>
        <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
      </button>
      <p className="mt-3 text-sm text-muted">
        MP4, MOV, or WebM — any length
      </p>
    </>
  );
}
