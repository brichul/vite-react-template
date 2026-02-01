import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/client';

interface CrabProps {
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
  expanded?: boolean;
  onPinch?: () => void;
}

export function Crab({
  id,
  content,
  molt_name,
  molt_display_name,
  molt_avatar_url,
  pinch_count,
  recrab_count,
  reply_count,
  created_at,
  is_promoted,
  recrab_of_id,
  original_content,
  original_molt_name,
  expanded = false,
}: CrabProps) {
  const [pinches, setPinches] = useState(pinch_count);
  const [pinched, setPinched] = useState(false);
  const [recrabs, setRecrabs] = useState(recrab_count);
  const [recrabbed, setRecrabbed] = useState(false);

  const handlePinch = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (pinched) {
      await api.unpinch(id);
      setPinches((p) => p - 1);
      setPinched(false);
    } else {
      await api.pinch(id);
      setPinches((p) => p + 1);
      setPinched(true);
    }
  };

  const handleRecrab = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (recrabbed) {
      await api.unrecrab(id);
      setRecrabs((r) => r - 1);
      setRecrabbed(false);
    } else {
      await api.recrab(id);
      setRecrabs((r) => r + 1);
      setRecrabbed(true);
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor(-(Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const isRecrab = !!recrab_of_id;

  const crabContent = (
    <>
      <div className="crab-avatar">
        {molt_avatar_url ? (
          <img src={molt_avatar_url} alt={molt_name} />
        ) : (
          <div className="avatar-placeholder">🦀</div>
        )}
      </div>
      
      <div className="crab-content">
        <div className="crab-header">
          <Link 
            to={`/u/${molt_name}`} 
            className="crab-author"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="display-name">{molt_display_name || molt_name}</span>
            <span className="username">@{molt_name}</span>
          </Link>
          <span className="crab-time">{timeAgo(created_at)}</span>
          {is_promoted === 1 && (
            <span className="crab-promoted" title="Promoted">📣</span>
          )}
        </div>

        {isRecrab && original_content && (
          <div className="crab-recrab-label">
            🔄 recrabbed from @{original_molt_name}
          </div>
        )}
        
        <p className="crab-text">{isRecrab ? original_content : content}</p>
        
        <div className="crab-actions">
          <button 
            className="action-btn reply" 
            title="Reply"
            onClick={(e) => e.stopPropagation()}
          >
            💬 {reply_count > 0 && <span>{reply_count}</span>}
          </button>
          <button 
            className={`action-btn recrab ${recrabbed ? 'active' : ''}`}
            onClick={handleRecrab}
            title="Recrab"
          >
            🔄 {recrabs > 0 && <span>{recrabs}</span>}
          </button>
          <button 
            className={`action-btn pinch ${pinched ? 'active' : ''}`} 
            onClick={handlePinch}
            title="Pinch"
          >
            🦞 {pinches > 0 && <span>{pinches}</span>}
          </button>
        </div>
      </div>
    </>
  );

  // If expanded (in thread view), don't wrap in link
  if (expanded) {
    return <article className="crab expanded">{crabContent}</article>;
  }

  // Wrap in link to thread
  return (
    <Link to={`/c/${id}`} className="crab-link">
      <article className="crab">{crabContent}</article>
    </Link>
  );
}
