'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Bot, Gamepad2, LoaderCircle, SlidersHorizontal } from 'lucide-react';
import { GamegenFullLogo } from './gamegen-full-logo';
import { useToast } from '@/hooks/use-toast';
import { adjustGameParameters } from '@/ai/flows/adjust-game-parameters';


export type GameParameters = {
  speed: number;
  gravity: number;
  gapSize: number;
  spawnRate: number;
};

type ParameterEditorProps = {
  onBack: () => void;
  onNext: (params: GameParameters) => void;
};

export function ParameterEditor({ onBack, onNext }: ParameterEditorProps) {
  const [parameters, setParameters] = React.useState<GameParameters>({
    speed: 5,
    gravity: 3,
    gapSize: 5,
    spawnRate: 4,
  });
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  const handleParameterChange = (name: keyof GameParameters, value: number[]) => {
    setParameters((prev) => ({ ...prev, [name]: value[0] }));
  };
  
  const handleAiAdjust = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a description of the change.', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
        const result = await adjustGameParameters({
            currentParameters: {
                speed: parameters.speed,
                gravity: parameters.gravity,
                gapSize: parameters.gapSize,
                spawnRate: parameters.spawnRate
            },
            prompt: aiPrompt,
        });
        if (result.newParameters) {
            setParameters({
                speed: result.newParameters.speed,
                gravity: result.newParameters.gravity,
                gapSize: result.newParameters.gapSize,
                spawnRate: result.newParameters.spawnRate,
            });
            toast({ title: 'Success', description: 'Parameters have been adjusted by the AI.' });
            setAiPrompt('');
        }
    } catch (error) {
        console.error('Error adjusting parameters:', error);
        toast({ title: 'AI Error', description: 'Failed to adjust parameters. Please try again.', variant: 'destructive' });
    } finally {
        setIsGenerating(false);
    }
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 items-center border-b border-border/50 px-6 sm:px-10">
        <GamegenFullLogo />
        <nav className="mx-auto hidden md:flex">
          <ul className="flex items-center gap-8 text-muted-foreground">
            <li>1. Pick Template</li>
            <li>2. Reskin</li>
            <li className="font-semibold text-primary relative">
              3. Set Parameters
              <div className="absolute -bottom-[22px] left-0 h-0.5 w-full bg-primary" />
            </li>
            <li>4. Export</li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center p-8">
        <div className="text-center">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3"><SlidersHorizontal /> Set Game Parameters</h2>
            <p className="mt-2 text-muted-foreground">Adjust game settings or ask the AI to do it for you.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mt-8">
            <Card>
                <CardContent className="p-6">
                    <CardTitle className="mb-6">Parameters</CardTitle>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="speed">Speed (1-10): {parameters.speed}</Label>
                            <Slider id="speed" min={1} max={10} step={1} value={[parameters.speed]} onValueChange={(val) => handleParameterChange('speed', val)} />
                        </div>
                         <div>
                            <Label htmlFor="gravity">Gravity (1-10): {parameters.gravity}</Label>
                            <Slider id="gravity" min={1} max={10} step={1} value={[parameters.gravity]} onValueChange={(val) => handleParameterChange('gravity', val)} />
                        </div>
                        <div>
                            <Label htmlFor="gapSize">Gap Size (1-10): {parameters.gapSize}</Label>
                            <Slider id="gapSize" min={1} max={10} step={1} value={[parameters.gapSize]} onValueChange={(val) => handleParameterChange('gapSize', val)} />
                        </div>
                        <div>
                            <Label htmlFor="spawnRate">Spawn Rate (1-10): {parameters.spawnRate}</Label>
                            <Slider id="spawnRate" min={1} max={10} step={1} value={[parameters.spawnRate]} onValueChange={(val) => handleParameterChange('spawnRate', val)} />
                        </div>
                    </div>
                     <div className="mt-8 border-t pt-6">
                        <Label htmlFor="aiPrompt" className="text-base font-semibold">🤖 AI Assistant</Label>
                        <p className="text-sm text-muted-foreground mb-2">Describe a change, e.g., "make it more challenging" or "make the player faster".</p>
                        <div className="flex w-full items-center space-x-2">
                             <Input 
                                id="aiPrompt"
                                placeholder="e.g., Make the game easier for a beginner" 
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                disabled={isGenerating}
                            />
                            <Button onClick={handleAiAdjust} disabled={isGenerating}>
                                {isGenerating ? <LoaderCircle className="animate-spin" /> : <Bot />}
                                <span className="ml-2 hidden sm:inline">Adjust</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <CardTitle className="mb-4">Live Preview</CardTitle>
                    <div className="aspect-video w-full flex items-center justify-center rounded-lg border-2 border-dashed bg-card">
                        <div className="text-center text-muted-foreground p-4">
                            <Gamepad2 className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-lg font-semibold">Live Game Preview</p>
                            <p className="text-sm">Game mechanics will update here based on your parameters.</p>
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm">
                        <p>Score: 42</p>
                        <p>Lives: 3</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="mt-12 flex w-full max-w-6xl justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2" />
            Back to Reskin
          </Button>
          <Button onClick={() => onNext(parameters)}>
            Enter Chat Mode
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}
