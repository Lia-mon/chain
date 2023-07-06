const t = /* @__PURE__ */ location.pathname.split("/").slice(0, -1).join("/"), p = [
  t + "/_app/immutable/entry/app.b0155a1b.js",
  t + "/_app/immutable/nodes/0.c89226d3.js",
  t + "/_app/immutable/nodes/1.73fa5ddc.js",
  t + "/_app/immutable/assets/2.360693db.css",
  t + "/_app/immutable/nodes/2.ee730053.js",
  t + "/_app/immutable/chunks/index.34c7cd5a.js",
  t + "/_app/immutable/chunks/index.e5f0f49b.js",
  t + "/_app/immutable/chunks/singletons.afd5c1d4.js",
  t + "/_app/immutable/entry/start.da16e608.js"
], d = [
  t + "/.nojekyll",
  t + "/chain-icon.png",
  t + "/favicon.png",
  t + "/gear-svgrepo-com.svg",
  t + "/manifest.json",
  t + "/vars.css"
], i = "1688656324779", c = self, r = `cache${i}`, h = p.concat(d), m = new Set(h);
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
async function u(s) {
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
  const e = new URL(s.request.url), a = e.protocol.startsWith("http"), n = e.hostname === self.location.hostname && e.port !== self.location.port, o = e.host === self.location.host && m.has(e.pathname), l = s.request.cache === "only-if-cached" && !o;
  a && !n && !l && s.respondWith(
    (async () => o && await caches.match(s.request) || u(s.request))()
  );
});
