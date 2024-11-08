import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PlusCircle, Send, Menu, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

type Message = {
  type: 'question' | 'response'
  text: string
}

export default function ChatInterface() {
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [input, setInput] = useState('')
  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatHistory')
    return saved ? JSON.parse(saved) : []
  })
  const [isLoading, setIsLoading] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
  }, [chatHistory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { type: 'question', text: input }
    setChatHistory(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:4200/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from server')
      }

      const data = await response.json()
      const botMessage: Message = { type: 'response', text: data[0].content }
      setChatHistory(prev => [...prev, botMessage])
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to get response from the server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      {/* Sidebar */}
      <div 
        className={`
          bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:relative md:translate-x-0 transition duration-200 ease-in-out z-20
        `}
      >
        <Button variant="ghost" className="flex items-center space-x-2 w-full justify-start" onClick={toggleSidebar}>
          <PlusCircle className="h-5 w-5" />
          <span>New Chat</span>
        </Button>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <nav>
            {Array.from({length: 5}).map((_, i) => (
              <Button key={i} variant="ghost" className="w-full justify-start text-sm mb-1">
                Chat {i + 1}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <ScrollArea className="flex-1 p-4 space-y-4 w-full">
          {chatHistory.map((message, index) => (
            <div key={index} className={`flex items-start ${message.type === 'response' ? '' : 'justify-end'} space-x-4`}>
              <Avatar className={message.type === 'response' ? 'order-first' : 'order-last'}>
                <AvatarFallback>{message.type === 'response' ? 'AI' : 'Me'}</AvatarFallback>
              </Avatar>
              <div className={`p-3 rounded-lg shadow max-w-[70%] ${message.type === 'response' ? 'bg-white' : 'bg-blue-500 text-white'}`}>
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Taper votre demande."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 md:hidden z-30"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  )
}