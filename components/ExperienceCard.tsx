/**
 * ExperienceCard Component
 * 
 * Displays a single travel experience with all its details
 */

import { Experience } from '@/lib/types';
import { formatPrice, formatTag } from '@/lib/utils';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="h-2 bg-linear-to-r from-indigo-500 to-purple-500"></div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {experience.title}
          </h3>
          <p className="text-gray-600 flex items-center gap-1">
            <span>📍</span>
            <span>{experience.location}</span>
          </p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full">
            <span className="font-bold text-lg">{formatPrice(experience.price)}</span>
            <span className="text-sm ml-1">per person</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {experience.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              #{formatTag(tag)}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      {/* <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full text-center text-indigo-600 hover:text-indigo-800 font-medium text-sm">
          View Details →
        </button>
      </div> */}
    </div>
  );
}
