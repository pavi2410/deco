import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import type { FileName } from '../types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  fileName: FileName;
}

export function CodeEditor({ value, onChange, fileName }: CodeEditorProps) {
  const getLanguageExtension = () => {
    if (fileName.endsWith('.js')) return [javascript({ jsx: false })];
    if (fileName.endsWith('.html')) return [html()];
    if (fileName.endsWith('.css')) return [css()];
    return [];
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-card px-4 py-2 border-b border-border text-[13px]">
        <span className="text-foreground">{fileName}</span>
      </div>
      <CodeMirror
        value={value}
        height="100%"
        theme={oneDark}
        extensions={getLanguageExtension()}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
        }}
      />
    </div>
  );
}
