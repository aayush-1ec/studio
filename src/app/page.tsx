import Header from '@/components/header';
import Dashboard from '@/components/dashboard';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow p-4 md:p-6">
        <Dashboard />
      </main>
    </div>
  );
}
