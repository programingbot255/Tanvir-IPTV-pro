import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageSquareCode, ShieldAlert, Sparkles } from 'lucide-react';
import { ChatMessage, TvChannel } from '../types';
import { 
  SIMULATED_CHAT_MESSAGES_TEMPLATES, 
  CHAT_USERNAMES, 
  AVATAR_COLORS 
} from '../channelsData';

interface LiveChatProps {
  activeChannel: TvChannel;
}

export default function LiveChat({ activeChannel }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [activeUsers, setActiveUsers] = useState(140);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate initial messages
  useEffect(() => {
    const initial: ChatMessage[] = [];
    // Start with 6 existing comments
    for (let i = 0; i < 6; i++) {
      const template = SIMULATED_CHAT_MESSAGES_TEMPLATES[Math.floor(Math.random() * SIMULATED_CHAT_MESSAGES_TEMPLATES.length)];
      const user = CHAT_USERNAMES[Math.floor(Math.random() * CHAT_USERNAMES.length)];
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      initial.push({
        id: 'init-' + i + '-' + Math.random(),
        user,
        text: template,
        avatarColor: color,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      });
    }
    setMessages(initial);

    // Initial users count
    setActiveUsers(Math.floor(Math.random() * 210) + 120);
  }, [activeChannel.id]);

  // Handle auto-scroll to bottom of chats
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulation loop for live incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick dynamic sports comment template
      let template = SIMULATED_CHAT_MESSAGES_TEMPLATES[Math.floor(Math.random() * SIMULATED_CHAT_MESSAGES_TEMPLATES.length)];
      
      // Customize message slightly based on active channel name/category to make it feel extremely responsive
      if (activeChannel.category === 'ESPN' && Math.random() > 0.4) {
        const espnPhrases = ["This ESPN feed is lightning fast!", "ESPN always gets the best camera angles", "Who is the ESPN commentator right now??"];
        template = espnPhrases[Math.floor(Math.random() * espnPhrases.length)];
      } else if (activeChannel.name.toLowerCase().includes('madrid') && Math.random() > 0.4) {
        const madridPhrases = ["Hala Madrid y nada más! ⚪", "Madrid playing beautiful tactical football!", "Where can I buy tickets for the next game?"];
        template = madridPhrases[Math.floor(Math.random() * madridPhrases.length)];
      } else if (activeChannel.category === 'CUSTOM' && Math.random() > 0.5) {
        template = "This custom M3U HLS index is incredibly useful! App loaded it perfectly.";
      }

      const user = CHAT_USERNAMES[Math.floor(Math.random() * CHAT_USERNAMES.length)];
      const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

      const newMsg: ChatMessage = {
        id: 'msg-' + Date.now() + '-' + Math.random(),
        user,
        text: template,
        avatarColor: color,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };

      setMessages(prev => [...prev.slice(-30), newMsg]); // Keep last 30 messages in memory for fast performance

      // Slowly float user count
      setActiveUsers(prev => {
        const shift = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(10, prev + shift);
      });

    }, Math.floor(Math.random() * 5000) + 3000); // Trigger message every 3 to 8 seconds

    return () => clearInterval(interval);
  }, [activeChannel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now() + '-' + Math.random(),
      user: 'You (Spectator)',
      text: userInput.trim(),
      avatarColor: 'bg-red-600',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    // Trigger an immediate mock automated reply after 1.5 seconds!
    setTimeout(() => {
      const templates = [
        "Welcome to the watch party! 🙌",
        "Agree with you fully!",
        "Let's goooo! Streaming fits perfectly.",
        "Nice to meet you in spectator chat!"
      ];
      const botResponse: ChatMessage = {
        id: 'bot-' + Date.now(),
        user: CHAT_USERNAMES[Math.floor(Math.random() * CHAT_USERNAMES.length)],
        text: `@You ${templates[Math.floor(Math.random() * templates.length)]}`,
        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg" id="live-chat-panel">
      
      {/* Live Chat Header */}
      <div className="p-4 bg-zinc-900 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="w-5 h-5 text-red-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Party Chat</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1 rounded-full border border-neutral-800">
          <Users className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[11px] font-mono font-bold text-red-400">{activeUsers} online</span>
        </div>
      </div>

      <div className="px-3 py-2 bg-red-950/20 border-b border-red-900/10 flex items-center gap-2 text-[11px] text-amber-200">
        <Sparkles className="w-3.5 h-3.5 text-red-400 animate-pulse shrink-0" />
        <span>Connected to live broadcast stream chat room. Keep discussions friendly!</span>
      </div>

      {/* Messages Scrolling Region */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-zinc-950/20 max-h-[300px] lg:max-h-none"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-2.5 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar - Left side */}
            {!msg.isUser && (
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${msg.avatarColor} shadow-md`}>
                {msg.user[0].toUpperCase()}
              </div>
            )}

            <div className={`flex flex-col max-w-[80%] ${msg.isUser ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold ${msg.isUser ? 'text-red-400' : 'text-neutral-300'}`}>
                  {msg.user}
                </span>
                <span className="text-[9px] text-neutral-500 font-mono">{msg.timestamp}</span>
              </div>
              <div className={`mt-1 px-3 py-2 text-xs leading-relaxed rounded-2xl ${msg.isUser ? 'bg-red-600 text-white rounded-tr-none' : 'bg-zinc-800 text-neutral-200 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>

            {/* Avatar - Right side */}
            {msg.isUser && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-red-600 shadow-lg">
                U
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat sender form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-zinc-950/40 border-t border-neutral-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message to other spectators..."
            className="w-full bg-zinc-950 border border-neutral-800 rounded-xl py-2.5 pl-4 pr-11 text-xs text-neutral-200 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition font-sans"
          />
          <button
            type="submit"
            disabled={!userInput.trim()}
            className="absolute right-1.5 p-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:opacity-50 text-white rounded-lg transition active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
      
    </div>
  );
}
