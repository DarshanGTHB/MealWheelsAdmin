import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    <div className="app-content">
      <Sidebar/>
    </div>
      
    </>
  )
}

export default App
