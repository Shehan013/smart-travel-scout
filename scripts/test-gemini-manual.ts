// Load environment variables from .env.local (required for standalone scripts)
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(__dirname, '../.env.local') });

import { getAllExperiences } from '../lib/inventory';
import { getRecommendations } from '../lib/gemini';

/**
 * Manual test script - run this separately to test Gemini
 * install tsx to run TypeScript files directly: npm install --save-dev tsx
 * Usage: npx tsx scripts/test-gemini-manual.ts
 */
async function main() {
  console.log('Testing Gemini API manually...\n');
  
  // Verify API key is loaded
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not found in .env.local');
    console.error('Please make sure .env.local exists with your API key');
    process.exit(1);
  }
  console.log('API key loaded successfully\n');

  const inventory = getAllExperiences();

  // Test 1: Beach query
  console.log('Test 1: Beach vacation under $100');
  const result1 = await getRecommendations(
    'beach vacation under $100',
    {},
    inventory
  );
  console.log('Result:', JSON.stringify(result1, null, 2));
  console.log('\n---\n');

  // Wait 5 seconds between calls to avoid rate limits
  console.log('Waiting 5 seconds to avoid rate limits...\n');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Test 2: History query
  console.log('Test 2: I love history and culture');
  const result2 = await getRecommendations(
    'I love history and culture',
    {},
    inventory
  );
  console.log('Result:', JSON.stringify(result2, null, 2));
  console.log('\n---\n');

  // Wait again
  console.log('Waiting 5 seconds to avoid rate limits...\n');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Test 3: Impossible query
  console.log('Test 3: Skiing in the Alps (not in inventory)');
  const result3 = await getRecommendations(
    'skiing in the Alps',
    {},
    inventory
  );
  console.log('Result:', JSON.stringify(result3, null, 2));

  console.log('\nAll tests complete!');
}

main().catch(console.error);