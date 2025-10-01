import { useState, useCallback } from 'react';
import { FileTree } from './components/FileTree';
import { CodeEditor } from './components/CodeEditor';
import { Console } from './components/Console';
import { Preview } from './components/Preview';
import type { FileContent, FileName, ConsoleLog } from './types';
import './App.css';

const initialFiles: FileContent = {
  'index.html': `<div id="root">
  <h1 id="header">Hello world</h1>
</div>`,
  'script.js': `const message = 'Hello world' // Try edit me

// Update header text
document.querySelector('#header').innerHTML = message

// Log to console
console.log(message)`,
  'style.css': `body {
  margin: 0;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
  background: #1e1e1e;
  color: #fff;
}

#header {
  color: #ffd700;
  font-size: 48px;
  margin: 0;
}`,
};

function App() {
  const [files, setFiles] = useState<FileContent>(initialFiles);
  const [activeFile, setActiveFile] = useState<FileName>('script.js');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [persistLogs, setPersistLogs] = useState(false);

  const handleFileChange = useCallback((value: string) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: value,
    }));
  }, [activeFile]);

  const handleConsoleLog = useCallback((log: ConsoleLog) => {
    setConsoleLogs((prev) => [...prev, log]);
  }, []);

  const handleClearConsole = useCallback(() => {
    setConsoleLogs([]);
  }, []);

  const handleTogglePersist = useCallback(() => {
    setPersistLogs((prev) => !prev);
  }, []);

  const handlePreviewUpdate = useCallback(() => {
    if (!persistLogs) {
      setConsoleLogs([]);
    }
  }, [persistLogs]);

  const fileNames: FileName[] = ['script.js', 'style.css', 'index.html'];

  return (
    <div className="app">
      <div className="editor-container">
        <FileTree
          files={fileNames}
          activeFile={activeFile}
          onFileSelect={setActiveFile}
        />
        <CodeEditor
          value={files[activeFile]}
          onChange={handleFileChange}
          fileName={activeFile}
        />
      </div>
      <div className="output-container">
        <Console 
          logs={consoleLogs} 
          onClear={handleClearConsole}
          persistLogs={persistLogs}
          onTogglePersist={handleTogglePersist}
        />
        <Preview 
          files={files} 
          onConsoleLog={handleConsoleLog}
          onPreviewUpdate={handlePreviewUpdate}
        />
      </div>
    </div>
  );
}

export default App;
