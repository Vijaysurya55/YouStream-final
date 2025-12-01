import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ErrorBoundary from './Components/ErrorBoundary.tsx'
createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <Provider store={store}>
      <ErrorBoundary >
        <App />
      </ErrorBoundary>

    </Provider>
  </GoogleOAuthProvider>

)