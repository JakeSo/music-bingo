import { useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Error from './pages/Error'
import { HostPage } from './pages/HostPage'
import { JoinPage } from './pages/JoinPage'
import { SpotifyAuthProvider } from './components/SpotifyAuthenticationProvider'

function App() {


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <Error />
    },
    {
      path: 'host/:id',
      element: <SpotifyAuthProvider>
                  <HostPage />
                </SpotifyAuthProvider>,
    },
    {
      path: 'join',
      element: <JoinPage />
    }]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
