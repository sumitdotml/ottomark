# TikTok/Reel-Style Results Page with Gemini Thumbnails

## Context

The results page currently shows 3 video cards as colored `<div>` placeholders in 16:9 aspect ratio. The goal is a vertical reel aesthetic (TikTok/Instagram), playable + downloadable videos, and AI-generated thumbnails via Gemini's image generation API ("Nanobanana"). All 3 cards play the same video (the uploaded gameplay as a stand-in), but each gets a unique thumbnail style.

## Files to Change

| File | Action |
|------|--------|
| `ui/lib/types.ts` | Extend `VideoResult` with `thumbnailUrl?` and `videoUrl?` |
| `ui/lib/constants.ts` | Relabel placeholders to "Sample 1/2/3" |
| `ui/app/api/gemini/thumbnail/route.ts` | **New** — Gemini image generation endpoint |
| `ui/lib/api.ts` | Store blob URL at upload, add thumbnail step, fix `buildCharacterProfile` |
| `ui/components/VideoCard.tsx` | Rewrite to 9:16 reel card with `<video>` + thumbnail poster |
| `ui/app/results/page.tsx` | Flex layout for 3 vertical cards |

## 1. Extend `VideoResult` type

**File:** `ui/lib/types.ts`

Add two optional fields (backward-compatible with existing placeholders):

```ts
export interface VideoResult {
  id: string;
  title: string;
  thumbnailColor: string;      // fallback
  label: string;
  thumbnailUrl?: string;        // data:image/png;base64,... from Gemini
  videoUrl?: string;            // blob: URL of uploaded gameplay
}
```

## 2. Update placeholder labels

**File:** `ui/lib/constants.ts`

Change titles/labels from "Highlight Reel" etc. to "Sample 1", "Sample 2", "Sample 3".

## 3. New API route: `/api/gemini/thumbnail`

**File:** `ui/app/api/gemini/thumbnail/route.ts`

- Accepts `{ analysisText, style }` — calls `gemini-2.5-flash-image` with `responseModalities: ["IMAGE"]` and `imageConfig: { aspectRatio: "9:16" }`
- Returns `{ imageBase64, mimeType }`
- 3 style prompts, each fed the video analysis (truncated to 500 chars) for context:
  - **"cinematic"** — dramatic lighting, deep shadows, cinematic render
  - **"comic"** — bold comic book illustration, halftone textures, vibrant colors
  - **"neon"** — cyberpunk neon glow, synthwave aesthetic, dark background

## 4. Update generation pipeline

**File:** `ui/lib/api.ts`

**4a. Blob URL at upload time:**
In `uploadGameplay()`, before posting to server, call `URL.createObjectURL(file)` and store the URL string in sessionStorage (`gamevoice-gameplay-blob`). This is a ~50-char string, not base64 data — safe per MISTAKE-001.

**4b. New pipeline step:**
Insert `"thumbnails"` ("Creating thumbnail art") between `"script"` and `"voice"`.

**4c. Thumbnail generation:**
After script completes, fire 3 parallel requests to `/api/gemini/thumbnail` (one per style) via `Promise.allSettled`. Map failures to `null` so partial success still works.

**4d. Build results with real data:**
Construct `VideoResult[]` with `thumbnailUrl` (data URI from base64) and `videoUrl` (blob URL from sessionStorage). Fall back to color placeholders if thumbnails failed.

**4e. Fix `buildCharacterProfile`:**
Lines 65-66 reference dead `character.voiceSample` / `character.voiceWeight`. Replace with `character.voice`.

## 5. Rewrite VideoCard for reel style

**File:** `ui/components/VideoCard.tsx`

- **Aspect ratio:** `aspect-[9/16]` (vertical reel)
- **`<video>` element:** `src={videoUrl}`, `muted`, `loop`, `playsInline`, `object-cover`
- **Thumbnail poster:** `<img>` with `thumbnailUrl` over the video; falls back to colored div
- **Play/pause:** Click toggles play; hover shows semi-transparent play button overlay
- **Download:** Programmatic `<a>` click with blob URL + `download` attribute

UX details:
- Videos muted (autoplay policy + prevents chaos with 3 cards)
- Videos loop (reel aesthetic)
- `object-cover` crops 16:9 gameplay into 9:16 frame (center crop, acceptable for demo)
- Play icon overlay fades in on hover, fades out on play

## 6. Update results page layout

**File:** `ui/app/results/page.tsx`

- Replace `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` with centered flex row
- Each card constrained to `max-w-[240px]` (~427px tall for 9:16 area)
- Mobile: stack vertically. Desktop: 3 side by side
- Update subtitle: "3 AI-generated commentary samples, ready to watch."

## Known Limitations (acceptable for hackathon)

- **Blob URL breaks on hard refresh** — the URL string survives in sessionStorage but the underlying blob is garbage-collected. Within a single SPA session (upload -> character -> results), this works fine.
- **Video is center-cropped** — 16:9 gameplay in a 9:16 frame crops the sides. Acceptable since all 3 are the same content and it matches reel aesthetics.
- **Thumbnail generation can fail** — graceful fallback to colored divs via `Promise.allSettled`.

## Verification

1. `npm run build` passes
2. Upload a video; verify blob URL stored in sessionStorage
3. Loading overlay shows 5 steps (analyze, script, thumbnails, voice, assemble)
4. 3 different-style 9:16 thumbnails appear
5. Thumbnail fallback works when API key is broken (colored divs)
6. Click a card — gameplay plays inside 9:16 frame
7. Click again — pauses, thumbnail reappears
8. Download button triggers file save dialog
9. Desktop: 3 vertical cards side by side. Mobile: stacked
10. No base64 data in localStorage (only sessionStorage + React state)
