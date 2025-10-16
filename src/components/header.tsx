import { AreaChart } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <AreaChart className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold font-headline text-foreground">
              RealTimeViz
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
