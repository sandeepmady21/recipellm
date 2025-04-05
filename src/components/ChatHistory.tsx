import { 
  PencilIcon, 
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  CheckIcon,
  XMarkIcon,
  StarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface ChatHistoryProps {
  conversations: Array<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
    starred?: boolean;
  }>;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameChat?: (id: string, newTitle: string) => void;
  onDeleteChat?: (id: string) => void;
  onStarChat?: (id: string, starred: boolean) => void;
}

export default function ChatHistory({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  onStarChat
}: ChatHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  
  // Filter and sort conversations - starred at top, then the rest
  const filteredConversations = conversations
    .filter(conv => 
      !searchQuery || 
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // First sort by starred status (starred first)
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      // Then sort by timestamp (newest first) within each group
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  
  const handleStartRename = (id: string, currentTitle: string) => {
    setMenuOpenId(null);
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (id: string) => {
    if (onRenameChat && editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = () => {
    setEditingId(null);
  };

  const handleDeleteChat = (id: string) => {
    setMenuOpenId(null);
    if (onDeleteChat) {
      onDeleteChat(id);
    }
  };

  const handleStarChat = (id: string) => {
    setMenuOpenId(null);
    if (onStarChat) {
      const conversation = conversations.find(conv => conv.id === id);
      if (conversation) {
        onStarChat(id, !conversation.starred);
      }
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === id ? null : id);
  };
  
  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Helper function to highlight matching text
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) {
      return text;
    }
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="w-64 bg-slate-50 flex flex-col h-full border-r border-slate-200">
      {/* Search */}
      <div className="p-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 border border-slate-200 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 placeholder-slate-500"
            />
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          </div>
          <button 
            onClick={onNewChat}
            className="flex items-center justify-center p-1.5 rounded-full bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 flex-shrink-0"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {          
          return (
            <div key={conversation.id} className="relative">
              <button
                onClick={() => editingId !== conversation.id && onSelectConversation(conversation.id)}
                className={`w-full py-0.5 px-4 text-left transition-colors ${
                  activeConversationId === conversation.id 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                }`}
                style={{ backgroundColor: activeConversationId === conversation.id ? '#e5e7eb' : '#f9fafb' }}
              >
                <div className="flex justify-between items-center">
                  {editingId === conversation.id ? (
                    <div className="flex items-center w-full pr-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full text-sm bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-500"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveRename(conversation.id);
                          } else if (e.key === 'Escape') {
                            handleCancelRename();
                          }
                        }}
                      />
                      <div className="flex ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveRename(conversation.id);
                          }}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelRename();
                          }}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-medium truncate pr-2 flex items-center">
                        {conversation.starred && (
                          <StarIcon className="w-4 h-4 text-yellow-500 mr-1 flex-shrink-0" />
                        )}
                        {searchQuery ? highlightText(conversation.title, searchQuery) : conversation.title}
                      </h3>
                      <button 
                        onClick={(e) => toggleMenu(conversation.id, e)}
                        className="text-gray-500 hover:text-gray-700"
                        style={{ background: 'none', backgroundColor: 'transparent' }}
                      >
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </button>

              {/* Context Menu */}
              {menuOpenId === conversation.id && (
                <div 
                  className="absolute right-4 mt-0 bg-white shadow-lg rounded-md py-1 z-10 w-40"
                  onClick={(e) => e.stopPropagation()}
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <button 
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    onClick={() => handleStarChat(conversation.id)}
                    style={{ backgroundColor: '#ffffff', color: '#374151' }}
                  >
                    <StarIcon className={`w-4 h-4 mr-2 ${conversation.starred ? 'text-yellow-500' : ''}`} />
                    {conversation.starred ? 'Unstar' : 'Star'}
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                    onClick={() => handleStartRename(conversation.id, conversation.title)}
                    style={{ backgroundColor: '#ffffff', color: '#374151' }}
                  >
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Rename
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center"
                    onClick={() => handleDeleteChat(conversation.id)}
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 