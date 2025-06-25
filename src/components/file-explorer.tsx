'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import * as React from 'react';

export type FileNode = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  previewContent?: string;
  children?: FileNode[];
};

type FileExplorerProps = {
  fileTree: FileNode;
  onFileSelect: (filePath: string) => void;
  activeFile: string;
};

const FileNodeEntry = ({ node, onFileSelect, activeFile, level, path }: { node: FileNode; onFileSelect: (filePath: string) => void; activeFile: string; level: number, path: string }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const currentPath = path ? `${path}/${node.name}` : node.name;

  if (node.type === 'folder') {
    return (
      <div>
        <div
          className="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent"
          onClick={() => setIsOpen(!isOpen)}
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          <ChevronRight className={cn('mr-2 h-4 w-4 flex-shrink-0 transition-transform', isOpen && 'rotate-90')} />
          {isOpen ? <FolderOpen className="mr-2 h-4 w-4 text-primary" /> : <Folder className="mr-2 h-4 w-4 text-primary" />}
          <span>{node.name}</span>
        </div>
        {isOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <FileNodeEntry key={child.name} node={child} onFileSelect={onFileSelect} activeFile={activeFile} level={level + 1} path={node.name === 'GameGen Project' ? '' : currentPath} />
            ))}
          </div>
        )}
      </div>
    );
  }
  
  const filePath = path ? `${path}/${node.name}` : node.name;

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start rounded-md px-2 py-1.5 text-sm',
        activeFile === filePath && 'bg-accent font-semibold'
      )}
      onClick={() => onFileSelect(filePath)}
      style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
    >
      <File className="mr-2 h-4 w-4 flex-shrink-0" />
      <span>{node.name}</span>
    </Button>
  );
};

export function FileExplorer({ fileTree, onFileSelect, activeFile }: FileExplorerProps) {
  return (
    <div className="flex h-full flex-col">
       <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      <div className="flex-1 p-2">
        <FileNodeEntry node={fileTree} onFileSelect={onFileSelect} activeFile={activeFile} level={0} path="" />
      </div>
    </div>
  );
}
