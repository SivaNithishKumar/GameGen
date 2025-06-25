'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GamegenFullLogo } from './gamegen-full-logo';
import { ArrowLeft } from 'lucide-react';

const gameTemplates = [
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    difficulty: 'Easy',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'pixel art bird city',
  },
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    difficulty: 'Medium',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'pixel art hero coin',
  },
  {
    id: 'whack-a-mole',
    name: 'Whack-a-Mole',
    difficulty: 'Easy',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'pixel art mole hole',
  },
  {
    id: 'match-3',
    name: 'Simple Match-3',
    difficulty: 'Medium',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'colorful gems jewels',
  },
  {
    id: 'crossy-road',
    name: 'Crossy Road',
    difficulty: 'Hard',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'voxel chicken road',
  },
];

type TemplateSelectionProps = {
  onSelect: (templateId: string) => void;
  onBack: () => void;
};

export function TemplateSelection({ onSelect, onBack }: TemplateSelectionProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 items-center border-b border-border/50 px-6 sm:px-10">
        <GamegenFullLogo />
        <nav className="mx-auto hidden md:flex">
          <ul className="flex items-center gap-8 text-muted-foreground">
            <li className="font-semibold text-primary relative">
              1. Pick Template
              <div className="absolute -bottom-[22px] left-0 h-0.5 w-full bg-primary" />
            </li>
            <li>2. Reskin</li>
            <li>3. Set Parameters</li>
            <li>4. Export</li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center p-8 sm:p-12">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight">Choose Your Game Template</h2>
            <p className="mt-4 text-lg text-muted-foreground">Select a starting point for your new game.</p>
          </div>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {gameTemplates.map((template) => (
              <Card key={template.id} className="flex flex-col overflow-hidden rounded-xl border-border/50 bg-card/80 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50">
                <div className="aspect-video w-full overflow-hidden">
                  <Image
                    src={template.preview}
                    alt={`${template.name} preview`}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                    data-ai-hint={template.previewHint}
                  />
                </div>
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-xl">{template.name}</CardTitle>
                    <Badge variant="secondary" className="font-normal">{template.difficulty}</Badge>
                  </div>
                  <Button className="mt-6 w-full text-base font-semibold" size="lg" onClick={() => onSelect(template.id)}>
                    Start Customizing
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-12">
            <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>
        </div>
      </main>
    </div>
  );
}
