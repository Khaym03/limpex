import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './root'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import ShoppingCart from './pages/shopping-cart/shopping-cart'
import ShoppingCartRoot from './pages/shopping-cart/root'
import Settings from './pages/settings/settings'
import { Toaster } from '@/components/ui/toaster'
import Checkout from './pages/checkout/checkout'
import TodayInfo from './pages/orders-manage/orders-manager'
import Metrics from './pages/metricts/metrics'
import Products from './pages/products/products'
import Costumers from './pages/customer/customer'

const container = document.getElementById('root')

const root = createRoot(container!)

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { path: '/', element: <App /> },
      { path: '/shopping-cart', element: <ShoppingCartRoot />, children:[
        { path: '/shopping-cart/product-selection', element: <ShoppingCart /> },
        { path: '/shopping-cart/checkout', element: <Checkout /> }
      ] },
      { path: '/metrics', element: <Metrics /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/today-info', element: <TodayInfo /> },
      { path: '/products', element: <Products /> },
      { path: '/costumers', element: <Costumers /> },
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
