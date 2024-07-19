import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './routes/root'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Selection from './routes/product-selection/selection'
import Config from './routes/config/config'
import { Toaster } from '@/components/ui/toaster'

const container = document.getElementById('root')

const root = createRoot(container!)

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <App /> },
      { path: '/selection', element: <Selection /> },
      { path: '/config', element: <Config /> }
    ]
  }
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
)
