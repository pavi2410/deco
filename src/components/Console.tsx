import type { ConsoleLog } from '../types';

interface ConsoleProps {
  logs: ConsoleLog[];
  onClear: () => void;
  persistLogs: boolean;
  onTogglePersist: () => void;
}

export function Console({ logs, onClear, persistLogs, onTogglePersist }: ConsoleProps) {
  const getLogClass = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'console-error';
      case 'warn':
        return 'console-warn';
      case 'info':
        return 'console-info';
      default:
        return 'console-log';
    }
  };

  return (
    <div className="console">
      <div className="console-header">
        <span>Console</span>
        <div className="console-controls">
          <label className="console-persist">
            <input
              type="checkbox"
              checked={persistLogs}
              onChange={onTogglePersist}
            />
            <span>Persist logs</span>
          </label>
          <button onClick={onClear} className="console-clear">
            Clear
          </button>
        </div>
      </div>
      <div className="console-content">
        {logs.length === 0 ? (
          <div className="console-empty">Console output will appear here...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`console-line ${getLogClass(log.type)}`}>
              {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
