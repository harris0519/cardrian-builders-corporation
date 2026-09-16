const recipients = ['qs@cardrian.com', 'myp@cardrian.com', 'tengponco@cardrian.com', 'harrislazaro05@gmail.com', 'miguelponco@cardrian.com'];
const fields = { name: ['Full name', 120], company: ['Company', 200], email: ['Email address', 254], phone: ['Contact number', 60], 'Project Type': ['Project type', 100], message: ['Project details', 10000] };
const escape = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function validateInquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid inquiry.');
  const inquiry = {};
  for (const [key, [label, limit]] of Object.entries(fields)) {
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.length > limit) throw new Error(`${label} is invalid or too long.`);
    inquiry[key] = value.trim();
  }
  if (!inquiry.name || !inquiry.message || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(inquiry.email)) throw new Error('Please provide your name, valid email, and project details.');
  if (/[\r\n]/.test(inquiry.name) || !['General Construction', 'Interior Fit-Out', 'Renovation', 'Project Management'].includes(inquiry['Project Type'])) throw new Error('Please select a valid project type.');
  return inquiry;
}

export function buildEmail(inquiry) {
  const rows = Object.entries(fields).filter(([key]) => key !== 'message').map(([key, [label]]) => `<tr><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#64748b;width:35%">${label}</td><td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#142e3c;word-break:break-word">${escape(inquiry[key] || 'Not provided')}</td></tr>`).join('');
  return {
    sender: { name: 'Cardrian Builders Corporation', email: 'info@cardrian.com' },
    to: recipients.map(email => ({ email })),
    replyTo: { email: inquiry.email, name: inquiry.name },
    subject: `New project inquiry — ${inquiry['Project Type']} — ${inquiry.name}`,
    textContent: `CARDRIAN BUILDERS CORPORATION\nNew project inquiry\n\n${Object.entries(fields).map(([key, [label]]) => `${label}: ${inquiry[key] || 'Not provided'}`).join('\n\n')}`,
    htmlContent: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New project inquiry</title></head><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fff;border-radius:12px;overflow:hidden"><tr><td style="padding:32px;background:#142e3c;border-top:5px solid #d9b46d;color:#fff"><p style="font-size:12px;letter-spacing:2px;color:#d9b46d;margin:0 0 16px">CARDRIAN BUILDERS CORPORATION</p><h1 style="font-size:28px;margin:0 0 12px">New project inquiry</h1><p style="margin:0;line-height:1.6">A prospective client would like to build with us.</p></td></tr><tr><td style="padding:24px"><h2 style="font-size:18px;color:#142e3c">Contact &amp; project overview</h2><table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px">${rows}</table><h2 style="font-size:18px;color:#142e3c;margin-top:28px">Project details</h2><div style="padding:20px;background:#f8fafc;border-left:3px solid #d9b46d;line-height:1.7;color:#334155;word-break:break-word">${escape(inquiry.message).replace(/\r?\n/g, '<br>')}</div><p style="margin:28px 0"><a href="mailto:${escape(encodeURIComponent(inquiry.email))}" style="display:inline-block;background:#142e3c;color:#fff;padding:14px 22px;border-radius:6px;text-decoration:none">Reply to ${escape(inquiry.name)}</a></p><p style="font-size:12px;color:#64748b;line-height:1.6">Sent from the Cardrian website inquiry form. Reply directly to this email to contact the client.</p></td></tr></table></td></tr></table></body></html>`,
  };
}

export async function sendInquiry(inquiry, apiKey, fetcher = fetch) {
  const response = await fetcher('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify(buildEmail(inquiry)),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Email provider rejected the inquiry.');
  const result = await response.json();
  if (!result.messageId) throw new Error('Email provider did not acknowledge the inquiry.');
}
