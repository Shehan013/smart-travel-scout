'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Experience } from '@/lib/types';
import { getAllTags, getPriceRange } from '@/lib/inventory';
import { HeroSection } from '@/components/HeroSection';
import { FilterSection } from '@/components/FilterSection';
import { ExperienceCardNew } from '@/components/ExperienceCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
  const availableTags = getAllTags(); 
  const priceRange = getPriceRange();

  // useState<Type> tells TypeScript what type the state will be
  const [query, setQuery] = useState<string>(''); // User's search query
  const [minPrice, setMinPrice] = useState<number>(priceRange.min); 
  const [maxPrice, setMaxPrice] = useState<number>(priceRange.max); 
  const [selectedTags, setSelectedTags] = useState<string[]>([]); 
  const [results, setResults] = useState<SearchResults | null>(null); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null); 

  /**
   * Handle form submission
   */
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload on form submit
    
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
    <main className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Search */}
      <form onSubmit={handleSearch}>
        <HeroSection 
          searchQuery={query}
          onSearchChange={setQuery}
        />

        {/* Search Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            type="submit"
            disabled={loading || query.trim().length < 3}
            className="w-full bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed h-auto"
          >
            {loading ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Find Experiences
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-sm">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </form>

      {/* Filter Section */}
      <FilterSection
        priceRange={[minPrice, maxPrice]}
        onPriceRangeChange={([min, max]) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        selectedTags={selectedTags}
        availableTags={availableTags}
        onTagToggle={handleTagToggle}
        onClearFilters={handleClearFilters}
        defaultPriceRange={priceRange}
      />


      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Results Section */}
      {results && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">          
          {/* Recommendations */}
          {results.recommendations.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-700 mb-6">
                Recommended for You <span className="text-gray-600">({results.recommendations.length})</span>
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.recommendations.map((experience) => (
                  <ExperienceCardNew 
                    key={experience.id} 
                    experience={experience}
                    aiReasoning={results.reasoning}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState type="no-results" onReset={handleClearFilters} />
          )}
        </div>
      )}

      {/* Initial State (No search yet) */}
      {!results && !loading && !error && <EmptyState type="initial" />}
    </main>
  );
}