import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import SchoolLogo from "/public/school-logo.png";

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image src={SchoolLogo} alt="School Logo" width={40} height={40} />
            <h1 className="text-xl md:text-2xl font-bold font-headline text-foreground dark:text-glow">
              Smart Ventilation System — Vanasthali Public School
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}