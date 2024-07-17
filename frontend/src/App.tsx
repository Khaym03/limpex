import { useState } from 'react'
import logo from './assets/images/logo-universal.png'
import { Greet } from '../wailsjs/go/main/App'
import { Button } from './components/ui/button'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import { Link } from 'react-router-dom'
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

function App() {
  const [resultText, setResultText] = useState(
    'Please enter your name below 👇'
  )
  const [name, setName] = useState('')
  const updateName = (e: any) => setName(e.target.value)
  const updateResultText = (result: string) => setResultText(result)

  function greet() {
    Greet(name).then(updateResultText)
  }

  return (
    <div id="App">
      asdasd
    </div>
  )
}

export default App
