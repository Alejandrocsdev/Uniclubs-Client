// Libraries
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
// Application
import App from './App.jsx';
// Custom Functions
import { store } from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
