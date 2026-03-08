import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import api from '../../services/api';

const ROTATING_MESSAGES = [
  'Ask anything',
  'Career tips?',
  'Need help?',
  'Job search help',
  'Study resources?',
];

export default function EduLumixChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async () => {
    const text = message.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await api.post('/chat', { message: text, history });
      const reply = res.data?.data?.message || 'Sorry, I could not respond.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Wave animation container - floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Rotating message tooltip */}
        {!open && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-dark-100 shadow-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {ROTATING_MESSAGES[rotatingIndex]}
            </span>
          </div>
        )}

        {/* Chat button with wave rings - catches user eye */}
        <div className="relative flex items-center justify-center">
          {/* Wave rings around button (only when closed) */}
          {!open && (
            <>
              <span
                className="chatbot-wave-ring absolute w-14 h-14 rounded-full border-2 border-blue-500/60"
                style={{ animationDelay: '0s' }}
              />
              <span
                className="chatbot-wave-ring absolute w-14 h-14 rounded-full border-2 border-blue-500/50"
                style={{ animationDelay: '0.5s' }}
              />
              <span
                className="chatbot-wave-ring absolute w-14 h-14 rounded-full border-2 border-blue-400/40"
                style={{ animationDelay: '1s' }}
              />
              <span
                className="chatbot-wave-ring absolute w-14 h-14 rounded-full border-2 border-blue-400/30"
                style={{ animationDelay: '1.5s' }}
              />
            </>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className={`relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transition-all hover:scale-105 active:scale-95 ring-4 ring-blue-400/30 shadow-lg shadow-blue-500/40 p-0 border-0 ${open ? 'bg-blue-600' : ''}`}
            aria-label="Open EduLumix Chatbot"
          >
            {open ? (
              <X className="w-6 h-6 text-white relative z-10" />
            ) : (
              <img
                src="/chatbot-logo.png"
                alt="EduLumix Chatbot"
                className="w-full h-full object-contain block"
              />
            )}
          </button>
        </div>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[70vh] bg-white dark:bg-dark-100 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/chatbot-logo.png" alt="" className="w-6 h-6 object-contain" />
              <span className="font-semibold">EduLumix Chatbot</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                <p>Hi! I'm EduLumix Assistant.</p>
                <p className="mt-1">Ask about jobs, resources, courses, or career tips!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-dark-200 text-gray-800 dark:text-gray-200 rounded-bl-md'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl rounded-bl-md bg-gray-100 dark:bg-dark-200">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-200 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
