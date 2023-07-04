const t = /* @__PURE__ */ location.pathname.split("/").slice(0, -1).join("/"), p = [
  t + "/_app/immutable/entry/app.eeb887e5.js",
  t + "/_app/immutable/nodes/0.44bfcc5b.js",
  t + "/_app/immutable/nodes/1.7d3be3fc.js",
  t + "/_app/immutable/assets/2.fc162538.css",
  t + "/_app/immutable/nodes/2.50fcda8c.js",
  t + "/_app/immutable/chunks/index.20faa67b.js",
  t + "/_app/immutable/chunks/index.2cf65d35.js",
  t + "/_app/immutable/chunks/singletons.6193004d.js",
  t + "/_app/immutable/entry/start.30837f7c.js"
], m = [
  t + "/.nojekyll",
  t + "/chain-icon.png",
  t + "/favicon.png",
  t + "/gear-svgrepo-com.svg",
  t + "/manifest.json",
  t + "/vars.css"
], i = "1688490576750", c = self, r = `cache${i}`, h = p.concat(m), d = new Set(h);
c.addEventListener("install", (s) => {
  s.waitUntil(
    caches.open(r).then((e) => e.addAll(h)).then(() => {
      c.skipWaiting();
    })
  );
});
c.addEventListener("activate", (s) => {
  s.waitUntil(
    caches.keys().then(async (e) => {
      for (const a of e)
        a !== r && await caches.delete(a);
      c.clients.claim();
    })
  );
});
async function f(s) {
  const e = await caches.open(`offline${i}`);
  try {
    const a = await fetch(s);
    return e.put(s, a.clone()), a;
  } catch (a) {
    const n = await e.match(s);
    if (n)
      return n;
    throw a;
  }
}
c.addEventListener("fetch", (s) => {
  if (s.request.method !== "GET" || s.request.headers.has("range"))
    return;
  const e = new URL(s.request.url), a = e.protocol.startsWith("http"), n = e.hostname === self.location.hostname && e.port !== self.location.port, o = e.host === self.location.host && d.has(e.pathname), l = s.request.cache === "only-if-cached" && !o;
  a && !n && !l && s.respondWith(
    (async () => o && await caches.match(s.request) || f(s.request))()
  );
});
