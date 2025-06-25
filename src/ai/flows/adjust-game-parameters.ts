'use server';
/**
 * @fileOverview Adjusts game parameters based on a natural language prompt.
 *
 * - adjustGameParameters - A function that handles the parameter adjustment.
 * - AdjustGameParametersInput - The input type for the adjustGameParameters function.
 * - AdjustGameParametersOutput - The return type for the adjustGameParameters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GameParametersSchema = z.object({
  speed: z.number().describe('The overall speed of the game. Higher is faster.'),
  gravity: z.number().describe('The force of gravity affecting the player. Higher is stronger.'),
  gapSize: z.number().describe('The size of the gap between obstacles. Smaller is harder.'),
  spawnRate: z.number().describe('The rate at which obstacles appear. Higher is more frequent.'),
});

const AdjustGameParametersInputSchema = z.object({
  currentParameters: GameParametersSchema,
  prompt: z.string().describe('A natural language prompt describing the desired change in difficulty.'),
});
export type AdjustGameParametersInput = z.infer<typeof AdjustGameParametersInputSchema>;

const AdjustGameParametersOutputSchema = z.object({
  newParameters: GameParametersSchema,
});
export type AdjustGameParametersOutput = z.infer<typeof AdjustGameParametersOutputSchema>;

export async function adjustGameParameters(input: AdjustGameParametersInput): Promise<AdjustGameParametersOutput> {
  return adjustGameParametersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustGameParametersPrompt',
  input: {schema: AdjustGameParametersInputSchema},
  output: {schema: AdjustGameParametersOutputSchema},
  prompt: `You are a game design expert. The user wants to adjust the difficulty of their game.
  
  Current Parameters:
  - Speed: {{currentParameters.speed}}
  - Gravity: {{currentParameters.gravity}}
  - Gap Size: {{currentParameters.gapSize}}
  - Spawn Rate: {{currentParameters.spawnRate}}

  User's Request: "{{prompt}}"

  Based on the user's request, provide a new set of parameters that would achieve their desired difficulty. The values should be between 1 and 10. Return only the new parameters in the specified JSON format.
  `,
});

const adjustGameParametersFlow = ai.defineFlow(
  {
    name: 'adjustGameParametersFlow',
    inputSchema: AdjustGameParametersInputSchema,
    outputSchema: AdjustGameParametersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
