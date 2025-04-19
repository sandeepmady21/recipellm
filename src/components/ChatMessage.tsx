import { PaperAirplaneIcon, UserIcon } from '@heroicons/react/24/solid';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

export default function ChatMessage({ content, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div>
          <div className={`rounded-lg px-3 py-2 ${
            isUser ? 'user-message' : 'ai-message'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}