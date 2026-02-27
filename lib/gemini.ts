import { GoogleGenerativeAI } from '@google/generative-ai';
import { Experience, LLMRecommendation } from './types';
import {
  sanitizeUserInput,
  validateExperienceIds,
  safeJsonParse,
  getFallbackRecommendations,
} from './safety';
import { LLMRecommendationSchema } from './validation';

/**
 * Gemini AI client and recommendation logic - handles all LLM interactions with grounding
 */

/**
 * Initializes and returns a Gemini AI client
 * @throws Error if API key is missing or invalid
 */
function initGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY not found in environment variables. '
    );
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Builds the system prompt that grounds the LLM to our inventor for preventing hallucinations
 * 
 * @param inventory - The complete inventory to ground the model to
 * @returns Formatted system prompt string
 */
function buildSystemPrompt(inventory: Experience[]): string {
  // Convert inventory to a clean, readable format for the LLM
  const inventoryText = inventory
    .map(
      (exp) =>
        `ID: ${exp.id} | Title: "${exp.title}" | Location: ${exp.location} | Price: $${exp.price} | Tags: [${exp.tags.join(', ')}]`
    )
    .join('\n');

  return `You are an expert travel recommendation assistant for Smart Travel Scout.

**CRITICAL RULES - YOU MUST FOLLOW THESE EXACTLY:**

1. You can ONLY recommend experiences from the inventory below
2. NEVER invent, create, or suggest experiences that are not in this list
3. ONLY use the exact IDs from the inventory
4. Return 1-3 recommendations maximum that best match the user's request
5. If no experiences match well, return an empty array with an explanation

**AVAILABLE INVENTORY:**
${inventoryText}

**YOUR TASK:**
Analyze the user's natural language request and recommend the most relevant experiences.
Consider:
- Location preferences (beach, mountains, cities)
- Activity types (adventure, relaxation, culture, history)
- Price constraints (budget options vs premium)
- Vibe/atmosphere (young-vibe, family-friendly, romantic)
- Specific interests mentioned in tags

**RESPONSE FORMAT:**
Return ONLY valid JSON (no markdown, no explanations outside JSON) with this exact structure:
{
  "experience_ids": [1, 2],
  "reasoning": "A clear explanation of why these experiences match the user's request",
  "matched_tags": ["tag1", "tag2"]
}

**EXAMPLES:**

User: "I want a relaxing beach experience under $100"
Response: {"experience_ids": [4], "reasoning": "Surf & Chill Retreat at Arugam Bay perfectly matches your request - it's a beach destination with a young, relaxed vibe at only $80, well within your budget.", "matched_tags": ["beach", "surfing", "young-vibe"]}

User: "Show me historical sites"
Response: {"experience_ids": [2, 5], "reasoning": "Both Coastal Heritage Wander at Galle Fort ($45) and Ancient City Exploration at Sigiriya ($110) offer rich historical experiences with cultural significance and great views.", "matched_tags": ["history", "culture", "walking", "climbing", "view"]}

User: "I want skiing in the Alps"
Response: {"experience_ids": [], "reasoning": "Unfortunately, we don't have any skiing experiences in our current inventory. Our experiences focus on Sri Lankan destinations. Would you like to explore our adventure or nature options instead?", "matched_tags": []}

Remember: ONLY use IDs from the inventory above. NEVER make up experiences.`;
}

/**
 * Calls Gemini API to get travel recommendations
 * Includes all grounding, validation, and error handling
 * 
 * @param userQuery - The user's natural language search query
 * @param filters - Optional price and tag filters
 * @param inventory - Full inventory to ground the LLM to
 * @returns Promise with validated recommendations
 */
export async function getRecommendations(
  userQuery: string,
  filters: {
    minPrice?: number;
    maxPrice?: number;
    selectedTags?: string[];
  } = {},
  inventory: Experience[]
): Promise<LLMRecommendation> {
  try {
    // Sanitize user input to prevent prompt injection
    const sanitizedQuery = sanitizeUserInput(userQuery);

    if (!sanitizedQuery || sanitizedQuery.length < 3) {
      return {
        experience_ids: [],
        reasoning: 'Please provide a more detailed search query (at least 3 characters).',
        matched_tags: [],
      };
    }

    // Build the grounding prompt with inventory
    const systemPrompt = buildSystemPrompt(inventory);

    // Build user message with filters if provided
    let userMessage = sanitizedQuery;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceConstraint = `Price range: $${filters.minPrice ?? 0} - $${filters.maxPrice ?? 'unlimited'}`;
      userMessage += `\n\nAdditional constraint: ${priceConstraint}`;
    }
    if (filters.selectedTags && filters.selectedTags.length > 0) {
      userMessage += `\n\nPreferred tags: ${filters.selectedTags.join(', ')}`;
    }

    console.log('Calling Gemini API...');
    console.log('Query:', sanitizedQuery);
    console.log('Filters:', filters);

    // Initialize Gemini client
    const genAI = initGeminiClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite', // Best for free tier: fast, efficient, text-only
      generationConfig: {
        temperature: 0.3, // Lower = more focused, less creative (better for grounding)
        topP: 0.8,
        topK: 20,
        maxOutputTokens: 500, // Keep responses concise
        responseMimeType: 'application/json', // Force JSON output
      },
    });

    // Send prompt to Gemini
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I will only recommend experiences from the provided inventory and return valid JSON responses.' }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    console.log('Gemini response received');
    console.log('Raw response:', responseText);

    // Parse JSON safely
    const parsedResponse = safeJsonParse<LLMRecommendation>(responseText);

    if (!parsedResponse) {
      console.error('Failed to parse Gemini response as JSON');
      return getFallbackResponse(inventory, 'Unable to parse AI response. Showing popular experiences.');
    }

    // Validate response structure with Zod
    const validationResult = LLMRecommendationSchema.safeParse(parsedResponse);

    if (!validationResult.success) {
      console.error('Gemini response failed schema validation:', validationResult.error.message);
      return getFallbackResponse(inventory, 'AI response format was invalid. Showing popular experiences.');
    }

    // Validate that all IDs exist in inventory (prevent hallucinations)
    const validatedIds = validateExperienceIds(
      validationResult.data.experience_ids,
      inventory
    );

    // Return validated response
    const finalResponse: LLMRecommendation = {
      experience_ids: validatedIds,
      reasoning: validationResult.data.reasoning,
      matched_tags: validationResult.data.matched_tags || [],
    };

    console.log('Validated recommendations:', finalResponse);

    return finalResponse;

  } catch (error) {
    console.error('Error calling Gemini API:', error);

    // Check for specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw error; 
      }
      if (error.message.includes('429') || error.message.includes('quota')) {
        return getFallbackResponse(
          inventory,
          'AI service is temporarily busy. Showing popular experiences.'
        );
      }
    }

    // Generic error fallback
    return getFallbackResponse(
      inventory,
      'Unable to process your request. Showing popular experiences.'
    );
  }
}

/**
 * Generates a fallback response when LLM fails
 * Provides graceful degradation with safe defaults
 * 
 * @param inventory - Full inventory
 * @param reason - Explanation for why showing fallback
 * @returns Safe fallback recommendation
 */
function getFallbackResponse(
  inventory: Experience[],
  reason: string
): LLMRecommendation {
  const fallbackIds = getFallbackRecommendations(inventory, 3);

  return {
    experience_ids: fallbackIds,
    reasoning: reason,
    matched_tags: [],
  };
}