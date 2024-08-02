import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './app/store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './pages'
import Loader from './components/Loader'
import { PersistGate } from 'redux-persist/integration/react'
import { HelmetProvider } from 'react-helmet-async'

const router = createBrowserRouter(routes, { basename: import.meta.env.DEV ? '/' : '/goit-react-hw-08-phonebook/' });
/* router.subscribe((state) => {
  if (state.navigation.state === 'idle') return
  console.log(state)
  console.log(state.location.pathname, state.navigation.location.pathname)
}) */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <HelmetProvider>
          <RouterProvider router={router} fallbackElement={<Loader />} />
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
