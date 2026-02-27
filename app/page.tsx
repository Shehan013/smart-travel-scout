'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Experience } from '@/lib/types';
import { getAllTags, getPriceRange } from '@/lib/inventory';
import ExperienceCard from '@/components/ExperienceCard';
import SearchFilters from '@/components/SearchFilters';

/**
 * This defines the shape of search results
 */
interface SearchResults {
  recommendations: Experience[];
  reasoning: string;
  matchedTags: string[];
  processingTime?: number;
}

export default function Home() {
  // useState<Type> tells TypeScript what type the state will be
  
  const [query, setQuery] = useState<string>(''); // User's search query
  const [minPrice, setMinPrice] = useState<number>(0); 
  const [maxPrice, setMaxPrice] = useState<number>(300); 
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 
  const [results, setResults] = useState<SearchResults | null>(null); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 

  const availableTags = getAllTags(); 
  const priceRange = getPriceRange(); 

  /**
   * Handle form submission
   */
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload on form submit
    
    // Validation: Require at least 3 characters
    if (query.trim().length < 3) {
      setError('Please enter at least 3 characters');
      return;
    }

    // Reset previous state
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          filters: {
            minPrice,
            maxPrice,
            selectedTags: selectedTags.length > 0 ? selectedTags : undefined,
          },
        }),
      });

      const data = await response.json();

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      // Update state with results
      setResults(data);
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle tag selection toggle
   */
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      // If tag is already selected, remove it; otherwise add it
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag]; 
      }
    });
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setSelectedTags([]);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-blue-900">
            Smart Travel Scout
          </h1>
          <p className="mt-2 text-blue-600">
            Find your perfect travel experience using AI-powered recommendations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-medium font-medium text-gray-700 mb-2">
                What are you looking for?
              </label>
              <input
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., 'a chilled beach weekend with surfing vibes under $100'"
                className="w-full px-4 py-3 border border-gray-700 rounded-lg placeholder-gray-300 text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Filters Component */}
            <SearchFilters
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedTags={selectedTags}
              availableTags={availableTags}
              priceRange={priceRange}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onTagToggle={handleTagToggle}
              onClearFilters={handleClearFilters}
            />

            <button
              type="submit"
              disabled={loading || query.trim().length < 3}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Find Experiences'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* AI Reasoning */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-indigo-900 mb-2">
                AI Analysis
              </h2>
              <p className="text-gray-800">{results.reasoning}</p>
              {/* {results.processingTime && (
                <p className="text-sm text-indigo-600 mt-2">
                  Processed in {results.processingTime}ms
                </p>
              )} */}
              {results.matchedTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* <span className="text-sm text-indigo-700 font-medium">Matched tags:</span> */}
                  {results.matchedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-300 text-gray-700 text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            {results.recommendations.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Recommended for You ({results.recommendations.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.recommendations.map((experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <p className="font-medium"> No matches found</p>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {/* Initial State (No search yet) */}
        {!results && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Enter a search query to discover amazing travel experiences
            </p>
          </div>
        )}
      </div>
    </main>
  );
}