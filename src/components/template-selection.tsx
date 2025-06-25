'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const gameTemplates = [
  {
    id: 'flappy-bird',
    name: 'Flappy Bird',
    difficulty: 'Simple',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'flying bird obstacle',
  },
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    difficulty: 'Medium',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'running character platformer',
  },
  {
    id: 'whack-a-mole',
    name: 'Whack-a-Mole',
    difficulty: 'Simple',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'mole hole hammer',
  },
  {
    id: 'match-3',
    name: 'Match-3',
    difficulty: 'Medium',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'gems jewels matching',
  },
  {
    id: 'crossy-road',
    name: 'Crossy Road',
    difficulty: 'Medium',
    preview: 'https://placehold.co/600x400.png',
    previewHint: 'character crossing road',
  },
];

type TemplateSelectionProps = {
  onBack: () => void;
  onSelect: (templateId: string) => void;
};

export function TemplateSelection({ onBack, onSelect }: TemplateSelectionProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 items-center border-b px-6">
        <h1 className="font-headline text-2xl font-bold">🎮 Choose Your Game Template</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gameTemplates.map((template) => (
              <Card key={template.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-[4/3] w-full">
                  <Image
                    src={template.preview}
                    alt={`${template.name} preview`}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                    data-ai-hint={template.previewHint}
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">{template.difficulty}</Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => onSelect(template.id)}>Select</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
