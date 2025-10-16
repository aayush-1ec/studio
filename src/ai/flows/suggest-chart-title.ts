'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting chart titles based on a user's description of the data.
 *
 * - suggestChartTitle - The main function to generate chart titles.
 * - SuggestChartTitleInput - The input type for the suggestChartTitle function.
 * - SuggestChartTitleOutput - The output type for the suggestChartTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChartTitleInputSchema = z.object({
  dataDescription: z
    .string()
    .describe("A description of the data being visualized in the chart.  Example: 'temperature readings from a greenhouse sensor'."),
});
export type SuggestChartTitleInput = z.infer<typeof SuggestChartTitleInputSchema>;

const SuggestChartTitleOutputSchema = z.object({
  suggestedTitle: z.string().describe('An appropriate and informative chart title suggestion.'),
});
export type SuggestChartTitleOutput = z.infer<typeof SuggestChartTitleOutputSchema>;

export async function suggestChartTitle(input: SuggestChartTitleInput): Promise<SuggestChartTitleOutput> {
  return suggestChartTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChartTitlePrompt',
  input: {schema: SuggestChartTitleInputSchema},
  output: {schema: SuggestChartTitleOutputSchema},
  prompt: `You are an AI assistant that suggests chart titles based on a description of the data.  The chart title should be concise and informative.

Data Description: {{{dataDescription}}}

Suggested Chart Title: `,
});

const suggestChartTitleFlow = ai.defineFlow(
  {
    name: 'suggestChartTitleFlow',
    inputSchema: SuggestChartTitleInputSchema,
    outputSchema: SuggestChartTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
