'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Plus, Target, User } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { ChatPanel } from '@/components/chat-panel';
import { EditorPanel } from '@/components/editor-panel';
import { FileExplorer } from '@/components/file-explorer';
import { cn } from '@/lib/utils';
import { TemplateSelection } from '@/components/template-selection';


const mockProjects = [
  {
    id: '1',
    name: 'Cyber Bird',
    thumbnail: 'https://placehold.co/600x400.png',
    lastModified: '2 hours ago',
    thumbnailHint: 'cyberpunk bird',
  },
  {
    id: '2',
    name: 'Space Runner',
    thumbnail: 'https://placehold.co/600x400.png',
    lastModified: '1 day ago',
    thumbnailHint: 'astronaut running',
  },
  {
    id: '3',
    name: 'Neon Mole',
    thumbnail: 'https://placehold.co/600x400.png',
    lastModified: '3 days ago',
    thumbnailHint: 'glowing mole',
  },
];

export default function Home() {
  
  const [currentView, setCurrentView] = React.useState('dashboard'); // 'dashboard', 'template-selection', 'editor'

  const handleCreateNew = () => {
    setCurrentView('template-selection');
  };

  const handleTemplateSelect = (templateId: string) => {
    console.log(`Selected template: ${templateId}`);
    // This will eventually lead to the AI reskin screen
    setCurrentView('editor');
  };

  const handleContinueProject = (projectId: string) => {
    // This will load the project and go to the chat/editor view
    setCurrentView('editor');
  };

  if (currentView === 'editor') {
    return <EditorView onBack={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'template-selection') {
    return <TemplateSelection onBack={() => setCurrentView('dashboard')} onSelect={handleTemplateSelect} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label="controller">
            🎮
          </span>
          <h1 className="font-headline text-2xl font-bold">GameGen</h1>
        </div>
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
          <span className="sr-only">Profile</span>
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight">Welcome back, Creator!</h2>
            <p className="mt-4 text-lg text-muted-foreground">Ready to build the next hit game?</p>
          </div>

          <div className="my-12 flex justify-center">
            <Button className="h-24 w-80 text-2xl" variant="outline" onClick={handleCreateNew}>
              <Target className="mr-4 h-10 w-10" />
              Create New Project
            </Button>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-semibold">Your Projects</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {mockProjects.map((project) => (
                <Card key={project.id} className="flex flex-col overflow-hidden">
                  <div className="aspect-[3/2] w-full">
                    <Image
                      src={project.thumbnail}
                      alt={project.name}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                      data-ai-hint={project.thumbnailHint}
                    />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Modified: {project.lastModified}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" onClick={() => handleContinueProject(project.id)}>Continue</Button>
                  </CardFooter>
                </Card>
              ))}
              <Card className="flex flex-col items-center justify-center border-2 border-dashed bg-card/50 hover:border-primary hover:bg-accent">
                <Button variant="ghost" className="flex h-full w-full flex-col items-center justify-center gap-2" onClick={handleCreateNew}>
                  <Plus className="h-12 w-12 text-muted-foreground" />
                  <span className="text-lg font-semibold text-muted-foreground">New Project</span>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


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


function EditorView({ onBack }: { onBack: () => void }) {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);
  const [activeFile, setActiveFile] = React.useState('index.html');
  const [fileContent, setFileContent] = React.useState(sampleCode);

  const handleFileSelect = (file: { name: string, content?: string }) => {
    setActiveFile(file.name);
    if(file.content) {
      setFileContent(file.content);
    } else {
        setFileContent(`// Content for ${file.name}`);
    }
  };


  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <AppHeader
        onBack={onBack}
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
