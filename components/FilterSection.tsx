'use client';

import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterSectionProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  selectedTags: string[];
  availableTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  defaultPriceRange: { min: number; max: number };
}

export function FilterSection({
  priceRange,
  onPriceRangeChange,
  selectedTags,
  availableTags,
  onTagToggle,
  onClearFilters,
  defaultPriceRange,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasActiveFilters = selectedTags.length > 0 || 
    priceRange[0] !== defaultPriceRange.min || 
    priceRange[1] !== defaultPriceRange.max;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile Toggle Header */}
        <div className="flex items-center justify-between mb-4 lg:mb-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filters</h2>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 bg-teal-100 text-teal-700 border-teal-200">
                {selectedTags.length + 
                  (priceRange[0] !== defaultPriceRange.min || priceRange[1] !== defaultPriceRange.max ? 1 : 0)}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Filters Content */}
        <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <span className="text-sm text-gray-600">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              min={defaultPriceRange.min}
              max={defaultPriceRange.max}
              step={10}
              className="w-full"
            />
          </div>

          {/* Tag Filters */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-3">Categories</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
