const CACHE='mienta-v2';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return; // never cache Supabase / external calls
  e.respondWith(
    fetch(r).then(res=>{
      if(res&&res.ok){const c=res.clone();caches.open(CACHE).then(ch=>ch.put(r,c))}
      return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html')||caches.match('./')))
  );
});
