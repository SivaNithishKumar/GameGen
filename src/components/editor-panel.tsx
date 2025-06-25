'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Code, Gamepad2 } from 'lucide-react';
import * as React from 'react';

type EditorPanelProps = {
  activeFile: string;
  fileContent: string;
  onContentChange: (content: string) => void;
};

export function EditorPanel({ activeFile, fileContent, onContentChange }: EditorPanelProps) {
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
        <TabsContent value="preview" className="flex-1 p-4 m-0 bg-muted/20">
          <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed bg-card">
            <div className="text-center text-muted-foreground">
              <Gamepad2 className="mx-auto h-12 w-12" />
              <p className="mt-2 text-lg font-semibold">Live Game Preview</p>
              <p className="text-sm">Changes in your code will be reflected here.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
