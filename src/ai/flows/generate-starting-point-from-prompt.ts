'use server';
/**
 * @fileOverview Generates a starting point project structure with code and assets from a natural language prompt.
 *
 * - generateStartingPointFromPrompt - A function that generates the starting point project.
 * - GenerateStartingPointInput - The input type for the generateStartingPointFromPrompt function.
 * - GenerateStartingPointOutput - The return type for the generateStartingPointFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStartingPointInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the desired game.'),
});
export type GenerateStartingPointInput = z.infer<typeof GenerateStartingPointInputSchema>;

const GenerateStartingPointOutputSchema = z.object({
  projectStructure: z.string().describe('The complete project structure, including code and assets, as a JSON string.'),
});
export type GenerateStartingPointOutput = z.infer<typeof GenerateStartingPointOutputSchema>;

export async function generateStartingPointFromPrompt(input: GenerateStartingPointInput): Promise<GenerateStartingPointOutput> {
  return generateStartingPointFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStartingPointPrompt',
  input: {schema: GenerateStartingPointInputSchema},
  output: {schema: GenerateStartingPointOutputSchema},
  prompt: `You are an expert game developer who can create a complete project structure with code and assets based on a natural language prompt.

  The project structure should be a JSON string that includes all necessary files and directories, with code and asset content included as strings.

  Generate a starting point project structure based on the following prompt:
  {{{prompt}}} `,
});

const generateStartingPointFlow = ai.defineFlow(
  {
    name: 'generateStartingPointFlow',
    inputSchema: GenerateStartingPointInputSchema,
    outputSchema: GenerateStartingPointOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
