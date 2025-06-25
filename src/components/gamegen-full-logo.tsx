export function GamegenFullLogo() {
  return (
    <div className="flex items-center gap-3" role="img" aria-label="Gamegen Logo">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
        <path d="M14 26C20.6274 26 26 20.6274 26 14C26 7.37258 20.6274 2 14 2C7.37258 2 2 7.37258 2 14C2 20.6274 7.37258 26 14 26Z" stroke="currentColor" strokeWidth="3"/>
        <path d="M26 14H14V2" stroke="currentColor" strokeWidth="3"/>
      </svg>
      <span className="text-2xl font-bold tracking-wider text-foreground">GAMEGEN</span>
    </div>
  );
}
