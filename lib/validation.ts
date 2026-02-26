import { z } from 'zod';

/**
 * Validation schemas for user inputs and LLM outputs
 * These provide runtime type checking to prevent invalid data
 */

/**
 * Schema for validating user search requests
 */
export const SearchRequestSchema = z.object({
  query: z
    .string()
    .min(3, 'Search query must be at least 3 characters')
    .max(200, 'Search query too long'),
  filters: z
    .object({
      minPrice: z.number().min(0).optional(),
      maxPrice: z.number().min(0).optional(),
      selectedTags: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Schema for validating LLM responses
 * Ensures the AI returns data in the expected format
 */
export const LLMRecommendationSchema = z.object({
  experience_ids: z
    .array(z.number().int().positive())
    .min(0)
    .max(5, 'Too many recommendations'),
  reasoning: z.string().min(10, 'Reasoning too short'),
  matched_tags: z.array(z.string()).optional(),
});

/**
 * Schema for filter options in the UI
 */
export const FilterOptionsSchema = z.object({
  minPrice: z.number().min(0),
  maxPrice: z.number().min(0),
  selectedTags: z.array(z.string()),
});

/**
 * Type inference from schemas - TypeScript types automatically from Zod schemas
 */
export type SearchRequestInput = z.infer<typeof SearchRequestSchema>;
export type LLMRecommendationOutput = z.infer<typeof LLMRecommendationSchema>;
export type FilterOptions = z.infer<typeof FilterOptionsSchema>;