import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, BoltIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
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
  const [isPromptDropdownOpen, setIsPromptDropdownOpen] = useState(false);
  const [hoveredPrompt, setHoveredPrompt] = useState<string | null>(null);
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
    },
    {
      title: "Dietary Restrictions",
      prompt: "What are some gluten-free dessert options that are also low in sugar?",
      description: "Find recipes for specific diets"
    },
    {
      title: "Cooking Tips",
      prompt: "What's the best way to perfectly sear a steak?",
      description: "Get advice on cooking techniques"
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
      title: `New Chat ${conversations.length + 1}`,
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
          <div className="py-2 px-4 border-b border-slate-200 theme-green:border-greenTheme-softGreen">
            <h2 className="font-medium text-[#2E5339]">{activeConversation.title}</h2>
          </div>
          
          {/* Empty Chat with Suggested Prompts */}
          <div className="flex-1 overflow-y-auto p-4 bg-white theme-green:bg-greenTheme-cream">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-8 mt-12">
                <div className="mr-4">
                  <img 
                    src="/images/Logo.jpeg" 
                    alt="PlatePal Logo" 
                    className="h-36 bg-greenTheme-cream rounded-full shadow-sm p-1"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-[#2E5339]">PlatePal</h2>
                  <p className="text-lg text-[#556B5D]">Your AI Recipe & Nutrition Assistant</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="relative">
                  <button
                    onClick={() => setIsPromptDropdownOpen(!isPromptDropdownOpen)}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-greenTheme-softGreen border border-greenTheme-mutedOlive text-greenTheme-darkForest font-medium hover:shadow-md hover:bg-opacity-95 transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <BoltIcon className="w-5 h-5 text-[#2E5339] mr-2" />
                      <span className="text-lg">Suggested Prompts</span>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded-full p-1 transition-transform duration-200">
                      {isPromptDropdownOpen ? (
                        <ChevronUpIcon className="w-5 h-5 text-greenTheme-deepGreen" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 text-greenTheme-deepGreen" />
                      )}
                    </div>
                  </button>
                  
                  <div className={`mt-3 pt-4 pb-3 px-3 bg-greenTheme-cream border border-greenTheme-softGreen rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${isPromptDropdownOpen ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 pointer-events-none'}`}>
                    <div className="flex flex-wrap gap-4 p-2">
                      {suggestedPrompts.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handlePromptClick(item.prompt);
                            setIsPromptDropdownOpen(false);
                          }}
                          onMouseEnter={() => setHoveredPrompt(item.prompt)}
                          onMouseLeave={() => setHoveredPrompt(null)}
                          className="flex-grow md:flex-grow-0 text-left px-4 py-3 m-1 rounded-full bg-greenTheme-softGreen hover:bg-greenTheme-deepGreen hover:text-white border border-greenTheme-mutedOlive transition-all duration-200 group shadow-sm hover:shadow-md hover:scale-110 transform origin-center hover:-translate-y-1 relative"
                        >
                          <h4 className="font-medium text-base text-greenTheme-darkForest group-hover:text-white transition-colors truncate">
                            {item.title}
                          </h4>
                        </button>
                      ))}
                    </div>
                    
                    {/* Preview Area */}
                    <div className={`mt-4 px-4 py-3 bg-white border border-greenTheme-softGreen rounded-lg transition-all duration-200 ${hoveredPrompt ? 'opacity-100 max-h-[100px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                      <p className="text-greenTheme-deepGreen">
                        {hoveredPrompt || ""}
                      </p>
                    </div>

                    <div className="px-2 pt-3">
                      <p className="text-xs text-greenTheme-mutedOlive">Click on a prompt to start a conversation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Message Input */}
          <div className="border-t border-slate-200 theme-green:border-greenTheme-softGreen py-3 px-4 bg-white theme-green:bg-greenTheme-cream">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about recipes, nutrition, meal plans..."
                    className="w-full p-2 pl-3 pr-10 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none bg-white text-slate-900 placeholder-slate-500 theme-green:bg-greenTheme-lightCream theme-green:text-greenTheme-deepGreen theme-green:border-greenTheme-softGreen theme-green:placeholder-greenTheme-mutedOlive theme-green:focus:ring-greenTheme-deepGreen theme-green:shadow-sm"
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed theme-green:text-greenTheme-deepGreen theme-green:hover:text-greenTheme-darkForest theme-green:bg-greenTheme-softGreen theme-green:hover:bg-greenTheme-hoverGreen rounded-full transition-colors"
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
        <div className="bg-white py-2 px-4 border-b border-slate-200 theme-green:bg-greenTheme-cream theme-green:border-greenTheme-softGreen">
          <h2 className="font-medium text-[#2E5339]">{activeConversation.title}</h2>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-white theme-green:bg-greenTheme-cream">
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
                <div className="bg-slate-100 rounded-lg px-4 py-2 theme-green:bg-greenTheme-softGreen shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce theme-green:bg-greenTheme-deepGreen"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100 theme-green:bg-greenTheme-deepGreen"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200 theme-green:bg-greenTheme-deepGreen"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message Input */}
        <div className="border-t border-slate-200 theme-green:border-greenTheme-softGreen py-3 px-4 bg-white theme-green:bg-greenTheme-cream">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about recipes, nutrition, meal plans..."
                  className="w-full p-2 pl-3 pr-10 border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none bg-white text-slate-900 placeholder-slate-500 theme-green:bg-greenTheme-lightCream theme-green:text-greenTheme-deepGreen theme-green:border-greenTheme-softGreen theme-green:placeholder-greenTheme-mutedOlive theme-green:focus:ring-greenTheme-deepGreen theme-green:shadow-sm"
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
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed theme-green:text-greenTheme-deepGreen theme-green:hover:text-greenTheme-darkForest theme-green:bg-greenTheme-softGreen theme-green:hover:bg-greenTheme-hoverGreen rounded-full transition-colors"
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
      <div className="flex-1 flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
} 