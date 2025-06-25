'use client';

import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { ChatPanel } from '@/components/chat-panel';
import { EditorPanel } from '@/components/editor-panel';
import { FileExplorer } from '@/components/file-explorer';
import { cn } from '@/lib/utils';
import { PanelLeft, PanelRight } from 'lucide-react';

const sampleCode = `<!DOCTYPE html>
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
</html>`;

export default function Home() {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);
  const [activeFile, setActiveFile] = React.useState('index.html');
  const [fileContent, setFileContent] = React.useState(sampleCode);

  const handleFileSelect = (file: { name: string, content?: string }) => {
    setActiveFile(file.name);
    if(file.content) {
      setFileContent(file.content);
    } else {
        // In a real app, you would fetch the file content.
        // For this mock, we'll just show a placeholder.
        setFileContent(`// Content for ${file.name}`);
    }
  };


  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <AppHeader
        leftPanelCollapsed={leftPanelCollapsed}
        toggleLeftPanel={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
        rightPanelCollapsed={rightPanelCollapsed}
        toggleRightPanel={() => setRightPanelCollapsed(!rightPanelCollapsed)}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            'flex-shrink-0 bg-card/50 transition-all duration-300 ease-in-out',
            leftPanelCollapsed ? 'w-0' : 'w-72 border-r'
          )}
        >
          <div className="h-full overflow-auto">
            <FileExplorer onFileSelect={handleFileSelect} activeFile={activeFile} />
          </div>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <EditorPanel 
              activeFile={activeFile} 
              fileContent={fileContent} 
              onContentChange={setFileContent}
            />
          </main>
        </div>

        <aside
          className={cn(
            'flex-shrink-0 bg-card/50 transition-all duration-300 ease-in-out',
            rightPanelCollapsed ? 'w-0' : 'w-[400px] border-l'
          )}
        >
           <div className="h-full overflow-hidden">
            <ChatPanel />
           </div>
        </aside>
      </div>
    </div>
  );
}
