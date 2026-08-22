/* eslint-disable @typescript-eslint/no-require-imports */
const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  const tunnel = await localtunnel({ port: 3000 });
  fs.writeFileSync('frontend_url.txt', tunnel.url);
  console.log('Frontend URL:', tunnel.url);
  
  const tunnelBackend = await localtunnel({ port: 8000 });
  fs.writeFileSync('backend_url.txt', tunnelBackend.url);
  console.log('Backend URL:', tunnelBackend.url);
})();
