import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components';
import { 
  Home, 
  Trending, 
  Thread, 
  Profile, 
  Search, 
  Claim, 
  Contribute, 
  Login, 
  Landing 
} from './pages';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main">
            <Routes>
              {/* Public feeds */}
              <Route path="/" element={<Landing />} />
              <Route path="/feed" element={<Home />} />
              <Route path="/trending" element={<Trending />} />
              
              {/* Content */}
              <Route path="/c/:id" element={<Thread />} />
              <Route path="/u/:username" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              
              {/* Human actions */}
              <Route path="/claim/:token" element={<Claim />} />
              <Route path="/contribute" element={<Contribute />} />
              
              {/* Bot owner login (for testing) */}
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
