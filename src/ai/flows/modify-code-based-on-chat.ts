'use server';
/**
 * @fileOverview Modifies code based on chat instructions.
 *
 * - modifyCodeBasedOnChat - A function that modifies code based on chat instructions.
 * - ModifyCodeBasedOnChatInput - The input type for the modifyCodeBasedOnChat function.
 * - ModifyCodeBasedOnChatOutput - The return type for the modifyCodeBasedOnChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModifyCodeBasedOnChatInputSchema = z.object({
  code: z.string().describe('The code to modify.'),
  instructions: z.string().describe('The instructions to modify the code.'),
});
export type ModifyCodeBasedOnChatInput = z.infer<typeof ModifyCodeBasedOnChatInputSchema>;

const ModifyCodeBasedOnChatOutputSchema = z.object({
  modifiedCode: z.string().describe('The modified code.'),
});
export type ModifyCodeBasedOnChatOutput = z.infer<typeof ModifyCodeBasedOnChatOutputSchema>;

export async function modifyCodeBasedOnChat(input: ModifyCodeBasedOnChatInput): Promise<ModifyCodeBasedOnChatOutput> {
  return modifyCodeBasedOnChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'modifyCodeBasedOnChatPrompt',
  input: {schema: ModifyCodeBasedOnChatInputSchema},
  output: {schema: ModifyCodeBasedOnChatOutputSchema},
  prompt: `You are a code modification expert. You will modify the given code based on the instructions.

Code:
{{code}}

Instructions:
{{instructions}}

Modified Code:`,
});

const modifyCodeBasedOnChatFlow = ai.defineFlow(
  {
    name: 'modifyCodeBasedOnChatFlow',
    inputSchema: ModifyCodeBasedOnChatInputSchema,
    outputSchema: ModifyCodeBasedOnChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
