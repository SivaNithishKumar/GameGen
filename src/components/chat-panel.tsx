'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CornerDownLeft, Gem, User } from 'lucide-react';
import * as React from 'react';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
};

export function ChatPanel() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm your AI assistant. How can I help you build your game today? You can ask me to generate assets, modify code, or fix bugs.",
    },
  ]);
  const [input, setInput] = React.useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `I've received your request: "${input}". I am processing it now.`,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
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
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a change or ask a question..."
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            aria-label="Send message"
          >
            <CornerDownLeft className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
