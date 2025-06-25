'use client';

import { ArrowLeft, Download, PanelLeft, PanelLeftClose, PanelRight, PanelRightClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from './logo';

type AppHeaderProps = {
  leftPanelCollapsed: boolean;
  toggleLeftPanel: () => void;
  rightPanelCollapsed: boolean;
  toggleRightPanel: () => void;
  onBack: () => void;
};

export function AppHeader({
  leftPanelCollapsed,
  toggleLeftPanel,
  rightPanelCollapsed,
  toggleRightPanel,
  onBack
}: AppHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card/80 px-4 backdrop-blur-sm">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to projects">
        <ArrowLeft />
      </Button>
      <Button variant="ghost" size="icon" onClick={toggleLeftPanel} aria-label="Toggle file explorer">
        {leftPanelCollapsed ? <PanelLeft /> : <PanelLeftClose />}
      </Button>
      <div className="flex items-center gap-2">
        <Logo />
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          GameGen
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline">
          <Download className="mr-2" />
          Export HTML5
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={toggleRightPanel} aria-label="Toggle chat panel">
          {rightPanelCollapsed ? <PanelRight /> : <PanelRightClose />}
        </Button>
      </div>
    </header>
  );
}
