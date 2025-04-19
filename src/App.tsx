import { useState } from 'react'
import Chat from './components/Chat'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'

function App() {
  const [theme, setTheme] = useState<'default' | 'green'>('green')

  const toggleTheme = () => {
    setTheme(prev => prev === 'default' ? 'green' : 'default')
  }

  return (
    <div className={`flex flex-col h-screen ${theme === 'green' ? 'theme-green bg-greenTheme-cream' : 'bg-white'}`}>
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors shadow-sm ${
            theme === 'green' 
              ? 'bg-greenTheme-softGreen hover:bg-greenTheme-hoverGreen text-greenTheme-deepGreen border border-greenTheme-deepGreen border-opacity-20' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title={`Switch to ${theme === 'default' ? 'green' : 'default'} theme`}
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
      </div>
      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>
    </div>
  )
}

export default App
