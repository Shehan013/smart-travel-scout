import { NextRequest, NextResponse } from 'next/server';
import { getAllExperiences, filterExperiences } from '@/lib/inventory';
import { getRecommendations } from '@/lib/gemini';
import { SearchRequestSchema } from '@/lib/validation';
import { validateEnvironment } from '@/lib/safety';

/**
 * API Route: POST /api/recommend
 * 
 * This is a Next.js Route Handler (serverless function)
 * It receives user queries and returns AI-powered travel recommendations
 * 
 * Key concepts:
 * - Runs on the server (API keys are safe here)
 * - Processes requests asynchronously
 * - Returns JSON responses
 * - Handles errors gracefully
 */

/**
 * POST handler for recommendation requests
 * 
 * @param req - NextRequest object containing the request data
 * @returns JSON response with recommendations or error message
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    //  Validate environment variables are set
    validateEnvironment();

    // Parse request body - Extract the JSON data from the incoming request
    const body = await req.json();
    console.log('Received request:', {
      query: body.query,
      filters: body.filters,
    });

    // Validate request structure with Zod
    const validation = SearchRequestSchema.safeParse(body);

    if (!validation.success) {
      console.error('Invalid request format:', validation.error.message);
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: validation.error.message,
        },
        { status: 400 } 
      );
    }

    const { query, filters = {} } = validation.data;

    //  Load inventory - Get all available travel experiences
    const allExperiences = getAllExperiences();

    //  Apply client-side filters BEFORE calling LLM
    // This reduces the context size sent to the AI and saves tokens
    const filteredInventory = filterExperiences(
      allExperiences,
      filters.minPrice,
      filters.maxPrice,
      filters.selectedTags
    );

    console.log(
      `Filtered inventory: ${filteredInventory.length}/${allExperiences.length} experiences`
    );

    // Handle edge case - No experiences match the filters
    if (filteredInventory.length === 0) {
      return NextResponse.json({
        recommendations: [],
        reasoning: 'No experiences match your price range or tag filters. Try adjusting your filters.',
        matchedTags: [],
        processingTime: Date.now() - startTime,
      });
    }

    // Call Gemini AI with the filtered inventory
    const llmResult = await getRecommendations(
      query,
      filters,
      filteredInventory
    );

    // Retrieve full experience objects from validated IDs
    // Convert IDs back to full experience data for the client
    const recommendations = allExperiences.filter((exp) =>
      llmResult.experience_ids.includes(exp.id)
    );

    // Calculate processing time for monitoring
    const processingTime = Date.now() - startTime;
    console.log(`Request processed in ${processingTime}ms`);
    console.log(`Returning ${recommendations.length} recommendations`);

    // Return successful response
    return NextResponse.json({
      recommendations,
      reasoning: llmResult.reasoning,
      matchedTags: llmResult.matched_tags || [],
      processingTime,
    });

  } catch (error) {
    // Error handling: Catch any unexpected errors
    console.error('API route error:', error);

    // Check for specific error types
    if (error instanceof Error) {
      // API key missing or configuration error
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          {
            error: 'Server configuration error',
            message: 'AI service is not properly configured',
          },
          { status: 500 } 
        );
      }

      // Rate limit error from Gemini
      if (error.message.includes('429') || error.message.includes('quota')) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again in a moment.',
          },
          { status: 429 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Unable to process your request. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Returns API information
 */
export async function GET() {
  return NextResponse.json({
    message: 'Smart Travel Scout Recommendation API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/recommend',
      description: 'Send a natural language query to get travel recommendations',
    },
    example: {
      query: 'beach vacation under $100',
      filters: {
        minPrice: 0,
        maxPrice: 100,
        selectedTags: ['beach', 'surfing'],
      },
    },
  });
}
