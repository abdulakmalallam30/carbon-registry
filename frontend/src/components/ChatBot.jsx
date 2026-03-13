import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { chatWithAssistant } from '../services/api'

const starterByRole = {
  admin: [
    'How do I verify a project?',
    'How can I issue credits?',
    'How do I reject with reason?'
  ],
  ngo: [
    'How do I register a project with GPS?',
    'How is carbon prediction calculated?',
    'How do I upload area photo?'
  ],
  industry: [
    'How can I search project by ID?',
    'How do I buy and retire credits?',
    'Can I see exact project location?'
  ],
  guest: [
    'What is Blue Carbon Registry?',
    'What are user roles?',
    'How does verification work?'
  ]
}

const ChatBot = () => {
  const { userRole, isAdmin, isNGO, isIndustry } = useAuth()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi. I can help with project registration, location, carbon prediction, credit issuance, and retirement.',
      source: 'faq'
    }
  ])

  const role = useMemo(() => {
    if (isAdmin) return 'admin'
    if (isNGO) return 'ngo'
    if (isIndustry) return 'industry'
    return userRole || 'guest'
  }, [isAdmin, isNGO, isIndustry, userRole])

  const starterPrompts = starterByRole[role] || starterByRole.guest

  const sendMessage = async (rawMessage) => {
    const message = rawMessage?.trim()
    if (!message || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: message }])
    setText('')
    setLoading(true)

    const result = await chatWithAssistant(message, { role })

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: result?.reply || 'No response from assistant.',
        source: result?.source || 'faq'
      }
    ])

    setLoading(false)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[9998] px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl border border-cyan-300/40"
        title="Open assistant"
      >
        Bot Assistant
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="fixed bottom-24 right-6 z-[9998] w-[92vw] max-w-md h-[72vh] max-h-[620px] bg-[#0a1628]/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-500/20 to-blue-600/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">Registry Assistant</h3>
                  <p className="text-xs text-cyan-200">FAQ first, AI fallback</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-300 hover:text-white"
                  aria-label="Close assistant"
                >
                  x
                </button>
              </div>
            </div>

            <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-cyan-400/10">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 hover:bg-cyan-500/30"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="h-[calc(100%-164px)] overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.role}-${idx}`}
                  className={`max-w-[88%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'ml-auto bg-blue-600/50 text-white border border-blue-300/30'
                      : 'mr-auto bg-cyan-900/50 text-cyan-100 border border-cyan-400/20'
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <p className="text-[10px] mt-1 text-cyan-300/80 uppercase tracking-wide">
                      {msg.source}
                    </p>
                  )}
                </div>
              ))}
              {loading && (
                <div className="mr-auto bg-cyan-900/50 text-cyan-100 border border-cyan-400/20 rounded-xl px-3 py-2 text-sm">
                  Thinking...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(text)
              }}
              className="p-3 border-t border-cyan-400/20 flex gap-2"
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask about dashboard, projects, credits..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#112240] border border-cyan-400/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300"
              />
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatBot
