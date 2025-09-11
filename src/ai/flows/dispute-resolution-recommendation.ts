'use server';

/**
 * @fileOverview A dispute resolution AI agent that provides a recommendation for a proportional refund.
 *
 * - disputeResolutionRecommendation - A function that handles the dispute resolution process and returns a refund recommendation.
 * - DisputeResolutionInput - The input type for the disputeResolutionRecommendation function.
 * - DisputeResolutionOutput - The return type for the disputeResolutionRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisputeResolutionInputSchema = z.object({
  evidence: z
    .string()
    .describe('The evidence provided by the user to support their claim.'),
  subscriptionDetails: z
    .string()
    .describe('Details about the subscription, including duration and price.'),
  remainingTime: z
    .string()
    .describe('The remaining time left on the subscription.'),
});
export type DisputeResolutionInput = z.infer<typeof DisputeResolutionInputSchema>;

const DisputeResolutionOutputSchema = z.object({
  recommendation: z
    .string()
    .describe(
      'A recommendation for a proportional refund based on the AI analysis.'
    ),
});
export type DisputeResolutionOutput = z.infer<typeof DisputeResolutionOutputSchema>;

export async function disputeResolutionRecommendation(
  input: DisputeResolutionInput
): Promise<DisputeResolutionOutput> {
  return disputeResolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'disputeResolutionPrompt',
  input: {schema: DisputeResolutionInputSchema},
  output: {schema: DisputeResolutionOutputSchema},
  prompt: `You are an AI assistant that provides recommendations for subscription disputes.
  Based on the evidence, subscription details, and remaining time, provide a recommendation for a proportional refund.

  Evidence: {{{evidence}}}
  Subscription Details: {{{subscriptionDetails}}}
  Remaining Time: {{{remainingTime}}}

  Provide a clear and concise recommendation for the refund amount.
  `,
});

const disputeResolutionFlow = ai.defineFlow(
  {
    name: 'disputeResolutionFlow',
    inputSchema: DisputeResolutionInputSchema,
    outputSchema: DisputeResolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
