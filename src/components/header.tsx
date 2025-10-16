import { Fan } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <Fan className="h-8 w-8 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-headline text-foreground dark:text-glow">
              Smart Ventilation System — Coal Mine Safety
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
