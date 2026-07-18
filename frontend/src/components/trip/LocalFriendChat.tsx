import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface LocalFriendChatProps {
  tripId: string;
  activeDay: number;
}

export default function LocalFriendChat({ tripId, activeDay }: LocalFriendChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', parts: [{ text }] };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/trips/${tripId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: text,
          history: messages,
          activeDay
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch response');
      }

      const data = await res.json();
      const aiMsg: Message = { role: 'model', parts: [{ text: data.response }] };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'model', parts: [{ text: 'Oops! I got a little lost. Can you try asking that again?' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionChips = [
    "What's the weather like today?",
    "Suggest a good local snack nearby.",
    "Is it safe to walk around here at night?",
    "How much should a rickshaw cost to my next stop?"
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-brand-teal text-white rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl z-50 transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        👋
      </button>

      {/* Chat Window Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      >
        {/* Chat Drawer */}
        <div 
          className={`bg-tripzy-bg w-full max-w-sm h-[90vh] md:h-screen md:max-w-md border-l-[3px] border-t-[3px] md:border-t-0 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 translate-y-0 mt-[10vh] md:mt-0 rounded-t-3xl md:rounded-none' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
        >
          {/* Header */}
          <div className="bg-brand-teal p-5 border-b-[3px] border-black flex justify-between items-center rounded-t-3xl md:rounded-none">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl border-2 border-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">🤖</div>
              <div>
                <h3 className="font-display-lg font-black text-white text-xl">Local Friend</h3>
                <p className="text-white/80 font-bold text-xs">Answering questions about Day {activeDay}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 bg-white rounded-xl border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="text-6xl animate-bounce">👋</div>
                <h4 className="font-headline-md font-black text-xl">Hey! I'm your local friend.</h4>
                <p className="text-on-surface-variant font-medium text-sm max-w-[250px]">
                  I know everything about your itinerary for Day {activeDay}. Need help finding a rickshaw, picking an outfit, or finding street food? Just ask!
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="bg-white border-2 border-black rounded-lg px-3 py-2 text-xs font-bold text-on-surface hover:bg-brand-teal/10 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Chat History */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-tripzy-orange text-white rounded-tr-sm' : 'bg-white text-on-surface rounded-tl-sm'}`}
                >
                  {msg.role === 'model' ? (
                    <div className="prose prose-sm prose-p:leading-relaxed prose-a:text-brand-teal font-medium">
                      <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-bold text-sm">{msg.parts[0].text}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-sm border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex gap-2">
                  <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t-[3px] border-black">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
              className="flex gap-2 relative"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your local friend..."
                disabled={isLoading}
                className="flex-1 bg-surface-container border-[3px] border-black rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-brand-teal/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-brand-teal text-white w-12 h-12 rounded-xl border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center disabled:opacity-50 active:translate-y-1 active:translate-x-1 active:shadow-none"
              >
                <span className="material-symbols-outlined font-black">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
