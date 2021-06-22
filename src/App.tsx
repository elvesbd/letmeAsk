import AuthContextProvider from './context/AuthContext';

import Routes from './routes';


function App() {
  return (
    <AuthContextProvider>
      <Routes />
    </AuthContextProvider>
  );
}

export default App;
