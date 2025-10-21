import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from './components/AppNavbar';
import ShoppingList from './components/ShoppingList';

import { Provider } from 'react-redux';
import store from './store';
import ItemModal from './components/ItemModal';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <div className="App">
          <AppNavbar />
          
          <ItemModal />

          <ShoppingList />

        </div>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;