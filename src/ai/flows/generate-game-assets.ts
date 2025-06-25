'use server';

/**
 * @fileOverview Generates game assets (images, music) using natural language prompts.
 *
 * - generateGameAssets - A function that handles the game asset generation process.
 * - GenerateGameAssetsInput - The input type for the generateGameAssets function.
 * - GenerateGameAssetsOutput - The return type for the generateGameAssets function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateGameAssetsInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the desired game asset.'),
  assetType: z.enum(['image', 'music']).describe('The type of game asset to generate.'),
  theme: z.string().optional().describe('The game theme to follow for consistency across assets.'),
});
export type GenerateGameAssetsInput = z.infer<typeof GenerateGameAssetsInputSchema>;

const GenerateGameAssetsOutputSchema = z.object({
  assetData: z.string().describe('The generated game asset data (e.g., image data URI, music data URI).'),
  assetDescription: z.string().describe('A description of the generated asset.'),
});
export type GenerateGameAssetsOutput = z.infer<typeof GenerateGameAssetsOutputSchema>;

export async function generateGameAssets(input: GenerateGameAssetsInput): Promise<GenerateGameAssetsOutput> {
  return generateGameAssetsFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateGameAssetsFlow = ai.defineFlow(
  {
    name: 'generateGameAssetsFlow',
    inputSchema: GenerateGameAssetsInputSchema,
    outputSchema: GenerateGameAssetsOutputSchema,
  },
  async (input) => {
    if (input.assetType === 'image') {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      return {
        assetData: media!.url,
        assetDescription: `Generated image for: ${input.prompt}`,
      };
    } else if (input.assetType === 'music') {
      const {media} = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {voiceName: 'Algenib'},
            },
          },
        },
        prompt: `Generate a short, looping, upbeat soundtrack suitable for a ${input.theme || 'retro'} video game. The music should be energetic and inspiring.`,
      });
      if (!media) {
        throw new Error('no media returned');
      }
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      const wavData = await toWav(audioBuffer);
      return {
        assetData: 'data:audio/wav;base64,' + wavData,
        assetDescription: `Generated music for: ${input.theme || 'default theme'}.`,
      };
    } else {
        throw new Error(`Unsupported asset type: ${input.assetType}`);
    }
  }
);
