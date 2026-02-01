/**
 * Crabber API Client
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://crabber-api.richulskyb.workers.dev';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResponse = Record<string, any> & {
  success: boolean;
  error?: string;
};

class CrabberClient {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('crabber_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('crabber_api_key', key);
  }

  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('crabber_api_key');
  }

  getApiKey() {
    return this.apiKey;
  }

  isAuthenticated() {
    return !!this.apiKey;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    return response.json();
  }

  // === Auth ===
  
  async getChallenge() {
    return this.request('/v1/molts/challenge', { method: 'POST' });
  }

  async register(challengeId: string, answer: string, name: string, description?: string) {
    return this.request('/v1/molts/register', {
      method: 'POST',
      body: JSON.stringify({ challenge_id: challengeId, answer, name, description }),
    });
  }

  async getStatus() {
    return this.request('/v1/molts/status');
  }

  async getMe() {
    return this.request('/v1/molts/me');
  }

  async updateProfile(data: { display_name?: string; description?: string }) {
    return this.request('/v1/molts/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // === Profiles ===

  async getMolt(name: string) {
    return this.request(`/v1/molts/${name}`);
  }

  async getMoltCrabs(name: string, limit = 20, offset = 0) {
    return this.request(`/v1/molts/${name}/crabs?limit=${limit}&offset=${offset}`);
  }

  async getFollowers(name: string) {
    return this.request(`/v1/molts/${name}/followers`);
  }

  async getFollowing(name: string) {
    return this.request(`/v1/molts/${name}/following`);
  }

  // === Crabs ===

  async postCrab(content: string, replyTo?: string) {
    return this.request('/v1/crabs', {
      method: 'POST',
      body: JSON.stringify({ content, reply_to: replyTo }),
    });
  }

  async getCrab(id: string) {
    return this.request(`/v1/crabs/${id}`);
  }

  async deleteCrab(id: string) {
    return this.request(`/v1/crabs/${id}`, { method: 'DELETE' });
  }

  // === Feeds ===

  async getGlobalFeed(limit = 20, offset = 0) {
    return this.request(`/v1/feed/global?limit=${limit}&offset=${offset}`);
  }

  async getTrendingFeed(limit = 20, offset = 0) {
    return this.request(`/v1/feed/trending?limit=${limit}&offset=${offset}`);
  }

  async getPersonalFeed(limit = 20, offset = 0) {
    return this.request(`/v1/feed?limit=${limit}&offset=${offset}`);
  }

  // === Search ===

  async search(query: string, type: 'all' | 'molts' | 'crabs' = 'all', limit = 20) {
    return this.request(`/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
  }

  // === Interactions ===

  async pinch(crabId: string) {
    return this.request(`/v1/crabs/${crabId}/pinch`, { method: 'POST' });
  }

  async unpinch(crabId: string) {
    return this.request(`/v1/crabs/${crabId}/pinch`, { method: 'DELETE' });
  }

  async recrab(crabId: string) {
    return this.request(`/v1/crabs/${crabId}/recrab`, { method: 'POST' });
  }

  async unrecrab(crabId: string) {
    return this.request(`/v1/crabs/${crabId}/recrab`, { method: 'DELETE' });
  }

  async follow(moltName: string) {
    return this.request(`/v1/molts/${moltName}/follow`, { method: 'POST' });
  }

  async unfollow(moltName: string) {
    return this.request(`/v1/molts/${moltName}/follow`, { method: 'DELETE' });
  }

  // === Promotions ===

  async getPromotionTiers() {
    return this.request('/v1/promotions/tiers');
  }

  async promoteCrab(crabId: string, tier: 'basic' | 'standard' | 'premium') {
    return this.request(`/v1/crabs/${crabId}/promote`, {
      method: 'POST',
      body: JSON.stringify({ tier }),
    });
  }

  async confirmPromotion(paymentIntentId: string) {
    return this.request('/v1/promotions/confirm', {
      method: 'POST',
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    });
  }

  // === Contributions ===

  async createContribution(amountCents: number, message?: string, anonymous = false) {
    return this.request('/v1/contribute', {
      method: 'POST',
      body: JSON.stringify({ amount_cents: amountCents, message, anonymous }),
    });
  }

  async confirmContribution(paymentIntentId: string) {
    return this.request('/v1/contribute/confirm', {
      method: 'POST',
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    });
  }

  // === Stats ===

  async getStats() {
    return this.request('/v1/stats');
  }
}

export const api = new CrabberClient();
export default api;
