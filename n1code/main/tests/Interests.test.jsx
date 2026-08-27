import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Interests from '../src/pages/Interests';

// Mock dependencies
vi.mock('../src/lib/cache', () => ({
  fetchCachedData: vi.fn((key, cb) => {
    const data = {
      games: [{ id: '1', title: 'Test Game', hours: 10, status: 'Completed' }],
      anime: [{ id: '1', title: 'Test Anime', score: 10, type: 'Anime' }],
      anilistUsername: 'testuser',
      anilistSyncEnabled: true,
      steamId: '12345',
      steamSyncEnabled: true
    };
    cb(data);
    return Promise.resolve(data);
  })
}));

// Mock fetch for Steam and AniList
global.fetch = vi.fn((url) => {
  if (url.includes('/api/steam')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ appid: 1, name: 'Steam Game', playtime_forever: 600 }])
    });
  }
  if (url.includes('graphql.anilist.co')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: {
          anime: { lists: [] },
          manga: { lists: [] }
        }
      })
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

describe('Interests Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header correctly', async () => {
    render(<Interests />);
    expect(await screen.findByText(/Lounge &/i)).toBeInTheDocument();
  });
});
