"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import UploadButton from "@/components/UploadButton";
import LoadingOverlay from "@/components/LoadingOverlay";
import { uploadGameplay } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      await uploadGameplay(file);
      router.push("/character");
    } catch (error) {
      console.error("Gameplay upload failed", error);
      setUploading(false);
      alert("Upload failed. Check GEMINI_API_KEY and try again.");
    }
  }

  if (uploading) return <LoadingOverlay message="Uploading gameplay..." />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-6xl flex-col items-center gap-16 lg:flex-row lg:items-center lg:gap-20">
        {/* left: hero video */}
        <div className="animate-fade-up flex-1">
          <HeroSection />
        </div>

        {/* right: tagline + upload */}
        <div className="flex max-w-md flex-col items-start" style={{ animationDelay: "0.15s" }}>
          <h1
            className="animate-fade-up font-display text-5xl font-800 leading-[1.1] tracking-tight lg:text-6xl"
          >
            Gameplay in.
            <br />
            <span className="text-accent">Reels out.</span>
          </h1>
          <p
            className="animate-fade-up mt-5 text-lg leading-relaxed text-muted"
            style={{ animationDelay: "0.25s" }}
          >
            Upload your gameplay footage and generate custom AI commentary
            with unique character voices.
          </p>
          <div
            className="animate-fade-up mt-6"
            style={{ animationDelay: "0.35s" }}
          >
            <UploadButton onUpload={handleUpload} />
          </div>
          <Link
            href="/character"
            className="animate-fade-up mt-2 font-display text-sm font-medium text-muted transition-colors hover:text-accent"
            style={{ animationDelay: "0.45s" }}
          >
            or meet the voices <span className="text-accent">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
