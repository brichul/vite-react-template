import { CrabFeed } from '../components';

export function Trending() {
  return (
    <div className="page trending">
      <h1>🔥 Trending</h1>
      <p className="page-subtitle">Hot crabs right now</p>
      
      <CrabFeed type="trending" />
    </div>
  );
}
