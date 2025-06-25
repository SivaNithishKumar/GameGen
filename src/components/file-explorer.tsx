'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react';
import * as React from 'react';

const fileTreeData = {
  name: 'Gemini Game',
  type: 'folder',
  children: [
    { name: 'index.html', type: 'file', content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Game</title>
    <style>
        body { margin: 0; overflow: hidden; background: #111; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script src="js/main.js"></script>
</body>
</html>` },
    {
      name: 'js',
      type: 'folder',
      children: [{ name: 'main.js', type: 'file', content: `console.log("Game started!");\nconst canvas = document.createElement('canvas');\ndocument.body.appendChild(canvas);\nconst ctx = canvas.getContext('2d');\ncanvas.width = window.innerWidth;\ncanvas.height = window.innerHeight;\n\n// Game loop\nfunction gameLoop() {\n    ctx.fillStyle = '#333';\n    ctx.fillRect(0, 0, canvas.width, canvas.height);\n    requestAnimationFrame(gameLoop);\n}\n\ngameLoop();` }],
    },
    {
      name: 'assets',
      type: 'folder',
      children: [
        { name: 'player.png', type: 'file' },
        { name: 'enemy.png', type: 'file' },
      ],
    },
  ],
};

type FileNode = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
};

type FileExplorerProps = {
  onFileSelect: (file: FileNode) => void;
  activeFile: string;
};

const FileNodeEntry = ({ node, onFileSelect, activeFile, level }: { node: FileNode; onFileSelect: (file: FileNode) => void; activeFile: string; level: number }) => {
  const [isOpen, setIsOpen] = React.useState(true);

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
              <FileNodeEntry key={child.name} node={child} onFileSelect={onFileSelect} activeFile={activeFile} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        'w-full justify-start rounded-md px-2 py-1.5 text-sm',
        activeFile === node.name && 'bg-accent font-semibold'
      )}
      onClick={() => onFileSelect(node)}
      style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
    >
      <File className="mr-2 h-4 w-4 flex-shrink-0" />
      <span>{node.name}</span>
    </Button>
  );
};

export function FileExplorer({ onFileSelect, activeFile }: FileExplorerProps) {
  return (
    <div className="flex h-full flex-col">
       <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      <div className="flex-1 p-2">
        <FileNodeEntry node={fileTreeData} onFileSelect={onFileSelect} activeFile={activeFile} level={0} />
      </div>
    </div>
  );
}
