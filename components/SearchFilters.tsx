/** 
 * Displays price range sliders and tag checkboxes
 */

import { formatPrice, formatTag } from '@/lib/utils';

/**
 * TypeScript Interface for component props
 */
interface SearchFiltersProps {
  minPrice: number;
  maxPrice: number;
  selectedTags: string[];
  availableTags: string[];
  priceRange: { min: number; max: number };
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export default function SearchFilters({
  minPrice,
  maxPrice,
  selectedTags,
  availableTags,
  priceRange,
  onMinPriceChange,
  onMaxPriceChange,
  onTagToggle,
  onClearFilters,
}: SearchFiltersProps) {
  
  // Check if any filters are active
  const hasActiveFilters =
    minPrice > priceRange.min ||
    maxPrice < priceRange.max ||
    selectedTags.length > 0;

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            $ Price Range: {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </label>
          <div className="space-y-2">
            {/* Min Price Slider */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">Min</span>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={minPrice}
                onChange={(e) => onMinPriceChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs font-medium text-gray-700 w-16 text-right">
                {formatPrice(minPrice)}
              </span>
            </div>
            {/* Max Price Slider */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">Max</span>
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs font-medium text-gray-700 w-16 text-right">
                {formatPrice(maxPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Tag Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags ({selectedTags.length} selected)
          </label>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagToggle(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {formatTag(tag)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
