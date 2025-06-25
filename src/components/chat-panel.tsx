'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CornerDownLeft, Gem, User, LoaderCircle } from 'lucide-react';
import * as React from 'react';
import { modifyCodeBasedOnChat } from '@/ai/flows/modify-code-based-on-chat';
import { useToast } from '@/hooks/use-toast';


type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

type ChatPanelProps = {
  activeFile: string;
  fileContent: string;
  onContentChange: (newContent: string) => void;
};

export function ChatPanel({ activeFile, fileContent, onContentChange }: ChatPanelProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your AI assistant. How can I help you build your game today? You can ask me to generate assets, modify code, or fix bugs.",
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const result = await modifyCodeBasedOnChat({
        code: fileContent,
        instructions: currentInput,
      });

      if (result.modifiedCode) {
        onContentChange(result.modifiedCode);
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `I've updated the code in ${activeFile} based on your request.`,
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error('The AI did not return any code modifications.');
      }
    } catch (error) {
      console.error('AI code modification failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      const aiErrorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Sorry, I couldn't modify the code. Please try again. Error: ${errorMessage}`,
      };
      setMessages((prev) => [...prev, aiErrorResponse]);
      toast({
        title: 'Error Modifying Code',
        description: 'The AI assistant failed to modify the code. Please check the console for more details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage />
                <AvatarFallback
                  className={cn(
                    'text-white',
                    message.sender === 'ai' ? 'bg-primary' : 'bg-muted-foreground'
                  )}
                >
                  {message.sender === 'ai' ? (
                    <Gem className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-[80%] rounded-lg p-3 text-sm shadow-sm',
                  message.sender === 'ai'
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                )}
              >
                <p className="font-code leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 flex-row">
                 <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage />
                    <AvatarFallback className="text-white bg-primary">
                        <Gem className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <div className="max-w-[80%] rounded-lg p-3 text-sm shadow-sm bg-muted flex items-center gap-2">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    <p className="font-code leading-relaxed">Thinking...</p>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a change or ask a question..."
            className="pr-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            aria-label="Send message"
            disabled={isLoading}
          >
            <CornerDownLeft className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
