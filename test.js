const http = require('http');
const assert = require('assert');

const BASE_URL = 'http://127.0.0.1:3000';

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let body = '';

      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(body)
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  const home = await get('/');
  assert.strictEqual(home.statusCode, 200);
  assert.strictEqual(home.body.message, 'Hello from Docker CI/CD!');
  console.log('PASS: Home endpoint');

  const health = await get('/health');
  assert.strictEqual(health.statusCode, 200);
  assert.strictEqual(health.body.status, 'healthy');
  console.log('PASS: Health endpoint');

  console.log('All tests passed!');
}

runTests().catch(err => {
  console.error('Tests failed:', err.message);
  process.exitCode = 1;
});
