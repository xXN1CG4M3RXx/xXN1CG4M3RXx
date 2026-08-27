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
      message: 'Hello'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('GET /api/steam should return 400 if steamId is missing', async () => {
    const res = await request(app).get('/api/steam');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Missing steamId');
  });
});
