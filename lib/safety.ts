import { Experience } from './types';

/**
 * Safety utilities to prevent AI hallucinations and malicious inputs
 */

/**
 * Validates that all IDs exist in the inventory
 * Primary defense against AI hallucinations
 * 
 * @param ids - Array of experience IDs from LLM
 * @param inventory - The complete inventory to check against
 * @returns Array of valid IDs only (filters out hallucinated IDs)
 */
export function validateExperienceIds(
  ids: number[],
  inventory: Experience[]
): number[] {
  // Create a Set of valid IDs for O(1) lookup performance
  const validIds = new Set(inventory.map((exp) => exp.id));
  
  // Filter to only include IDs that exist in our inventory
  const validatedIds = ids.filter((id) => validIds.has(id));
  
  // Log warning if LLM hallucinated any IDs
  if (validatedIds.length < ids.length) {
    const invalidIds = ids.filter((id) => !validIds.has(id));
    console.warn(' LLM returned invalid IDs:', invalidIds);
  }
  
  return validatedIds;
}

/**
 * Sanitizes user input to prevent prompt injection attacks
 * Removes potentially dangerous characters and patterns
 * 
 * @param input - Raw user input string
 * @returns Sanitized string safe to include in prompts
 */
export function sanitizeUserInput(input: string): string {
  // Remove control characters and excessive whitespace
  let sanitized = input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
  
  // Limit length to prevent token abuse
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }
  
  // Remove potential prompt injection patterns
  // These are patterns that might trick the LLM into ignoring instructions
  const dangerousPatterns = [
    /ignore\s+previous\s+instructions/gi,
    /system\s*:/gi,
    /you\s+are\s+now/gi,
    /disregard\s+all/gi,
  ];
  
  dangerousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
}

/**
 * Validates that returned experiences match the query intent
 * This is a sanity check in case LLM returns valid IDs but wrong matches
 * 
 * @param experiences - Experiences recommended by LLM
 * @param query - Original user query
 * @returns Boolean indicating if recommendations seem reasonable
 */
export function validateRecommendationRelevance(
  experiences: Experience[],
  query: string
): boolean {
  // If no experiences returned, consider it valid (could be no matches)
  if (experiences.length === 0) {
    return true;
  }
  
  // Extract keywords from query
  const queryKeywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3); // Only meaningful words
  
  // Check if at least one experience has some relevance
  const hasRelevance = experiences.some((exp) => {
    const expText = `${exp.title} ${exp.location} ${exp.tags.join(' ')}`.toLowerCase();
    
    // Check if any query keyword appears in experience
    return queryKeywords.some((keyword) => expText.includes(keyword));
  });
  
  if (!hasRelevance) {
    console.warn('LLM recommendations seem irrelevant to query:', query);
  }
  
  return hasRelevance;
}

/**
 * Generates fallback recommendations when LLM fails or returns invalid data
 * Returns most popular/diverse experiences as a safe default
 * 
 * @param inventory - Complete inventory
 * @param count - Number of fallback recommendations to return
 * @returns Array of fallback experience IDs
 */
export function getFallbackRecommendations(
  inventory: Experience[],
  count: number = 3
): number[] {
  // Sort by price (variety) and return first N
  const sorted = [...inventory].sort((a, b) => {
    // Prioritize mid-range prices for broad appeal
    const aMidRange = Math.abs(a.price - 100);
    const bMidRange = Math.abs(b.price - 100);
    return aMidRange - bMidRange;
  });
  
  return sorted.slice(0, Math.min(count, inventory.length)).map((exp) => exp.id);
}

/**
 * Safely parses JSON with error handling
 * Prevents crashes from malformed LLM responses
 * 
 * @param jsonString - JSON string to parse
 * @returns Parsed object or null if parsing fails
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    // Remove potential markdown code blocks that LLMs sometimes add
    const cleaned = jsonString
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    console.error('Raw response:', jsonString);
    return null;
  }
}

/**
 * Validates environment variables are properly set
 * Should be called on server startup
 * 
 * @throws Error if required environment variables are missing
 */
export function validateEnvironment(): void {
  const requiredVars = ['GEMINI_API_KEY'];
  
  const missing = requiredVars.filter((varName) => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file'
    );
  }
  
  // Validate API key format (basic check)
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && !apiKey.startsWith('AIza')) {
    console.warn('GEMINI_API_KEY format looks incorrect (should start with "AIza")');
  }
}