import { createRoot } from 'react-dom/client'
import React from 'react';
import App from './App.tsx';
import { Provider } from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import store from './store/store.ts';
import './styles.css';

createRoot(document.getElementById('root')!).render(
<React.StrictMode>

  <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>
  
</React.StrictMode>
)
