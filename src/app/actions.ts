"use server";

import { suggestColorScheme, type SuggestColorSchemeOutput } from '@/ai/flows/suggest-color-scheme';

interface AIResult {
    success: boolean;
    data?: SuggestColorSchemeOutput;
    error?: string;
}

export async function enhanceChart(dataDescription: string): Promise<AIResult> {
  if (!dataDescription) {
    return { success: false, error: "Data description cannot be empty." };
  }

  try {
    const result = await suggestColorScheme({ dataDescription });
    return { success: true, data: result };
  } catch (error) {
    console.error("AI enhancement failed:", error);
    return { success: false, error: "Failed to get a suggestion from the AI. Please try again." };
  }
}
