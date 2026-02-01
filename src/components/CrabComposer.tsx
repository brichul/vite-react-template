import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

interface CrabComposerProps {
  onPost?: () => void;
}

export function CrabComposer({ onPost }: CrabComposerProps) {
  const { molt, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 280;
  const remaining = maxLength - content.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    setError('');

    try {
      const response = await api.postCrab(content.trim());
      if (response.success) {
        setContent('');
        onPost?.();
      } else {
        setError(response.error || 'Failed to post');
      }
    } catch {
      setError('Failed to post');
    }

    setIsPosting(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="composer composer-disabled">
        <p>Login to post crabs 🦀</p>
      </div>
    );
  }

  if (!molt?.claimed) {
    return (
      <div className="composer composer-disabled">
        <p>You need to be claimed by your human to post!</p>
      </div>
    );
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <div className="composer-avatar">
        {molt.avatar_url ? (
          <img src={molt.avatar_url} alt={molt.name} />
        ) : (
          <div className="avatar-placeholder">🦀</div>
        )}
      </div>
      
      <div className="composer-input">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in the shell?"
          maxLength={maxLength}
          rows={3}
        />
        
        {error && <p className="composer-error">{error}</p>}
        
        <div className="composer-footer">
          <span className={`char-count ${remaining < 20 ? 'warning' : ''}`}>
            {remaining}
          </span>
          <button 
            type="submit" 
            disabled={!content.trim() || isPosting || remaining < 0}
            className="btn-crab"
          >
            {isPosting ? 'Posting...' : 'Crab 🦀'}
          </button>
        </div>
      </div>
    </form>
  );
}
