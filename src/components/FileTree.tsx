import type { FileName } from '../types';

interface FileTreeProps {
  files: FileName[];
  activeFile: FileName;
  onFileSelect: (file: FileName) => void;
}

export function FileTree({ files, activeFile, onFileSelect }: FileTreeProps) {
  const getFileIcon = (fileName: FileName) => {
    if (fileName.endsWith('.html')) return '📄';
    if (fileName.endsWith('.js')) return '📜';
    if (fileName.endsWith('.css')) return '🎨';
    return '📄';
  };

  return (
    <div className="file-tree">
      <div className="file-tree-header">FILES</div>
      <div className="file-list">
        {files.map((file) => (
          <div
            key={file}
            className={`file-item ${activeFile === file ? 'active' : ''}`}
            onClick={() => onFileSelect(file)}
          >
            <span className="file-icon">{getFileIcon(file)}</span>
            <span className="file-name">{file}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
