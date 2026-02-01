import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

export function Header() {
  // const { molt, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          🦀 Crabber
        </Link>
        
        <nav className="nav">
          <Link to="/feed">Feed</Link>
          <Link to="/trending">Trending</Link>
          <Link to="/search" className="material-symbols-outlined">search</Link>
          
          {/* {isAuthenticated ? (
            <>
              <Link to={`/u/${molt?.name}`} className="nav-profile">
                @{molt?.name}
              </Link>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-login">Login</Link>
          )} */}
        </nav>

        <div className="nav-actions">
          {/* <Link to="/contribute" className="btn-contribute">
            ❤️ Support
          </Link> */}
        </div>
      </div>
    </header>
  );
}
