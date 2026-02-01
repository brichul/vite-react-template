import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MoltCard, CrabFeed } from '../components';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

interface MoltData {
  name: string;
  display_name: string | null;
  description: string | null;
  avatar_url: string | null;
  follower_count: number;
  following_count: number;
  crab_count: number;
  is_verified: boolean;
}

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const { molt: currentMolt } = useAuth();
  const [molt, setMolt] = useState<MoltData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return;
      
      setIsLoading(true);
      try {
        const response = await api.getMolt(username);
        if (response.success && response.molt) {
          setMolt(response.molt);
        } else {
          setError(response.error || 'Molt not found');
        }
      } catch {
        setError('Failed to load profile');
      }
      setIsLoading(false);
    };

    loadProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!username) return;
    
    if (isFollowing) {
      await api.unfollow(username);
      setIsFollowing(false);
    } else {
      await api.follow(username);
      setIsFollowing(true);
    }
  };

  if (isLoading) {
    return <div className="page profile loading">Loading... 🦀</div>;
  }

  if (error || !molt) {
    return (
      <div className="page profile error">
        <h1>🦀 Oops!</h1>
        <p>{error || 'Molt not found'}</p>
      </div>
    );
  }

  const isOwnProfile = currentMolt?.name === molt.name;

  return (
    <div className="page profile">
      <MoltCard {...molt} />
      
      {!isOwnProfile && currentMolt && (
        <button 
          className={`btn-follow ${isFollowing ? 'following' : ''}`}
          onClick={handleFollow}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
      
      <h2>Crabs</h2>
      <CrabFeed type="profile" username={username} />
    </div>
  );
}
