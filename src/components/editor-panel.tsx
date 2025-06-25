'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Code, Gamepad2 } from 'lucide-react';
import * as React from 'react';

type EditorPanelProps = {
  activeFile: string;
  fileContent: string;
  previewContent: string;
  onContentChange: (content: string) => void;
};

export function EditorPanel({ activeFile, fileContent, previewContent, onContentChange }: EditorPanelProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (iframeRef.current) {
        iframeRef.current.srcdoc = previewContent;
    }
  }, [previewContent]);

  return (
    <div className="h-full">
      <Tabs defaultValue="editor" className="flex h-full flex-col">
        <div className="flex items-center border-b px-4 py-2">
            <p className="text-sm font-medium text-muted-foreground">{activeFile}</p>
            <div className="ml-auto">
                <TabsList>
                    <TabsTrigger value="editor">
                        <Code className="mr-2 h-4 w-4" />
                        Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                        <Gamepad2 className="mr-2 h-4 w-4" />
                        Preview
                    </TabsTrigger>
                </TabsList>
            </div>
        </div>
        <TabsContent value="editor" className="flex-1 overflow-hidden p-0 m-0">
          <Textarea
            value={fileContent}
            onChange={(e) => onContentChange(e.target.value)}
            className="font-code h-full w-full resize-none rounded-none border-0 bg-card text-base focus-visible:ring-0"
            placeholder="Select a file to start coding..."
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 p-0 m-0 bg-muted/20">
          <iframe
            ref={iframeRef}
            srcDoc={previewContent}
            title="Live Game Preview"
            sandbox="allow-scripts"
            className="h-full w-full border-0"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
