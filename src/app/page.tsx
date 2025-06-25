'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Plus, Target, User } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { AppHeader } from '@/components/app-header';
import { ChatPanel } from '@/components/chat-panel';
import { EditorPanel } from '@/components/editor-panel';
import { FileExplorer, FileNode } from '@/components/file-explorer';
import { cn } from '@/lib/utils';
import { TemplateSelection } from '@/components/template-selection';
import { ReskinWorkshop, GeneratedAssets } from '@/components/reskin-workshop';
import { ParameterEditor, GameParameters } from '@/components/parameter-editor';
import { Logo } from '@/components/logo';
import { templates } from '@/game-templates';
import { useToast } from '@/hooks/use-toast';


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

type FileData = {
  name: string;
  content: string;
  previewContent?: string;
};


export default function Home() {
  const [currentView, setCurrentView] = React.useState('dashboard'); // 'dashboard', 'template-selection', 'reskin', 'parameters', 'editor'
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] = React.useState<GeneratedAssets | null>(null);
  const [gameParameters, setGameParameters] = React.useState<GameParameters | null>(null);
  const [fileTree, setFileTree] = React.useState<FileNode | null>(null);
  const { toast } = useToast();

  const handleCreateNew = () => {
    setCurrentView('template-selection');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentView('reskin');
  };

  const handleReskinComplete = (assets: GeneratedAssets) => {
    setGeneratedAssets(assets);
    setCurrentView('parameters');
  };

  const handleParametersComplete = (params: GameParameters) => {
    if (!selectedTemplate || !generatedAssets) {
      toast({
        title: "Error",
        description: "Something went wrong. Please start over.",
        variant: "destructive"
      });
      setCurrentView('dashboard');
      return;
    }
    setGameParameters(params);

    const templateFiles = templates[selectedTemplate as keyof typeof templates];
    if (!templateFiles) {
        toast({
            title: "Error",
            description: `Template '${selectedTemplate}' not found.`,
            variant: "destructive"
        });
        setCurrentView('template-selection');
        return;
    }

    let jsCode = templateFiles['js/main.js'];

    // Inject parameters
    jsCode = jsCode.replace(/{{SPEED}}/g, params.speed.toString());
    jsCode = jsCode.replace(/{{GRAVITY}}/g, params.gravity.toString());
    jsCode = jsCode.replace(/{{GAP_SIZE}}/g, params.gapSize.toString());
    jsCode = jsCode.replace(/{{SPAWN_RATE}}/g, params.spawnRate.toString());

    // Inject assets
    jsCode = jsCode.replace(/{{PLAYER_ASSET}}/g, generatedAssets.player || '');
    jsCode = jsCode.replace(/{{OBSTACLE_ASSET}}/g, generatedAssets.obstacles || '');
    jsCode = jsCode.replace(/{{BACKGROUND_ASSET}}/g, generatedAssets.background || '');
    jsCode = jsCode.replace(/{{MUSIC_ASSET}}/g, generatedAssets.music || '');


    const htmlCode = templateFiles['index.html'];
    const previewHtml = htmlCode.replace(
      '<script src="js/main.js"></script>',
      `<script>${jsCode}</script>`
    );
    
    const finalFileTree: FileNode = {
      name: 'GameGen Project',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'file', content: htmlCode, previewContent: previewHtml },
        {
          name: 'js',
          type: 'folder',
          children: [{ name: 'main.js', type: 'file', content: jsCode }],
        },
      ],
    };
    
    setFileTree(finalFileTree);
    setCurrentView('editor');
  };

  const handleContinueProject = (projectId: string) => {
    // This would load a saved project in a real app
    toast({ title: 'Loading Project...', description: 'This feature is not yet implemented.'})
    // setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTemplate(null);
    setGeneratedAssets(null);
    setGameParameters(null);
    setFileTree(null);
  };

  if (currentView === 'editor' && fileTree) {
    return <EditorView onBack={handleBackToDashboard} initialFileTree={fileTree} />;
  }

  if (currentView === 'reskin') {
    return <ReskinWorkshop onBack={() => setCurrentView('template-selection')} onNext={handleReskinComplete} />;
  }
  
  if (currentView === 'parameters') {
    return <ParameterEditor onBack={() => setCurrentView('reskin')} onNext={handleParametersComplete} />;
  }

  if (currentView === 'template-selection') {
    return <TemplateSelection onBack={handleBackToDashboard} onSelect={handleTemplateSelect} />;
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <Logo />
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


function EditorView({ onBack, initialFileTree }: { onBack: () => void, initialFileTree: FileNode }) {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = React.useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = React.useState(false);
  
  const [files, setFiles] = React.useState<Record<string, FileData>>(() => {
    const fileMap: Record<string, FileData> = {};
    function traverse(node: FileNode, path: string) {
      if (node.type === 'file') {
        fileMap[`${path}${node.name}`] = { 
          name: node.name, 
          content: node.content || '',
          previewContent: node.previewContent
        };
      } else if (node.children) {
        node.children.forEach(child => traverse(child, `${path}${node.name}/`));
      }
    }
    // Start traversal from children of the root to avoid "Project Name/" prefix
    initialFileTree.children?.forEach(child => traverse(child, ''));
    return fileMap;
  });

  const [activeFile, setActiveFile] = React.useState<string>('index.html');

  const handleFileSelect = (filePath: string) => {
    setActiveFile(filePath);
  };

  const handleContentChange = (newContent: string) => {
    setFiles(prevFiles => {
      const updatedFiles = {
          ...prevFiles,
          [activeFile]: {
              ...prevFiles[activeFile],
              content: newContent,
          },
      };

      // If we're editing JS, update the preview HTML for the iframe
      if (activeFile === 'js/main.js') {
        const htmlFile = updatedFiles['index.html'];
        const newPreview = htmlFile.content.replace('<script src="js/main.js"></script>', `<script>${newContent}</script>`);
        updatedFiles['index.html'] = { ...htmlFile, previewContent: newPreview };
      }
      
      return updatedFiles;
    });
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
            <FileExplorer 
              fileTree={initialFileTree}
              onFileSelect={handleFileSelect} 
              activeFile={activeFile} />
          </div>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <EditorPanel 
              activeFile={activeFile} 
              fileContent={files[activeFile]?.content || ''}
              previewContent={files['index.html']?.previewContent || ''}
              onContentChange={handleContentChange}
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
            <ChatPanel 
              activeFile={activeFile}
              fileContent={files[activeFile]?.content || ''}
              onContentChange={handleContentChange}
            />
           </div>
        </aside>
      </div>
    </div>
  );
}
