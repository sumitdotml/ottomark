import {GoogleGenAI} from '@google/genai';
import wav from 'wav';
import 'dotenv/config';

async function saveWaveFile(
   filename: string,
   pcmData: Buffer,
   channels: number = 1,
   rate: number = 24000,
   sampleWidth: number = 2,
): Promise<void> {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

async function main() {
   const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
   });

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{
         parts: [{
            text: 'Say with a sense of urgency: Download GAMENAME now, or else!'
            // TODO: Add "tones" here
            // TODO: Add script here
         }],
      }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                  // TODO: use internally mapped voice name for the character here.
               },
            },
      },
   });

   const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   
   if (!data) {
      throw new Error('No audio data received from API response');
   }
   
   const audioBuffer = Buffer.from(data, 'base64');

   const fileName = 'influencer-audio.wav';
   await saveWaveFile(fileName, audioBuffer);
}

main().catch(console.error);
