function normalizeHeaders(headers = {}) {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [String(key).toLowerCase(), value]),
  );
}

function parseBody(event) {
  const raw = event.body || '';
  if (!raw) return undefined;
  const contentType = String(event.headers?.['content-type'] || event.headers?.['Content-Type'] || '').toLowerCase();
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

export async function runVercelHandler(handler, event) {
  const headers = normalizeHeaders(event.headers || {});
  const query = event.queryStringParameters || {};
  const body = parseBody(event);

  const req = {
    method: event.httpMethod || 'GET',
    headers,
    query,
    body,
    url: event.rawUrl || event.path || '/',
  };

  let statusCode = 200;
  const responseHeaders = {};
  const multiValueHeaders = {};
  let responseBody = '';
  let finished = false;

  const res = {
    status(code) {
      statusCode = Number(code) || 200;
      return this;
    },
    setHeader(name, value) {
      const key = String(name);
      if (key.toLowerCase() === 'set-cookie') {
        const values = Array.isArray(value) ? value.map(String) : [String(value)];
        multiValueHeaders['Set-Cookie'] = values;
      } else {
        responseHeaders[key] = Array.isArray(value) ? value.join(', ') : String(value);
      }
      return this;
    },
    json(value) {
      responseHeaders['Content-Type'] = responseHeaders['Content-Type'] || 'application/json; charset=utf-8';
      responseBody = JSON.stringify(value);
      finished = true;
      return this;
    },
    send(value = '') {
      if (typeof value === 'object' && value !== null && !Buffer.isBuffer(value)) {
        return this.json(value);
      }
      responseBody = Buffer.isBuffer(value) ? value.toString('base64') : String(value);
      finished = true;
      return this;
    },
    redirect(statusOrUrl, maybeUrl) {
      const hasStatus = typeof statusOrUrl === 'number';
      statusCode = hasStatus ? statusOrUrl : 302;
      responseHeaders.Location = String(hasStatus ? maybeUrl : statusOrUrl);
      responseBody = '';
      finished = true;
      return this;
    },
    end(value = '') {
      responseBody = String(value ?? '');
      finished = true;
      return this;
    },
  };

  try {
    await handler(req, res);
  } catch (error) {
    console.error('Netlify API adapter error:', error);
    if (!finished) {
      statusCode = 500;
      responseHeaders['Content-Type'] = 'application/json; charset=utf-8';
      responseBody = JSON.stringify({ error: 'Internal server error' });
    }
  }

  return {
    statusCode,
    headers: responseHeaders,
    ...(Object.keys(multiValueHeaders).length ? { multiValueHeaders } : {}),
    body: responseBody,
  };
}
