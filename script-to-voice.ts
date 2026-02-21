import {GoogleGenAI} from '@google/genai';
import wav from 'wav';
import 'dotenv/config';
import fs from 'fs';
import {execSync} from 'child_process';

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

   // Load script-sample.srt into a data structure
   const srtContent = fs.readFileSync('script-sample.srt', 'utf-8');
   
   // Parse SRT format: sequence number, timestamp, text
   interface ScriptEntry {
      sequence: number;
      timestamp: string;
      text: string;
      audio: Buffer | null;
   }
   
   const srtBlocks = srtContent.trim().split('\n\n');
   const scriptData: ScriptEntry[] = srtBlocks.map((block: string) => {
      const lines = block.split('\n');
      const sequenceNum = parseInt(lines[0]);
      const timestamp = lines[1];
      const text = lines.slice(2).join('\n');
      
      return {
         sequence: sequenceNum,
         timestamp,
         text,
         audio: null // Will be populated after API call
      };
   });
   
   // Sort by sequence number (already in order from SRT)
   scriptData.sort((a: ScriptEntry, b: ScriptEntry) => a.sequence - b.sequence);
   
   // Batch process all script entries in a single API call
   // The TTS model concatenates multiple text parts into a single audio output
   console.log(`Processing ${scriptData.length} sequences in batch...`);
   
   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{
         parts: scriptData.map(entry => ({
            text: entry.text
            // TODO: Add "tones" here
            // TODO: Add script here
         })),
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

   // The TTS model returns a single combined audio for all text parts
   const parts = response.candidates?.[0]?.content?.parts || [];
   
   if (parts.length === 0) {
      throw new Error('No audio data was generated');
   }
   
   // Get the single combined audio output
   const data = parts[0]?.inlineData?.data;
   
   if (!data) {
      throw new Error('No audio data in response');
   }
   
   // Store the combined audio buffer
   const combinedAudio = Buffer.from(data, 'base64');
   console.log(`✓ Audio generated for all ${scriptData.length} sequences in batch`);
   
   const fileName = 'influencer-audio.wav';
   
   // Write raw PCM data directly to a temporary file for ffmpeg
   const tempPcmFile = 'temp-audio.pcm';
   fs.writeFileSync(tempPcmFile, combinedAudio);
   
   await saveWaveFile(fileName, combinedAudio);
   console.log(`\n✓ Combined audio saved to ${fileName}`);
   console.log(`Total sequences processed: ${scriptData.length}`);

   // combine all the audio clips and stitch it with "video.mov"
   // video.mov's audio level is reduced to 10%, and the combined audio's audio is 100%
   // save this to "reel-output.wav"
   
   console.log('\nMixing audio with video...');
   // Use the raw PCM file with explicit format specification
   execSync(`ffmpeg -y -f s16le -ar 24000 -ac 1 -i ${tempPcmFile} -i video.mov -filter_complex "[0:a]volume=1.0[a0];[1:a]volume=0.1[a1];[a0][a1]amix=inputs=2:duration=longest" -c:v copy reel-output.mov`, {stdio: 'inherit'});
   
   // Clean up temporary file
   fs.unlinkSync(tempPcmFile);
   
   console.log('\n✓ Video with mixed audio saved to reel-output.mov');
}

main().catch(console.error);
