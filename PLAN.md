# Hackathon Game Prototype — UI Plan

## Context
Building a quick hackathon prototype with 3 screens: Landing → Character Definition → Video Results. No actual gameplay or video generation — real file uploads with mock processing. Next.js (App Router) + Tailwind. Using the **frontend-design skill** for distinctive, polished UI.

## Design Direction

**Aesthetic**: Refined minimalism — not generic white-on-white, but intentional and memorable.

- **Typography**: Use Google Fonts — a distinctive display font (e.g., Sora, Outfit, or Satoshi) paired with a clean body font. Avoid Inter/Roboto/system defaults.
- **Color palette**: Warm off-white background (`#FAFAF8` or similar), near-black text, one strong accent (deep indigo or warm coral) used sparingly for CTAs. CSS variables for consistency.
- **Motion**: Staggered fade-in on page load, smooth page transitions, subtle hover lifts on cards. CSS transitions + `animation-delay` for orchestrated reveals.
- **Spatial feel**: Generous whitespace, asymmetric hero layout, oversized headings, cards with soft shadows and rounded corners.
- **Textures**: Subtle noise/grain overlay on backgrounds for depth. Soft gradient accents on key sections.
- **Memorable detail**: The loading screen (Screen 3) — use an animated waveform or morphing shapes instead of a generic spinner.

## Project Setup

Initialize inside `/Users/sumit/playground/hackathons`:
```bash
npx create-next-app@latest game-demo --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```
Clean up default boilerplate (remove starter content from `page.tsx`, `globals.css`).

## File Structure

```
game-demo/
  app/
    layout.tsx                # Root layout (Server Component)
    page.tsx                  # Screen 1: Landing Page
    character/page.tsx        # Screen 2: Character Definition
    results/page.tsx          # Screen 3: Video Results Gallery
    globals.css
  components/
    HeroSection.tsx           # Hero video + tagline
    UploadButton.tsx          # Styled file input for video
    CharacterCard.tsx         # Saved character card (selectable)
    CharacterModal.tsx        # New character creation form
    VoiceSlider.tsx           # Heavy ↔ Light slider
    PersonalityChips.tsx      # Sarcastic / Funny / Rude / Chill radio chips
    VoiceSamplePicker.tsx     # 3-4 audio sample buttons
    VideoCard.tsx             # Thumbnail + inline player + download
    LoadingOverlay.tsx        # Fake "generating" animation
  lib/
    types.ts                  # Character, VideoResult interfaces
    storage.ts                # localStorage helpers
    constants.ts              # Placeholder data, personality options, voice samples
  public/
    (placeholder assets — videos, thumbnails, voice samples)
```

## Screen 1: Landing Page (`/`)

- Hero section with embedded gameplay video (YouTube iframe or placeholder `<video>`)
- Tagline: "Upload your gameplay footage and generate custom AI commentary"
- **Upload button**: hidden `<input type="file" accept="video/*">` behind a styled button
- On upload: store file in state, set `sessionStorage` flag, navigate to `/character`

## Screen 2: Character Definition (`/character`)

**On mount**: read saved characters from `localStorage`
- If characters exist → show selectable card grid + "Create New" button
- If none → open creation modal directly

**Character Modal fields:**
1. **Nickname** — text input
2. **Image upload** — file input with `FileReader.readAsDataURL()` preview
3. **Voice weight** — range slider, "Heavy" ↔ "Light" labels
4. **Personality** — chip selector: Sarcastic, Funny, Rude, Chill (single select)
5. **Voice sample** — 3-4 buttons that play audio previews on click

**"Generate Videos" button** → validate nickname, save character to `localStorage`, navigate to `/results?characterId=xxx`

## Screen 3: Video Results Gallery (`/results`)

- Read `characterId` from search params, load character name for display
- Show `LoadingOverlay` for ~3 seconds (fake generation delay)
- Display 3 `VideoCard` components in a `grid-cols-3` grid
- Each card: thumbnail → click to play inline `<video>` → download `<a>` button
- Navigation: "Back to Home" and "Create Another Character" buttons
- Videos are hardcoded placeholders from `lib/constants.ts`

## State Management

| Data | Where | Why |
|---|---|---|
| Uploaded gameplay file | React `useState` + `sessionStorage` flag | Stays in memory, flag confirms upload happened |
| Saved characters | `localStorage` via `lib/storage.ts` | Persists across reloads |
| Selected character | URL search param `?characterId=xxx` | Passed between pages |
| Video results | Hardcoded in `lib/constants.ts` | No real generation |

No external state library needed — `useState` + `localStorage` + URL params covers everything.

## Navigation Flow

```
Landing (/) --[upload video]--> Character (/character) --[generate]--> Results (/results?characterId=xxx)
                                                                         |
                                                              [Back to Home] --> /
                                                              [Create Another] --> /character
```

## Placeholder Assets

For initial development, use colored `<div>` placeholders (16:9 ratio, centered text like "Generated Video 1") instead of real video files. Voice samples can be placeholder buttons that log to console. Replace with real assets before demo.

## Build Order

1. Project setup + clean boilerplate + Google Fonts + CSS variables + global styles (grain texture, base typography)
2. `lib/types.ts`, `lib/constants.ts`, `lib/storage.ts`
3. Screen 1 — Landing Page (HeroSection, UploadButton) — asymmetric hero, staggered fade-in
4. Screen 3 — Results Gallery (VideoCard, LoadingOverlay) — animated loading state, card hover effects
5. Screen 2 — Character Definition (CharacterCard, CharacterModal + sub-components) — most complex
6. Polish: responsive tweaks, motion refinement, micro-interactions

All screens built using **frontend-design skill** guidelines — distinctive typography, intentional color, motion, and spatial composition.

## Verification

1. `npm run dev` — app starts without errors
2. Landing page: upload a video file → navigates to `/character`
3. Character page: create a new character with all fields → navigates to `/results`
4. Results page: loading animation plays, 3 video cards appear, download buttons work
5. Character page (revisit): previously saved character appears as selectable card
6. Direct URL navigation to `/results` without `characterId` → redirects to `/`

---

## Iteration 1: UI Feedback Fixes

4 targeted changes based on screenshot review.

### 1. Bigger character cards + delete button
**File**: `ui/components/CharacterCard.tsx`
- Avatar: `h-16 w-16` → `h-24 w-24`
- Card padding: `p-6` → `p-8`
- Name text: `text-sm` → `text-base`
- Add delete (X) button in card top-right corner, new `onDelete` prop

### 2. Bigger "Create New" button
**File**: `ui/app/character/page.tsx`
- Button sizing: `px-6 py-3 text-sm` → `px-8 py-4 text-base`
- Wire up `onDelete` to `CharacterCard`, call `deleteCharacter`, refresh list

### 3. Modal: avatar moved to top-right, bigger
**File**: `ui/components/CharacterModal.tsx`
- Top of modal becomes flex row: title left, avatar upload right
- Avatar: `h-20 w-20` → `h-24 w-24`
- Remove separate "Avatar" label (position is self-evident)

### 4. Homepage: add nav to character page
**File**: `ui/app/page.tsx`
- Secondary link below upload button: "or browse your characters →" → `/character`

### 5. Add `deleteCharacter` to storage
**File**: `ui/lib/storage.ts`
- `deleteCharacter(id: string)` — filter out by id and re-save

### Verification
1. `npm run build` passes
2. Homepage shows link to `/character`
3. Character cards visually larger with working delete button
4. Modal has avatar top-right next to title
5. Deleting a character removes it from the grid