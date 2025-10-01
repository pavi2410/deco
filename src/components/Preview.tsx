import { useEffect, useRef } from 'react';
import type { FileContent, ConsoleLog } from '../types';

interface PreviewProps {
  files: FileContent;
  onConsoleLog: (log: ConsoleLog) => void;
  onPreviewUpdate: () => void;
}

export function Preview({ files, onConsoleLog, onPreviewUpdate }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    // Clear console on preview update
    onPreviewUpdate();

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    // Create the complete HTML document with injected console interceptor
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${files['style.css']}</style>
</head>
<body>
  ${files['index.html']}
  <script>
    // Intercept console methods
    (function() {
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      ['log', 'error', 'warn', 'info'].forEach(method => {
        console[method] = function(...args) {
          originalConsole[method].apply(console, args);
          window.parent.postMessage({
            type: 'console',
            method: method,
            message: args.map(arg => {
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch (e) {
                  return String(arg);
                }
              }
              return String(arg);
            }).join(' ')
          }, '*');
        };
      });

      // Catch errors
      window.onerror = function(message, source, lineno, colno, error) {
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          message: \`Error: \${message}\`
        }, '*');
        return false;
      };
    })();
  </script>
  <script>
    // Wrap user code in IIFE to prevent variable conflicts
    (function() {
      ${files['script.js']}
    })();
  </script>
</body>
</html>
    `;

    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();
  }, [files, onPreviewUpdate]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        onConsoleLog({
          type: event.data.method,
          message: event.data.message,
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center px-3 py-2 bg-card border-b border-border text-[13px] font-semibold">
        <span>Web View</span>
      </div>
      <iframe
        ref={iframeRef}
        className="flex-1 border-none bg-white w-full h-full"
        sandbox="allow-scripts allow-same-origin"
        title="Preview"
      />
    </div>
  );
}
