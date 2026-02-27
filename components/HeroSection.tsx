'use client';

import { Search } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <div className="relative bg-linear-to-br from-teal-50 via-white to-orange-50 border-b border-gray-100 overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative w-32 h-32 bg-linear-to-br from-teal-100 to-orange-100 rounded-full flex items-center justify-center p-3 shrink-0">
              <div className="relative w-full h-full">
                <Image
                  src="/images/logo.png"
                  alt="Smart Travel Scout Logo"
                  fill
                  sizes="8rem"
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent">
              Smart Travel Scout
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-gray-600 text-lg sm:text-xl mb-8">
            Discover Your Perfect Sri Lankan Adventure
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              <Search className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Describe your ideal travel experience..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="text-gray-500 placeholder-gray-400 pl-12 pr-4 py-6 text-base sm:text-lg rounded-2xl border-2 border-gray-200 focus-visible:border-teal-400 shadow-lg focus-visible:shadow-xl transition-all bg-white h-auto"
            />
          </div>

          {/* Quick suggestions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-gray-500">Try:</span>
            {['Peaceful beach', 'Adventure activities', 'Cultural sites', 'Wildlife safari'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSearchChange(suggestion)}
                className="text-sm text-gray-400 px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:border-teal-400 hover:text-teal-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
