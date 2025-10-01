import { TreeView } from '@/components/tree-view';
import { File, FileCode, FileType } from 'lucide-react';
import type { FileName } from '../types';

interface FileTreeProps {
  files: FileName[];
  activeFile: FileName;
  onFileSelect: (file: FileName) => void;
}

export function FileTree({ files, activeFile, onFileSelect }: FileTreeProps) {
  const getFileIcon = (fileName: FileName) => {
    if (fileName.endsWith('.html')) return FileType;
    if (fileName.endsWith('.js')) return FileCode;
    if (fileName.endsWith('.css')) return FileType;
    return File;
  };

  const treeData = files.map((file) => ({
    id: file,
    name: file,
    icon: getFileIcon(file),
    onClick: () => onFileSelect(file),
  }));

  return (
    <div className="h-full bg-card flex flex-col">
      <div className="px-3 py-2 text-[11px] font-semibold text-muted-foreground border-b border-border uppercase">
        FILES
      </div>
      <div className="flex-1 overflow-auto">
        <TreeView
          data={treeData}
          className="p-2"
          initialSelectedItemId={activeFile}
          onSelectChange={(item) => item && onFileSelect(item.id as FileName)}
        />
      </div>
    </div>
  );
}
