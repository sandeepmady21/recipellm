import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, BoltIcon } from '@heroicons/react/24/outline';
import ChatMessage from './ChatMessage';
import ChatHistory from './ChatHistory';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
  starred?: boolean;
}

interface SuggestedPrompt {
  title: string;
  prompt: string;
  description?: string;
}

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const initializedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define suggested prompts related to recipes and nutrition
  const suggestedPrompts: SuggestedPrompt[] = [
    {
      title: "Find a Recipe by Ingredients",
      prompt: "What can I make with chicken, spinach, and feta cheese?",
      description: "List ingredients you have on hand"
    },
    {
      title: "Get Nutritional Information",
      prompt: "What's the nutritional value of a slice of avocado toast?",
      description: "Ask about calories, protein, etc."
    },
    {
      title: "Meal Planning Help",
      prompt: "Create a 5-day meal plan for a family of four with a focus on Mediterranean cuisine.",
      description: "Specify dietary preferences"
    },
    {
      title: "Find Similar Recipes",
      prompt: "I love chicken parmesan. What are some similar dishes I could try?",
      description: "Discover related recipes"
    }
  ];

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversationId, conversations]);

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date().toLocaleString(),
      messages: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setInput('');
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setInput('');
  };

  const handleRenameChat = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          title: newTitle
        };
      }
      return conv;
    }));
  };

  const handleDeleteChat = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    // If the active chat is deleted, select another one or show the empty state
    if (activeConversationId === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      if (remainingConversations.length > 0) {
        setActiveConversationId(remainingConversations[0].id);
      } else {
        setActiveConversationId(null);
      }
    }
  };

  const handleStarChat = (id: string, starred: boolean) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === id) {
        return {
          ...conv,
          starred
        };
      }
      return conv;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeConversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          lastMessage: input.trim(),
          timestamp: new Date().toLocaleString(),
        };
      }
      return conv;
    }));

    setInput('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a simulated response from the AI. Replace this with actual API integration.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, aiMessage],
            lastMessage: aiMessage.content,
            timestamp: new Date().toLocaleString(),
          };
        }
        return conv;
      }));
      setIsLoading(false);
    }, 1000);
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  // Initialize with a new chat if there are no conversations yet
  useEffect(() => {
    if (!initializedRef.current && conversations.length === 0) {
      initializedRef.current = true;
      handleNewChat();
    }
  }, [conversations.length]);

  // Show empty state with suggestions or the active chat
  const renderContent = () => {
    if (!activeConversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-800 mb-2">Select a conversation</h3>
            <p className="text-slate-500">Choose from existing chats or start a new one</p>
          </div>
        </div>
      );
    }

    if (activeConversation.messages.length === 0) {
      return (
        <>
          {/* Chat Header */}
          <div className="bg-white py-2 px-4 border-b border-slate-200">
            <h2 className="text-slate-800 font-medium">{activeConversation.title}</h2>
          </div>
          
          {/* Empty Chat with Suggested Prompts */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8 mt-12">
                <h2 className="text-2xl font-bold mb-2 text-slate-800">PlatePal</h2>
                <p className="text-slate-500 text-lg">Your AI Recipe & Nutrition Assistant</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <BoltIcon className="w-5 h-5 text-slate-600 mr-2" />
                  <h3 className="text-md font-medium text-slate-700">Suggested Prompts</h3>
                </div>
                
                <div className="grid gap-3">
                  {suggestedPrompts.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(item.prompt)}
                      className={`text-left rounded-lg p-3 hover:bg-opacity-80 transition-colors ${
                        index === 0 
                          ? 'bg-white border border-slate-200' 
                          : 'bg-gray-900 text-gray-300'
                      }`}
                    >
                      <h4 className={`font-medium mb-1 ${index === 0 ? 'text-slate-800' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <p className={`text-sm ${index === 0 ? 'text-slate-500' : 'text-gray-400'}`}>
                        {item.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Message Input */}
          <div className="border-t border-slate-200 bg-white py-3 px-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about recipes, nutrition, meal plans..."
                    className="w-full p-2 pl-3 pr-10 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none bg-white text-slate-900 placeholder-slate-500"
                    disabled={isLoading || !activeConversationId}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim() || !activeConversationId}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      );
    }

    return (
      <>
        {/* Chat Header */}
        <div className="bg-white py-2 px-4 border-b border-slate-200">
          <h2 className="text-slate-800 font-medium">{activeConversation.title}</h2>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-white">
          <div className="max-w-3xl mx-auto">
            {activeConversation.messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message Input */}
        <div className="border-t border-slate-200 bg-white py-3 px-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Your message"
                  className="w-full p-2 pl-3 pr-10 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none bg-white text-slate-900 placeholder-slate-500"
                  disabled={isLoading || !activeConversationId}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || !activeConversationId}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-full bg-slate-50">
      <ChatHistory
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        onStarChat={handleStarChat}
      />
      <div className="flex-1 flex flex-col bg-white">
        {renderContent()}
      </div>
    </div>
  );
} 