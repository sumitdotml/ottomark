# LOG

## Initial thought process (12:01 PM)

1. landing page for a quick demo that has a gameplay video quick upload button
2. character definition (traits, attributes) -> if some character is already saved, define a new one or use the existing one
2a. the new character popup (modal): character nickname box, character image upload, voice tuning dials (5 options but let's make only 1 work for the demo: let's use very non-technical about these options, such a heacy-light voice, are they sarcastic/funny/rude personality, etc.) make few voice samples and let them decide on some.
3. third screen: thumbnails with 1 row and 3 columns of the videos generated (all will be different thumbnails), and when clicked, the videos can be played, and each vid has a download button



## Voice generation (12:20 PM)

1. Mapping voice to personalities - [docs](https://discord.com/channels/@me/1474037988890644634/1474608395553079497)
2. API sample for text to voice clip
   1. Add `GEMINI_API_KEY` in .env.
   2. `npm install`
   3. `npx ts-node script-to-voice.ts`
   4. `play influencer-audio.wav`
