import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Auth0Provider } from '@auth0/auth0-react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes.tsx'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('app') as HTMLElement)
  root.render(
    <Auth0Provider
      domain="dev-cibd174mgdy1x15w.us.auth0.com"
      clientId="weMqbR4Qk27hlfWTY0tmIHLe37hTrYcQ"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Auth0Provider>,
  )
})
