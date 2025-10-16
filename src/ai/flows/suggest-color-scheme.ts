'use server';

/**
 * @fileOverview AI tool that suggests contextually appropriate chart titles and color schemes based on a user description of the data.
 *
 * - suggestColorScheme - A function that handles the color scheme suggestion process.
 * - SuggestColorSchemeInput - The input type for the suggestColorScheme function.
 * - SuggestColorSchemeOutput - The return type for the suggestColorScheme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestColorSchemeInputSchema = z.object({
  dataDescription: z
    .string()
    .describe('A description of the data being visualized in the chart.'),
});
export type SuggestColorSchemeInput = z.infer<typeof SuggestColorSchemeInputSchema>;

const SuggestColorSchemeOutputSchema = z.object({
  colorScheme: z
    .string()
    .describe(
      'A suggestion for a color scheme suitable for the chart, described as a list of color names or hex codes.'
    ),
  titleSuggestion: z
    .string()
    .describe('A suggested title for the chart, based on the data description.'),
});
export type SuggestColorSchemeOutput = z.infer<typeof SuggestColorSchemeOutputSchema>;

export async function suggestColorScheme(
  input: SuggestColorSchemeInput
): Promise<SuggestColorSchemeOutput> {
  return suggestColorSchemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestColorSchemePrompt',
  input: {schema: SuggestColorSchemeInputSchema},
  output: {schema: SuggestColorSchemeOutputSchema},
  prompt: `You are an AI assistant that suggests visually appealing and contextually relevant color schemes and titles for charts.

  Given the following description of the data, suggest a color scheme and a title for the chart.

  Data Description: {{{dataDescription}}}

  The color scheme should be a list of color names or hex codes suitable for visualizing the described data.
  The title suggestion should be concise and informative, accurately reflecting the content of the chart.
`,
});

const suggestColorSchemeFlow = ai.defineFlow(
  {
    name: 'suggestColorSchemeFlow',
    inputSchema: SuggestColorSchemeInputSchema,
    outputSchema: SuggestColorSchemeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
