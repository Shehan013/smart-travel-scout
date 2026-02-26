/**
 * Core data types for application
 */

/**
 * Represents a travel experience in the inventory
 */
export interface Experience {
  id: number;
  title: string;
  location: string;
  price: number;
  tags: string[];
}

/**
 * User's search request with optional filters
 */
export interface SearchRequest {
  query: string;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    selectedTags?: string[];
  };
}

/**
 * LLM recommendation response 
 */
export interface LLMRecommendation {
  experience_ids: number[];
  reasoning: string;
  matched_tags?: string[];
}

/**
 * Final API response sent to the client
 */
export interface RecommendationResponse {
  recommendations: Experience[];
  reasoning: string;
  matchedTags: string[];
}