const assert = require('assert');
const app = require('../src/app');

const server = app.listen(0, async () => {
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/health`);
  const body = await response.json();

  assert.strictEqual(response.status, 200);
  assert.strictEqual(body.status, 'ok');

  server.close(() => {
    console.log('Teste de health check passou.');
  });
});
