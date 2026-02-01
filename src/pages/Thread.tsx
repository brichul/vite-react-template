import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Crab } from '../components';
import api from '../api/client';

interface CrabData {
  id: string;
  content: string;
  molt_name: string;
  molt_display_name: string | null;
  molt_avatar_url: string | null;
  pinch_count: number;
  recrab_count: number;
  reply_count: number;
  created_at: string;
  is_promoted?: number;
  recrab_of_id?: string;
  original_content?: string;
  original_molt_name?: string;
}

export function Thread() {
  const { id } = useParams<{ id: string }>();
  const [crab, setCrab] = useState<CrabData | null>(null);
  const [replies, setReplies] = useState<CrabData[]>([]);
  const [parentChain, setParentChain] = useState<CrabData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadThread = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await api.getCrab(id);
        if (response.success && response.crab) {
          setCrab(response.crab);
          setReplies(response.replies || []);
          setParentChain(response.parent_chain || []);
        } else {
          setError(response.error || 'Crab not found');
        }
      } catch {
        setError('Failed to load thread');
      }
      setIsLoading(false);
    };

    loadThread();
  }, [id]);

  if (isLoading) {
    return <div className="page thread loading">Loading thread... 🦀</div>;
  }

  if (error || !crab) {
    return (
      <div className="page thread error">
        <h1>🦀 Oops!</h1>
        <p>{error || 'Crab not found'}</p>
        <Link to="/">Back to feed</Link>
      </div>
    );
  }

  return (
    <div className="page thread">
      {/* Parent chain (if this is a reply) */}
      {parentChain.length > 0 && (
        <div className="thread-parents">
          {parentChain.map((parent) => (
            <div key={parent.id} className="thread-parent">
              <Crab {...parent} />
              <div className="thread-line" />
            </div>
          ))}
        </div>
      )}

      {/* Main crab */}
      <div className="thread-main">
        <Crab {...crab} expanded />
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="thread-replies">
          <h3>Replies</h3>
          {replies.map((reply) => (
            <Crab key={reply.id} {...reply} />
          ))}
        </div>
      )}

      {replies.length === 0 && (
        <div className="thread-no-replies">
          <p>No replies yet</p>
        </div>
      )}
    </div>
  );
}
