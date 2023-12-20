const t = /* @__PURE__ */ location.pathname.split("/").slice(0, -1).join("/"), l = [
  t + "/_app/immutable/entry/app.324c8d5d.js",
  t + "/_app/immutable/nodes/0.be4f3342.js",
  t + "/_app/immutable/nodes/1.de50b6af.js",
  t + "/_app/immutable/assets/2.7d111529.css",
  t + "/_app/immutable/nodes/2.0f1ad7f0.js",
  t + "/_app/immutable/chunks/index.504075d7.js",
  t + "/_app/immutable/chunks/index.c2b02156.js",
  t + "/_app/immutable/chunks/singletons.71ef5117.js",
  t + "/_app/immutable/entry/start.834397fd.js"
], d = [
  t + "/chain-icon.png",
  t + "/favicon.png",
  t + "/gear-svgrepo-com.svg",
  t + "/manifest.json",
  t + "/vars.css"
], i = "1696608148941", c = self, r = `cache${i}`, h = l.concat(d), m = new Set(h);
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
  const e = new URL(s.request.url), a = e.protocol.startsWith("http"), n = e.hostname === self.location.hostname && e.port !== self.location.port, o = e.host === self.location.host && m.has(e.pathname), p = s.request.cache === "only-if-cached" && !o;
  a && !n && !p && s.respondWith(
    (async () => o && await caches.match(s.request) || u(s.request))()
  );
});
