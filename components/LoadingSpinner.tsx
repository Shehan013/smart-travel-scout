import Image from 'next/image';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Finding your perfect experience...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-6 relative w-24 h-24">
        <Image
          src="/images/logo.png"
          alt="Smart Travel Scout Logo"
          fill
          sizes="96px"
          className="object-contain"
          priority
        />
      </div>

      <div className="flex space-x-2 mb-4">
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}
