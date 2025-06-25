'use server';

/**
 * @fileOverview Generates game assets (images, code snippets, music) using natural language prompts.
 *
 * - generateGameAssets - A function that handles the game asset generation process.
 * - GenerateGameAssetsInput - The input type for the generateGameAssets function.
 * - GenerateGameAssetsOutput - The return type for the generateGameAssets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGameAssetsInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the desired game asset.'),
  assetType: z.enum(['image', 'code', 'music']).describe('The type of game asset to generate.'),
  theme: z.string().optional().describe('The game theme to follow for consistency across assets.'),
});
export type GenerateGameAssetsInput = z.infer<typeof GenerateGameAssetsInputSchema>;

const GenerateGameAssetsOutputSchema = z.object({
  assetData: z.string().describe('The generated game asset data (e.g., image data URI, code snippet, music data URI).'),
  assetDescription: z.string().describe('A description of the generated asset.'),
});
export type GenerateGameAssetsOutput = z.infer<typeof GenerateGameAssetsOutputSchema>;

export async function generateGameAssets(input: GenerateGameAssetsInput): Promise<GenerateGameAssetsOutput> {
  return generateGameAssetsFlow(input);
}

const generateAssetPrompt = ai.definePrompt({
  name: 'generateAssetPrompt',
  input: {
    schema: GenerateGameAssetsInputSchema,
  },
  output: {
    schema: GenerateGameAssetsOutputSchema,
  },
  prompt: `You are a game asset generator AI. The user will provide a prompt, the type of asset, and optionally the game theme.

    Generate the game asset based on the user's prompt and the specified asset type. The generated asset should be of high quality and suitable for use in a game. Make sure the image is a data URI, the music is a data URI and the code is a usable code snippet.

    If a theme is specified, ensure that the generated asset is consistent with the theme.

    Prompt: {{{prompt}}}
    Asset Type: {{{assetType}}}
    Theme: {{{theme}}}

    Return the generated asset data and a description of the asset.
    `, 
});

const generateGameAssetsFlow = ai.defineFlow(
  {
    name: 'generateGameAssetsFlow',
    inputSchema: GenerateGameAssetsInputSchema,
    outputSchema: GenerateGameAssetsOutputSchema,
  },
  async input => {
    if (input.assetType === 'image') {
      const {media} = await ai.generate({
        // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
        model: 'googleai/gemini-2.0-flash-preview-image-generation',

        prompt: input.prompt,

        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
      });
      return {
        assetData: media!.url,
        assetDescription: 'Generated image based on the prompt.',
      };
    } else {
      const {output} = await generateAssetPrompt(input);
      return output!;
    }
  }
);
