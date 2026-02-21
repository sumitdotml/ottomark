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