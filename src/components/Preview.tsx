import { useEffect, useEffectEvent } from 'react';
import type { FileContent, ConsoleLog } from '../types';

interface PreviewProps {
  files: FileContent;
  onConsoleLog: (log: ConsoleLog) => void;
  onPreviewUpdate: () => void;
}

export function Preview({ files, onConsoleLog, onPreviewUpdate }: PreviewProps) {
  const { 'style.css': styles, 'index.html': html, 'script.js': script } = files;

  const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${styles}</style>
</head>
<body>
  ${html}
  <script>
    // Intercept console methods
    (function consoleInterceptor() {
      function sendDataToParent(type, method, message) {
        window.parent.postMessage({
          type,
          method,
          message
        }, '*');
      }

      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      for (const method of ['log', 'error', 'warn', 'info']) {
        console[method] = function (...args) {
          originalConsole[method].apply(console, args);
          const message = args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch (e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');
          sendDataToParent('console', method, message);
        };
      }

      // Catch errors
      window.onerror = function (message, source, lineno, colno, error) {
        // sendDataToParent('window', 'error', { message, source, lineno, colno, error });
        sendDataToParent('console', 'error', \`Error: \${message}\`);
        return false;
      };

      // Clear console
      sendDataToParent('clear-console');
    })();
  </script>
  <script>
    // Wrap user code in IIFE to prevent variable conflicts
    (function() {
      ${script}
    })();
  </script>
</body>
</html>
    `;

  const handleMessage = useEffectEvent((event: MessageEvent) => {
    switch (event.data.type) {
      case 'console':
        onConsoleLog({
          type: event.data.method,
          message: event.data.message,
          timestamp: Date.now(),
        });
        break;
      case 'clear-console':
        onPreviewUpdate();
        break;
    }
  });

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center px-3 py-2 bg-card border-b border-border text-[13px] font-semibold">
        <span>Web View</span>
      </div>
      <iframe
        className="flex-1 border-none bg-white w-full h-full"
        sandbox="allow-scripts"
        title="Preview"
        srcDoc={fullHtml}
      />
    </div>
  );
}
