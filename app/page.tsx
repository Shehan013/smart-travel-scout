import { testInventory } from '@/lib/test-inventory';

export default function Home() {
  testInventory();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Smart Travel Scout</h1>
      <p>Check your terminal/console for test results!</p>
    </main>
  );
}