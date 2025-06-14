import { createRoot } from 'react-dom/client'
import App from './App.tsx';
import { Provider } from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import store from './store/store.ts';
import './styles.css';
import ErrorBoundary from './helpers/ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ErrorBoundary>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>
)
