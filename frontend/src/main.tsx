import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './routes/root'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Selection from './routes/selection'

const container = document.getElementById('root')

const root = createRoot(container!)

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [{ path: '/', element: <App /> },{path:'/selection', element: <Selection/>}]
  }
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
