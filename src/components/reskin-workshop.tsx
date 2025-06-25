'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, Gamepad2, LoaderCircle, Music, Palette, Bot } from 'lucide-react';
import { GamegenFullLogo } from './gamegen-full-logo';
import { generateGameAssets } from '@/ai/flows/generate-game-assets';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ReskinWorkshopProps = {
  onBack: () => void;
  onNext: () => void;
};

type Asset = 'player' | 'background' | 'obstacles' | 'music';
const assetTypes: Asset[] = ['player', 'background', 'obstacles', 'music'];

type GeneratedAssets = {
  [key in Asset]: string | null;
};

type GenerationStatus = {
  [key in Asset]: boolean;
};

export function ReskinWorkshop({ onBack, onNext }: ReskinWorkshopProps) {
  const [theme, setTheme] = React.useState('');
  const [generatedAssets, setGeneratedAssets] = React.useState<GeneratedAssets>({
    player: null,
    background: null,
    obstacles: null,
    music: null,
  });
  const [isGenerating, setIsGenerating] = React.useState<GenerationStatus>({
    player: false,
    background: false,
    obstacles: false,
    music: false,
  });
  const [isAnythingGenerating, setIsAnythingGenerating] = React.useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!theme.trim()) {
      toast({ title: 'Error', description: 'Please enter a theme description.', variant: 'destructive' });
      return;
    }

    setIsGenerating({ player: true, background: true, obstacles: true, music: true });
    setIsAnythingGenerating(true);

    const assetPromises = assetTypes.map(async (asset) => {
      try {
        const result = await generateGameAssets({
          assetType: asset === 'music' ? 'music' : 'image',
          theme: theme,
          prompt: `A ${asset} for a ${theme} themed game.`,
        });
        setGeneratedAssets((prev) => ({ ...prev, [asset]: result.assetData }));
      } catch (error) {
        console.error(`Error generating ${asset}:`, error);
        toast({ title: 'Generation Error', description: `Failed to generate the ${asset}. Please try again.`, variant: 'destructive' });
      } finally {
        setIsGenerating((prev) => ({ ...prev, [asset]: false }));
      }
    });

    await Promise.all(assetPromises);
    setIsAnythingGenerating(false);
  };
  
  const allAssetsGenerated = Object.values(generatedAssets).every(asset => asset !== null);

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
      <main className="flex-1 flex flex-col items-center p-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3">
              <Palette /> AI Reskin Workshop
            </h2>
            <p className="mt-2 text-muted-foreground">Describe your game theme (e.g., cyberpunk, medieval fantasy, cute forest animals)</p>
        </div>
        
        <div className="my-8 flex w-full max-w-lg items-center space-x-2">
            <Input
                type="text"
                placeholder="Theme: e.g., 'a retro-futuristic synthwave city'"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                disabled={isAnythingGenerating}
            />
            <Button onClick={handleGenerate} disabled={isAnythingGenerating}>
                {isAnythingGenerating ? <LoaderCircle className="animate-spin" /> : <Bot />}
                <span className="ml-2 hidden sm:inline">Generate</span>
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
            <Card>
                <CardContent className="p-6">
                    <CardTitle className="mb-4">Generated Assets</CardTitle>
                    <div className="space-y-4">
                        {assetTypes.map((asset) => (
                             <div key={asset} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                <span className="capitalize font-medium">{asset}</span>
                                {isGenerating[asset] ? (
                                    <LoaderCircle className="animate-spin text-primary" />
                                ) : generatedAssets[asset] ? (
                                    <CheckCircle className="text-green-500" />
                                ) : (
                                    <div className="w-6 h-6" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Generated Music:</h4>
                        {generatedAssets.music ? (
                             <audio controls src={generatedAssets.music} className="w-full">
                                Your browser does not support the audio element.
                            </audio>
                        ) : (
                            <p className="text-sm text-muted-foreground">Music will appear here once generated.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <CardTitle className="mb-4">Live Game Preview</CardTitle>
                    <div className="aspect-video w-full flex items-center justify-center rounded-lg border-2 border-dashed bg-card relative overflow-hidden">
                        {generatedAssets.background ? (
                             <Image src={generatedAssets.background} alt="Game Background" layout="fill" objectFit="cover" data-ai-hint="game background" />
                        ): (
                            <div className="text-center text-muted-foreground p-4">
                                <Gamepad2 className="mx-auto h-12 w-12" />
                                <p className="mt-2 text-lg font-semibold">Preview your reskinned game</p>
                            </div>
                        )}
                        {generatedAssets.player && (
                             <Image src={generatedAssets.player} alt="Player" width={64} height={64} className="z-10 animate-bounce" data-ai-hint="game player character" />
                        )}
                         {generatedAssets.obstacles && (
                             <Image src={generatedAssets.obstacles} alt="Obstacle" width={64} height={128} className="z-10 absolute bottom-1/2 right-1/4" data-ai-hint="game obstacle" />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>


        <div className="mt-12 flex w-full max-w-6xl justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2" />
            Back to Templates
          </Button>
          <Button onClick={onNext} disabled={!allAssetsGenerated}>
            Continue to Parameters
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}
