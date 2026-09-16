import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInquiry, buildEmail, sendInquiry } from './inquiry.js';
import { createInquiryServer } from './index.js';

const input = { name: 'Sample Client', company: 'Example & Co', email: 'client@example.com', phone: '+63 123', 'Project Type': 'Renovation', message: 'First line\n<script>alert(1)</script>' };

test('all form fields, fixed routing, reply address and escaped HTML', () => {
  const email = buildEmail(validateInquiry(input));
  assert.equal(email.sender.email, 'info@cardrian.com');
  assert.deepEqual(email.to.map(item => item.email), ['qs@cardrian.com', 'myp@cardrian.com', 'tengponco@cardrian.com', 'harrislazaro05@gmail.com', 'miguelponco@cardrian.com']);
  assert.equal(email.replyTo.email, input.email);
  assert.ok(!email.htmlContent.includes('<script>'));
  assert.ok(email.htmlContent.includes('First line<br>&lt;script&gt;'));
  for (const value of Object.values(input)) assert.ok(email.textContent.includes(value));
});

test('invalid fields are rejected', () => {
  for (const change of [{ email: 'invalid' }, { name: '' }, { message: ' ' }, { 'Project Type': 'other' }, { company: {} }, { message: 'a'.repeat(10001) }]) {
    assert.throws(() => validateInquiry({ ...input, ...change }));
  }
});

test('Brevo request and provider failures', async () => {
  await sendInquiry(input, 'test-key', async (url, options) => {
    assert.equal(url, 'https://api.brevo.com/v3/smtp/email');
    assert.equal(options.headers['api-key'], 'test-key');
    assert.equal(JSON.parse(options.body).to.length, 5);
    return { ok: true, json: async () => ({ messageId: 'test' }) };
  });
  await assert.rejects(sendInquiry(input, 'test-key', async () => ({ ok: false })));
  await assert.rejects(sendInquiry(input, 'test-key', async () => ({ ok: true, json: async () => ({}) })));
});

test('HTTP validation, CORS, honeypot, provider error, success and rate limit', async t => {
  let sends = 0;
  const server = createInquiryServer({ apiKey: 'test-key', send: async () => { sends++; if (sends === 1) throw new Error('provider failed'); } });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/api/inquiry`;
  const post = body => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.equal((await fetch(url)).status, 405);
  assert.equal((await fetch(url, { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } })).status, 403);
  const cors = await fetch(url, { method: 'OPTIONS', headers: { Origin: 'http://localhost:5173' } });
  assert.equal(cors.status, 204);
  assert.equal(cors.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.equal((await post({})).status, 400);
  assert.equal((await post({ _honey: 'bot' })).status, 200);
  assert.equal(sends, 0);
  assert.equal((await post(input)).status, 502);
  assert.deepEqual(await (await post(input)).json(), { success: true });
  await post(input);
  assert.equal((await post(input)).status, 429);
});
