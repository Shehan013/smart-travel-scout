import { testValidation } from '@/lib/test-validation';

export default function Home() {
  testValidation();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Smart Travel Scout</h1>
      <p>Check your terminal/console for test results!</p>
    </main>
  );
}