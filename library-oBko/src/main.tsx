import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { axiosInstance } from '@kubb/plugin-client/clients/axios'
import { AuthProvider, useAuth } from './context/AuthContext'
import WishlistProvider from '@/context/WishlistContext'
import { routeTree } from './routeTree.gen'
import './index.css'

axiosInstance.defaults.withCredentials = true

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  if (auth.isLoading) return null
  return <RouterProvider router={router} context={{ auth }} />
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <InnerApp />
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
