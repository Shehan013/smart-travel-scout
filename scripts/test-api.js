/**
 * Test script for the /api/recommend endpoint
 * 
 * This script tests the API route locally
 * Make sure the dev server is running: npm run dev
 * 
 * Usage: node scripts/test-api.js
 */

async function testAPI() {
  const baseURL = 'http://localhost:3000';
  
  console.log('Testing /api/recommend endpoint...\n');

  // Test 1: GET request (should return API info)
  console.log('Test 1: GET request (API info)');
  try {
    const getResponse = await fetch(`${baseURL}/api/recommend`);
    const getInfo = await getResponse.json();
    console.log('Response:', JSON.stringify(getInfo, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  console.log('\n---\n');

  // Test 2: Simple beach query
  console.log('Test 2: Beach vacation query');
  try {
    const response = await fetch(`${baseURL}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'beach vacation under $100',
      }),
    });

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  console.log('\n---\n');

  // Test 3: Query with filters
  console.log('Test 3: Query with price filters');
  try {
    const response = await fetch(`${baseURL}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'adventure experience',
        filters: {
          minPrice: 0,
          maxPrice: 150,
          selectedTags: ['adventure'],
        },
      }),
    });

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  console.log('\n---\n');

  // Test 4: Invalid request (should return validation error)
  console.log('Test 4: Invalid request (too short query)');
  try {
    const response = await fetch(`${baseURL}/api/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'ab', // Too short (min 3 characters)
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
  console.log('\n---\n');

  console.log('All API tests complete!');
}

// Run tests
testAPI().catch(console.error);
