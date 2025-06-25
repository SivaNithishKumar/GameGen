'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GamegenFullLogo } from './gamegen-full-logo';

type ReskinWorkshopProps = {
  onBack: () => void;
  onNext: () => void;
};

export function ReskinWorkshop({ onBack, onNext }: ReskinWorkshopProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 items-center border-b border-border/50 px-6 sm:px-10">
        <GamegenFullLogo />
        <nav className="mx-auto">
          <ul className="flex items-center gap-8 text-muted-foreground">
            <li>1. Pick Template</li>
            <li className="text-primary font-semibold relative">
              2. Reskin
              <div className="absolute -bottom-[22px] left-0 w-full h-0.5 bg-primary" />
            </li>
            <li>3. Set Parameters</li>
            <li>4. Export</li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold">🎨 AI Reskin Workshop</h2>
            <p className="mt-2 text-muted-foreground">This is where you'll use AI to change the theme and assets of your game.</p>
        </div>

        <div className="mt-12 flex w-full max-w-md justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2" />
            Back to Templates
          </Button>
          <Button onClick={onNext}>
            Continue to Parameters
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}
