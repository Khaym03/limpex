import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './root'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import ShoppingCart from './pages/shopping-cart/shopping-cart'
import Settings from './pages/settings/settings'
import { Toaster } from '@/components/ui/toaster'
import Checkout from './pages/checkout/checkout'

const container = document.getElementById('root')

const root = createRoot(container!)

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <App /> },
      { path: '/shopping-cart', element: <ShoppingCart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/settings', element: <Settings /> }
    ]
  }
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
)
