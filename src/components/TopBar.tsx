import { ModeToggle } from './mode-toggle'

export function TopBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Deco</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </div>
  )
}
