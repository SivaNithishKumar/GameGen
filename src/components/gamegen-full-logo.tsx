import { Gamepad2 } from 'lucide-react';

export function GamegenFullLogo() {
  return (
    <div className="flex items-center gap-3" role="img" aria-label="Gamegen Logo">
      <Gamepad2 className="h-7 w-7 text-primary" />
      <span className="text-2xl font-bold tracking-wider text-foreground">GAMEGEN</span>
    </div>
  );
}
