# LOG

## Initial thought process (12:01 PM)

1. landing page for a quick demo that has a gameplay video quick upload button
2. character definition (traits, attributes) -> if some character is already saved, define a new one or use the existing one
2a. the new character popup (modal): character nickname box, character image upload, voice tuning dials (5 options but let's make only 1 work for the demo: let's use very non-technical about these options, such a heacy-light voice, are they sarcastic/funny/rude personality, etc.) make few voice samples and let them decide on some.
3. third screen: thumbnails with 1 row and 3 columns of the videos generated (all will be different thumbnails), and when clicked, the videos can be played, and each vid has a download button

## PR #1 changes

1. progressive loading steps on results page -- analyze, script, voice, assemble -- pulsing dot turns into a checkmark
2. mock API layer in `ui/lib/api.ts` so the real backend swap is a single-file change
3. bigger character cards with delete button, bigger "create new" button
4. modal avatar moved to top-right
5. homepage link to `/character`
6. "generate videos" button always visible, grayed out until you pick a character
7. homepage spacing tightened so text doesn't overflow past the video, browse-characters is a lightweight text link now
8. results page buttons bumped to `text-base` to match character page
9. avatar uploads resize to 128x128 JPEG before storing -- fixes localStorage quota crash on 3rd character

## PR #4 — Gemini voice mapping (3:14 PM)

1. replaced `voiceSample` (4 generic labels) + `voiceWeight` slider with single `voice` field mapped to 5 Gemini TTS voices
2. voice picks: Puck (upbeat), Algenib (gravelly), Algieba (smooth), Zubenelgenubi (casual), Sulafat (warm)
3. demo pair for full pipeline: Puck + Algenib -- max timbral contrast
4. `resolveGeminiVoice()` in `ui/lib/voice-map.ts` maps UI IDs to Gemini voice names
5. localStorage migration auto-remaps old characters (deep→gravelly, smooth→smooth, energetic→upbeat, laid-back→casual)
6. left review comment on PR#2 with integration instructions for replacing hardcoded `'Kore'`



## PR #2 changes - Voice generation (12:20 PM)

1. Mapping voice to personalities - [docs](https://discord.com/channels/@me/1474037988890644634/1474608395553079497)
2. API sample for text to voice clip
   1. Add `GEMINI_API_KEY` in .env.
   2. `npm install`
   3. `npx ts-node script-to-voice.ts`
   4. `play influencer-audio.wav`