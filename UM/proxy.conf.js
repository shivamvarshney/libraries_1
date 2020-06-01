'use strict';

const HttpsProxyAgent = require('https-proxy-agent');

/*
 * API proxy configuration.
 * This allows you to proxy HTTP request like `http.get('/api/stuff')` to another server/port.
 * This is especially useful during app development to avoid CORS issues while running a local server.
 * For more details and options, see https://github.com/angular/angular-cli#proxy-to-backend
 */
const proxyConfig = [
  {
    context: '/auth',
    target: 'https://172.23.12.187:9091',
    //target: "https://172.23.12.145/bfe/web/auth/",
    changeOrigin: true,
    secure: false
  }, 
  {
    context:'/signout',
    target:'https://172.23.12.187:9091',
    //target: "https://172.23.12.145/bfe/web/salesservice/api/",
    changeOrigin: true,
    secure: false
  },
  {
    context: '/api',
    target: 'https://172.23.12.187:9091',
    //target: "https://172.23.12.145/bfe/web/salesservice/api/",
    changeOrigin: true,
    secure: false
  }
];
/*
 * Configures a corporate proxy agent for the API proxy if needed.
 */
function setupForCorporateProxy(proxyConfig) {
  if (!Array.isArray(proxyConfig)) {
    proxyConfig = [proxyConfig];
  }
  const proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  let agent = null;

  if (proxyServer) {
    console.log(`Using corporate proxy server: ${proxyServer}`);
    agent = new HttpsProxyAgent(proxyServer);
    proxyConfig.forEach(entry => {
      entry.agent = agent;
    });
  }

  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
