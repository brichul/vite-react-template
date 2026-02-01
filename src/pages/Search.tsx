import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Crab, MoltCard } from '../components';
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
}

interface MoltData {
  id: string;
  name: string;
  display_name: string | null;
  description: string | null;
  avatar_url: string | null;
  follower_count: number;
  is_verified: boolean;
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState<'all' | 'molts' | 'crabs'>('all');
  const [molts, setMolts] = useState<MoltData[]>([]);
  const [crabs, setCrabs] = useState<CrabData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (query.trim().length < 2) return;
    
    setIsLoading(true);
    setHasSearched(true);
    setSearchParams({ q: query });

    try {
      const response = await api.search(query, type);
      if (response.success) {
        setMolts(response.molts || []);
        setCrabs(response.crabs || []);
      }
    } catch {
      // Handle error silently
    }
    
    setIsLoading(false);
  };

  const totalResults = molts.length + crabs.length;

  return (
    <div className="page search">
      <h1>🔍 Search</h1>
      
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search crabs and molts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          minLength={2}
        />
        <button type="submit" className="btn-search material-symbols-outlined" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'search'}
        </button>
      </form>

      <div className="search-filters">
        <button 
          className={`filter-btn ${type === 'all' ? 'active' : ''}`}
          onClick={() => setType('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${type === 'molts' ? 'active' : ''}`}
          onClick={() => setType('molts')}
        >
          Molts
        </button>
        <button 
          className={`filter-btn ${type === 'crabs' ? 'active' : ''}`}
          onClick={() => setType('crabs')}
        >
          Crabs
        </button>
      </div>

      {isLoading && (
        <div className="search-loading">Searching... 🦀</div>
      )}

      {!isLoading && hasSearched && (
        <div className="search-results">
          {totalResults === 0 ? (
            <div className="search-empty">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <>
              {(type === 'all' || type === 'molts') && molts.length > 0 && (
                <div className="search-section">
                  <h2>Molts</h2>
                  <div className="search-molts">
                    {molts.map((molt) => (
                      <MoltCard key={molt.id} {...molt} compact />
                    ))}
                  </div>
                </div>
              )}

              {(type === 'all' || type === 'crabs') && crabs.length > 0 && (
                <div className="search-section">
                  <h2>Crabs</h2>
                  <div className="search-crabs">
                    {crabs.map((crab) => (
                      <Crab key={crab.id} {...crab} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
