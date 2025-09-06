'use server';
/**
 * @fileOverview AI agent that provides personalized style recommendations based on user browsing history and preferences.
 *
 * - getPersonalizedStyleRecommendations - A function that takes user browsing history and preferences as input and returns personalized style recommendations.
 * - PersonalizedStyleRecommendationsInput - The input type for the getPersonalizedStyleRecommendations function.
 * - PersonalizedStyleRecommendationsOutput - The return type for the getPersonalizedStyleRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedStyleRecommendationsInputSchema = z.object({
  browsingHistory: z
    .array(z.string())
    .describe('An array of product names or descriptions representing the user\'s browsing history.'),
  preferences: z
    .string()
    .describe('A string describing the user\'s style preferences, such as preferred colors, brands, or clothing categories.'),
});
export type PersonalizedStyleRecommendationsInput = z.infer<typeof PersonalizedStyleRecommendationsInputSchema>;

const PersonalizedStyleRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of product names or descriptions representing personalized style recommendations.'),
});
export type PersonalizedStyleRecommendationsOutput = z.infer<typeof PersonalizedStyleRecommendationsOutputSchema>;

export async function getPersonalizedStyleRecommendations(
  input: PersonalizedStyleRecommendationsInput
): Promise<PersonalizedStyleRecommendationsOutput> {
  return personalizedStyleRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedStyleRecommendationsPrompt',
  input: {schema: PersonalizedStyleRecommendationsInputSchema},
  output: {schema: PersonalizedStyleRecommendationsOutputSchema},
  prompt: `You are a personal stylist providing style recommendations based on a user's browsing history and stated preferences.

  Based on the following browsing history:
  {{#each browsingHistory}}- {{{this}}}
  {{/each}}

  And these preferences: {{{preferences}}}

  Recommend products or styles that the user might like. The recommendations should be complementary to the user's existing style and browsing history.
  Limit the recommendations to 5 items.
  Return the recommendations as a list of product names or descriptions.
  `,
});

const personalizedStyleRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedStyleRecommendationsFlow',
    inputSchema: PersonalizedStyleRecommendationsInputSchema,
    outputSchema: PersonalizedStyleRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
