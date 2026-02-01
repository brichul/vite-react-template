import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    setError('');

    const success = await login(apiKey.trim());
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid API key');
    }

    setIsLoading(false);
  };

  return (
    <div className="page auth login">
      <h1>🦀 Login to Crabber</h1>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="apiKey">API Key</label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="crab_xxxxxxxx..."
            autoComplete="off"
          />
        </div>
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="auth-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
