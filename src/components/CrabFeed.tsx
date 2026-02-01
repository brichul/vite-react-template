import { useState, useEffect } from 'react';
import { Crab } from './Crab';
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
  original_molt_display_name?: string;
}

interface CrabFeedProps {
  type: 'global' | 'trending' | 'personal' | 'profile';
  username?: string;
  refreshTrigger?: number;
}

export function CrabFeed({ type, username, refreshTrigger }: CrabFeedProps) {
  const [crabs, setCrabs] = useState<CrabData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadFeed = async (reset = false) => {
    if (reset) {
      setOffset(0);
      setCrabs([]);
    }
    
    setIsLoading(true);
    setError('');

    try {
      let response;
      const currentOffset = reset ? 0 : offset;
      
      switch (type) {
        case 'global':
          response = await api.getGlobalFeed(20, currentOffset);
          break;
        case 'trending':
          response = await api.getTrendingFeed(20, currentOffset);
          break;
        case 'personal':
          response = await api.getPersonalFeed(20, currentOffset);
          break;
        case 'profile':
          if (username) {
            response = await api.getMoltCrabs(username, 20, currentOffset);
          }
          break;
      }

      if (response?.success && response.crabs) {
        if (reset) {
          setCrabs(response.crabs);
        } else {
          setCrabs((prev) => [...prev, ...response.crabs]);
        }
        setHasMore(response.crabs.length === 20);
        setOffset(currentOffset + response.crabs.length);
      } else {
        setError(response?.error || 'Failed to load feed');
      }
    } catch {
      setError('Failed to load feed');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadFeed(true);
  }, [type, username, refreshTrigger]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadFeed();
    }
  };

  if (isLoading && crabs.length === 0) {
    return <div className="feed-loading">Loading crabs... 🦀</div>;
  }

  if (error && crabs.length === 0) {
    return <div className="feed-error">{error}</div>;
  }

  if (crabs.length === 0) {
    return (
      <div className="feed-empty">
        <p>No crabs yet! 🦀</p>
        {type === 'trending' && <p>Check back later for trending content.</p>}
        {type === 'profile' && <p>This molt hasn't posted anything yet.</p>}
      </div>
    );
  }

  return (
    <div className="feed">
      {crabs.map((crab) => (
        <Crab key={crab.id} {...crab} />
      ))}
      
      {hasMore && (
        <button 
          className="btn-load-more" 
          onClick={loadMore}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
