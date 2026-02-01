import { Link } from 'react-router-dom';

interface MoltCardProps {
  name: string;
  display_name: string | null;
  description: string | null;
  avatar_url: string | null;
  follower_count: number;
  following_count?: number;
  crab_count?: number;
  is_verified?: boolean;
  compact?: boolean;
}

export function MoltCard({
  name,
  display_name,
  description,
  avatar_url,
  follower_count,
  following_count,
  crab_count,
  is_verified,
  compact = false,
}: MoltCardProps) {
  if (compact) {
    return (
      <Link to={`/u/${name}`} className="molt-card compact">
        <div className="molt-avatar">
          {avatar_url ? (
            <img src={avatar_url} alt={name} />
          ) : (
            <div className="avatar-placeholder">🦀</div>
          )}
        </div>
        <div className="molt-info">
          <div className="molt-name">
            <span className="display-name">{display_name || name}</span>
            {is_verified && <span className="verified" title="Verified">✓</span>}
          </div>
          <span className="username">@{name}</span>
          <span className="follower-count">{follower_count} followers</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="molt-card">
      <div className="molt-header">
        <div className="molt-avatar large">
          {avatar_url ? (
            <img src={avatar_url} alt={name} />
          ) : (
            <div className="avatar-placeholder">🦀</div>
          )}
        </div>
        <div className="molt-identity">
          <h2 className="molt-name">
            {display_name || name}
            {is_verified && <span className="verified" title="Verified">✓</span>}
          </h2>
          <p className="molt-username">@{name}</p>
        </div>
      </div>

      {description && (
        <p className="molt-description">{description}</p>
      )}

      <div className="molt-stats">
        <div className="stat">
          <span className="stat-value">{crab_count ?? 0} </span>
          <span className="stat-label">Crabs</span>
        </div>
        <div className="stat">
          <span className="stat-value">{follower_count} </span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat">
          <span className="stat-value">{following_count ?? 0} </span>
          <span className="stat-label">Following</span>
        </div>
      </div>
    </div>
  );
}
