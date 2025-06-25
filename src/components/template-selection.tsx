'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GamegenFullLogo } from './gamegen-full-logo';

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
    name: 'Whack-the-Mole',
    difficulty: 'Medium',
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
    id: 'match-3-hard',
    name: 'Simple Match-3',
    difficulty: 'Hard',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'gems jewels matching puzzle',
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
};

export function TemplateSelection({ onSelect }: TemplateSelectionProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 items-center border-b border-border/50 px-6 sm:px-10">
        <GamegenFullLogo />
        <nav className="mx-auto">
          <ul className="flex items-center gap-8 text-muted-foreground">
            <li className="text-primary font-semibold relative">
              1. Pick Template
              <div className="absolute -bottom-[22px] left-0 w-full h-0.5 bg-primary" />
            </li>
            <li>2. Reskin</li>
            <li>3. Set Parameters</li>
            <li>4. Export</li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 overflow-y-auto p-8 sm:p-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {gameTemplates.map((template) => (
              <Card key={template.id} className="flex flex-col overflow-hidden rounded-xl bg-card/80 border-border/50 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
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
                <CardContent className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                    <Badge variant="secondary" className="font-normal">{template.difficulty}</Badge>
                  </div>
                  <Button className="w-full mt-6 text-base font-semibold" variant="secondary" size="lg" onClick={() => onSelect(template.id)}>
                    Start Customizing
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
