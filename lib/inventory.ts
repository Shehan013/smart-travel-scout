import { z } from 'zod';
import inventoryData from '@/data/inventory.json';
import { Experience } from './types';

/**
 * Zod schema for runtime validation of experience data
 * This ensures our JSON data matches the expected structure
 */
const ExperienceSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  location: z.string().min(1),
  price: z.number().positive(),
  tags: z.array(z.string()).min(1),
});

/**
 * Schema for the entire inventory array
 */
const InventorySchema = z.array(ExperienceSchema);

/**
 * Loads and validates all experiences from inventory.json
 * @returns Array of validated Experience objects
 * @throws Error if inventory data is invalid
 */
export function getAllExperiences(): Experience[] {
  try {
    // Parse and validate the inventory data at runtime
    const validated = InventorySchema.parse(inventoryData);
    return validated;
  } catch (error) {
    console.error('Inventory validation failed:', error);
    throw new Error('Invalid inventory data structure');
  }
}

/**
 * Finds a specific experience by ID
 * @param id - The experience ID to search for
 * @returns The experience if found, undefined otherwise
 */
export function getExperienceById(id: number): Experience | undefined {
  const allExperiences = getAllExperiences();
  return allExperiences.find((exp) => exp.id === id);
}

/**
 * Extracts all unique tags from the inventory
 * Useful for building filter UI
 * @returns Array of unique tag strings, sorted alphabetically
 */
export function getAllTags(): string[] {
  const allExperiences = getAllExperiences();
  const tagSet = new Set<string>();
  
  allExperiences.forEach((exp) => {
    exp.tags.forEach((tag) => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Gets price range from inventory (min and max prices)
 * @returns Object with min and max price values
 */
export function getPriceRange(): { min: number; max: number } {
  const allExperiences = getAllExperiences();
  const prices = allExperiences.map((exp) => exp.price);
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/**
 * Filters experiences by price range and tags
 * @param experiences - Array of experiences to filter
 * @param minPrice - Minimum price (inclusive)
 * @param maxPrice - Maximum price (inclusive)
 * @param selectedTags - Tags to filter by (experience must have at least one)
 * @returns Filtered array of experiences
 */
export function filterExperiences(
  experiences: Experience[],
  minPrice?: number,
  maxPrice?: number,
  selectedTags?: string[]
): Experience[] {
  return experiences.filter((exp) => {
    const withinPriceRange =
      (minPrice === undefined || exp.price >= minPrice) &&
      (maxPrice === undefined || exp.price <= maxPrice);

    const matchesTags =
      !selectedTags ||
      selectedTags.length === 0 ||
      selectedTags.some((tag) => exp.tags.includes(tag));

    return withinPriceRange && matchesTags;
  });
}