'use client';

import { MapPin, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Experience } from "@/lib/types";

interface ExperienceCardNewProps {
  experience: Experience;
  aiReasoning?: string;
}

export function ExperienceCardNew({ experience, aiReasoning }: ExperienceCardNewProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-gray-200 shadow-md relative">
      {/* Price Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white px-2 py-1 rounded-full font-bold text-lg shadow-lg">
          ${experience.price}
        </div>
      </div>

      <CardContent className="p-5 pt-16">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {experience.title}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-sm">{experience.location}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-teal-50 text-teal-700 border border-teal-200 font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* AI Reasoning */}
        {aiReasoning && (
          <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-purple-700 mb-1">AI Recommendation</p>
                <p className="text-sm text-gray-700 leading-relaxed">{aiReasoning}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

    </Card>
  );
}
