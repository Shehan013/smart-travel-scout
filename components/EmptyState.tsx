'use client';

import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-results" | "initial";
  onReset?: () => void;
}

export function EmptyState({ type, onReset }: EmptyStateProps) {
  if (type === "initial") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-linear-to-br from-teal-100 to-orange-100 w-30 h-30 rounded-full flex items-center justify-center mx-auto mb-6 p-4">
            <div className="relative w-full h-full">
              <Image
                src="/images/logo.png"
                alt="Smart Travel Scout Logo"
                fill
                sizes="120px"
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Ready to Explore Sri Lanka?
          </h2>
          <p className="text-gray-600 mb-6">
            Start your journey by describing your ideal travel experience in the search bar above. 
            Our AI will help you discover the perfect adventures tailored just for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          No Experiences Found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn&apos;t find any travel experiences matching your criteria. 
          Try adjusting your filters or search query to discover more options.
        </p>
        <div className="space-y-3">
          {onReset && (
            <Button
              onClick={onReset}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Clear Filters & Try Again
            </Button>
          )}
          <p className="text-sm text-gray-500">
             Tip: Use more general terms like &quot;beach&quot; or &quot;adventure&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
