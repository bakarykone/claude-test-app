import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PlusCircle, Send, Menu } from 'lucide-react'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [input, setInput] = useState('')
  const [botResponse, setBotResponse] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    };

    fetch('http://localhost:5000/message', options)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setBotResponse(data.content)
      })
      .catch(error => console.error(error));

    console.log('Message submitted:', input);
    setInput(''); 
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <Button variant="ghost" className="flex items-center space-x-2 w-full justify-start" onClick={toggleSidebar}>
          <PlusCircle className="h-5 w-5" />
          <span>New Chat</span>
        </Button>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <nav>
            {/* Placeholder for chat history */}
            {Array.from({length: 10}).map((_, i) => (
              <Button key={i} variant="ghost" className="w-full justify-start text-sm mb-1">
                Chat {i + 1}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4 space-y-4">
          {/* Example messages */}
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm">Hello! How can I assist you today?</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 justify-end">
            <div className="bg-blue-500 text-white p-3 rounded-lg shadow">
              <p className="text-sm">Can you explain how AI works?</p>
            </div>
            <Avatar>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm">AI, or Artificial Intelligence, refers to computer systems designed to mimic human intelligence and perform tasks that typically require human cognitive abilities. These systems learn from data, identify patterns, and make decisions with minimal human intervention.</p>
            </div>
          </div>
        </ScrollArea>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  )
}