if(!self.define){let e,s={};const n=(n,c)=>(n=new URL(n+".js",c).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(c,a)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let i={};const o=e=>n(e,t),r={module:{uri:t},exports:i,require:o};s[t]=Promise.all(c.map((e=>r[e]||o(e)))).then((e=>(a(...e),i)))}}define(["./workbox-1051b61c"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/312-20a7260c7df86382.js",revision:"20a7260c7df86382"},{url:"/_next/static/chunks/framework-19f3649580393c10.js",revision:"19f3649580393c10"},{url:"/_next/static/chunks/main-251c0edc2bbc4563.js",revision:"251c0edc2bbc4563"},{url:"/_next/static/chunks/pages/_app-d165ac7624d90328.js",revision:"d165ac7624d90328"},{url:"/_next/static/chunks/pages/_error-d11cb7facb2c59a4.js",revision:"d11cb7facb2c59a4"},{url:"/_next/static/chunks/pages/boleta-1698de33f998a406.js",revision:"1698de33f998a406"},{url:"/_next/static/chunks/pages/boleta/historial-18d84c466aecc985.js",revision:"18d84c466aecc985"},{url:"/_next/static/chunks/pages/bolsas-273732cda65817a3.js",revision:"273732cda65817a3"},{url:"/_next/static/chunks/pages/components/AuthComponents-f75e5f75cb342468.js",revision:"f75e5f75cb342468"},{url:"/_next/static/chunks/pages/components/boleta/InputBolsa-d1394ba14cd86444.js",revision:"d1394ba14cd86444"},{url:"/_next/static/chunks/pages/components/home/history-f3bc268bfb1b3323.js",revision:"f3bc268bfb1b3323"},{url:"/_next/static/chunks/pages/components/home/ingress-f2bd11c417c44f0f.js",revision:"f2bd11c417c44f0f"},{url:"/_next/static/chunks/pages/components/navbar-20c2d84e80f52ce0.js",revision:"20c2d84e80f52ce0"},{url:"/_next/static/chunks/pages/facturas-cf6553d0a91b10c7.js",revision:"cf6553d0a91b10c7"},{url:"/_next/static/chunks/pages/home-16ce1a1317b635c8.js",revision:"16ce1a1317b635c8"},{url:"/_next/static/chunks/pages/index-3482e4f77615b4e4.js",revision:"3482e4f77615b4e4"},{url:"/_next/static/chunks/pages/precios-2bcabe85186b5919.js",revision:"2bcabe85186b5919"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-36d12a75f0098f30.js",revision:"36d12a75f0098f30"},{url:"/_next/static/css/aa816a038aefe890.css",revision:"aa816a038aefe890"},{url:"/_next/static/vHGLcnYU9cxLMYHsNTqly/_buildManifest.js",revision:"c74431d7b6ad1cf5ee4853fc092484c1"},{url:"/_next/static/vHGLcnYU9cxLMYHsNTqly/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/favicon.ico",revision:"d4d62b2ac4cfa63ade7f1766fb098bc5"},{url:"/icon-192x192.png",revision:"7224c3565834661b027a2e6655326677"},{url:"/icon-256x256.png",revision:"9c81750087b9ca7d28de0d52953a55b5"},{url:"/icon-384x384.png",revision:"845bdff3779703dbd14d4c18033d076a"},{url:"/icon-512x512.png",revision:"3ca7c9f84b7cb12190a86e89ddba878e"},{url:"/manifest.webmanifest",revision:"ab5aebf257947f20dabde7e7a8c5616d"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
