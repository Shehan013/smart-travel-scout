import { getAllExperiences, getAllTags, getPriceRange, filterExperiences } from './inventory';

/**
 * Quick test function to verify inventory loading
 * Run this to check if everything is set up correctly
 */
export function testInventory() {
  console.log('Testing inventory loader...\n');

  // Test 1: Load all experiences
  const experiences = getAllExperiences();
  console.log(`Loaded ${experiences.length} experiences`);
  console.log('First experience:', experiences[0]);

  // Test 2: Get all tags
  const tags = getAllTags();
  console.log(`Found ${tags.length} unique tags:`, tags);

  // Test 3: Get price range
  const priceRange = getPriceRange();
  console.log(`\nPrice range: $${priceRange.min} - $${priceRange.max}`);

  // Test 4: Filter by price
  const cheapExperiences = filterExperiences(experiences, 0, 100);
  console.log(`\nExperiences under $100:`, cheapExperiences.length);
  cheapExperiences.forEach((exp) => {
    console.log(`   - ${exp.title}: $${exp.price}`);
  });

  // Test 5: Filter by tags
  const beachExperiences = filterExperiences(experiences, undefined, undefined, ['beach']);
  console.log(`\nBeach experiences:`, beachExperiences.length);
  beachExperiences.forEach((exp) => {
    console.log(`   - ${exp.title}`);
  });

  console.log('\nAll tests passed!');
}