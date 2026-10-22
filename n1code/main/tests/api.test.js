import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../netlify/functions/api.js';

vi.mock('resend', () => {
  return {
    Resend: class {
      constructor() {
        this.emails = {
          send: vi.fn().mockResolvedValue({ data: { id: 'test-email-id' }, error: null })
        };
      }
    }
  };
});

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: `status ${status}`,
  text: () => Promise.resolve(JSON.stringify(body)),
  json: () => Promise.resolve(body),
});

global.fetch = vi.fn().mockImplementation((url) => {
  if (url.includes('siteverify')) {
    return Promise.resolve(jsonResponse({ success: true }));
  }
  return Promise.resolve(jsonResponse({}));
});

describe('Netlify API Serverless Functions', () => {
  it('GET /api/health should return online status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'online');
  });

  it('POST /api/contact should return 400 if fields are missing', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Test' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Missing required fields');
  });

  it('POST /api/contact should successfully mock send an email', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Test',
      email: 'test@example.com',
      message: 'Hello',
      turnstileToken: 'mock-token'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('GET /api/steam should return 400 if steamId is missing', async () => {
    const res = await request(app).get('/api/steam');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Missing or invalid steamId');
  });

  it('GET /api/steam should return 500 when STEAM_API_KEY is not set', async () => {
    const saved = process.env.STEAM_API_KEY;
    delete process.env.STEAM_API_KEY;

    try {
      const res = await request(app).get('/api/steam?steamId=76561199588417853');
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'STEAM_API_KEY not configured');
    } finally {
      if (saved === undefined) delete process.env.STEAM_API_KEY;
      else process.env.STEAM_API_KEY = saved;
    }
  });

  it('GET /api/steam reports an HTML rejection instead of throwing a SyntaxError', async () => {
    process.env.STEAM_API_KEY = 'test-key';
    const html = '<html><head><title>Unauthorized</title></head><body><h1>Access is denied.</h1></body></html>';
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: () => Promise.resolve(html),
    });

    try {
      const res = await request(app).get('/api/steam?steamId=76561199588417853');

      // Before the fix this blew up as "SyntaxError: Unexpected token '<'".
      expect(res.statusCode).toEqual(502);
      expect(res.body.error).toContain('Steam API returned 401');
      expect(res.body.detail).toContain('Access is denied');
      expect(res.body.hint).toContain('steamcommunity.com/dev/apikey');
    } finally {
      delete process.env.STEAM_API_KEY;
    }
  });

  it('GET /api/steam returns games and reports a private profile', async () => {
    process.env.STEAM_API_KEY = 'test-key';

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: () =>
        Promise.resolve(JSON.stringify({
          response: { game_count: 1, games: [{ appid: 730, name: 'Counter-Strike 2', playtime_forever: 600 }] },
        })),
    });

    try {
      const res = await request(app).get('/api/steam?steamId=76561199588417853');

      expect(res.statusCode).toEqual(200);
      expect(res.body.privateProfile).toBe(false);
      expect(res.body.games).toHaveLength(1);
      expect(res.body.games[0]).toHaveProperty('name', 'Counter-Strike 2');
    } finally {
      delete process.env.STEAM_API_KEY;
    }
  });

  it('GET /api/steam flags an empty library as a private profile', async () => {
    process.env.STEAM_API_KEY = 'test-key';

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: () => Promise.resolve(JSON.stringify({ response: {} })),
    });

    try {
      const res = await request(app).get('/api/steam?steamId=76561199588417853');

      expect(res.statusCode).toEqual(200);
      expect(res.body.games).toEqual([]);
      expect(res.body.privateProfile).toBe(true);
    } finally {
      delete process.env.STEAM_API_KEY;
    }
  });
});
