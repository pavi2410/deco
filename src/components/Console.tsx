import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ConsoleLog } from '../types';

interface ConsoleProps {
  logs: ConsoleLog[];
  onClear: () => void;
  persistLogs: boolean;
  onTogglePersist: () => void;
}

export function Console({ logs, onClear, persistLogs, onTogglePersist }: ConsoleProps) {
  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-destructive';
      case 'warn':
        return 'text-chart-1';
      case 'info':
        return 'text-chart-2';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex justify-between items-center px-3 py-2 bg-card border-b border-border text-[13px] font-semibold">
        <span>Console</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground cursor-pointer hover:text-foreground">
            <input
              type="checkbox"
              checked={persistLogs}
              onChange={onTogglePersist}
              className="cursor-pointer"
            />
            <span>Persist logs</span>
          </label>
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-transparent"
          >
            Clear
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        {logs.length === 0 ? (
          <div className="text-muted-foreground italic text-[12px] font-mono">Console output will appear here...</div>
        ) : (
          <div className="font-mono text-[12px]">
            {logs.map((log, index) => (
              <div key={index} className={`py-0.5 break-words ${getLogColor(log.type)}`}>
                {log.message}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
