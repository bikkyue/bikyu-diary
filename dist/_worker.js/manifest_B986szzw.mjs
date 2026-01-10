globalThis.process ??= {}; globalThis.process.env ??= {};
import { q as decodeKey } from './chunks/astro/server_D5xLhYud.mjs';
import './chunks/astro-designed-error-pages_BnqMXbHF.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_B0JBBPRy.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/kondou/Develop/DiaryPage/","cacheDir":"file:///Users/kondou/Develop/DiaryPage/node_modules/.astro/","outDir":"file:///Users/kondou/Develop/DiaryPage/dist/","srcDir":"file:///Users/kondou/Develop/DiaryPage/src/","publicDir":"file:///Users/kondou/Develop/DiaryPage/public/","buildClientDir":"file:///Users/kondou/Develop/DiaryPage/dist/","buildServerDir":"file:///Users/kondou/Develop/DiaryPage/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin/edit/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/edit\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"edit","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/edit/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin/new","isIndex":false,"type":"page","pattern":"^\\/admin\\/new\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"new","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/new.astro","pathname":"/admin/new","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin/upload","isIndex":false,"type":"page","pattern":"^\\/admin\\/upload\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/upload.astro","pathname":"/admin/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/diary/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/diary\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"diary","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/diary/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/diary","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/diary\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"diary","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/diary/index.ts","pathname":"/api/diary","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/import","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/import\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/import.ts","pathname":"/api/import","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/upload.ts","pathname":"/api/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/diary/[id]","isIndex":false,"type":"page","pattern":"^\\/diary\\/([^/]+?)\\/?$","segments":[[{"content":"diary","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/diary/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tag/[name]","isIndex":false,"type":"page","pattern":"^\\/tag\\/([^/]+?)\\/?$","segments":[[{"content":"tag","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"src/pages/tag/[name].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/tags","isIndex":false,"type":"page","pattern":"^\\/tags\\/?$","segments":[[{"content":"tags","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tags.astro","pathname":"/tags","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/kondou/Develop/DiaryPage/src/pages/admin/edit/[id].astro",{"propagation":"none","containsHead":true}],["/Users/kondou/Develop/DiaryPage/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["/Users/kondou/Develop/DiaryPage/src/pages/admin/new.astro",{"propagation":"none","containsHead":true}],["/Users/kondou/Develop/DiaryPage/src/pages/admin/upload.astro",{"propagation":"none","containsHead":true}],["/Users/kondou/Develop/DiaryPage/src/pages/diary/[id].astro",{"propagation":"none","containsHead":true}],["/Users/kondou/Develop/DiaryPage/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/kondou/Develop/DiaryPage/src/pages/tag/[name].astro",{"propagation":"none","containsHead":true}],["/Users/kondou/Develop/DiaryPage/src/pages/tags.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/admin/edit/[id]@_@astro":"pages/admin/edit/_id_.astro.mjs","\u0000@astro-page:src/pages/admin/new@_@astro":"pages/admin/new.astro.mjs","\u0000@astro-page:src/pages/admin/upload@_@astro":"pages/admin/upload.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/diary/[id]@_@ts":"pages/api/diary/_id_.astro.mjs","\u0000@astro-page:src/pages/api/diary/index@_@ts":"pages/api/diary.astro.mjs","\u0000@astro-page:src/pages/api/import@_@ts":"pages/api/import.astro.mjs","\u0000@astro-page:src/pages/api/upload@_@ts":"pages/api/upload.astro.mjs","\u0000@astro-page:src/pages/diary/[id]@_@astro":"pages/diary/_id_.astro.mjs","\u0000@astro-page:src/pages/tag/[name]@_@astro":"pages/tag/_name_.astro.mjs","\u0000@astro-page:src/pages/tags@_@astro":"pages/tags.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_B986szzw.mjs","/Users/kondou/Develop/DiaryPage/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/Users/kondou/Develop/DiaryPage/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DQVpMoM5.mjs","/Users/kondou/Develop/DiaryPage/src/pages/admin/edit/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.CJ6XBbAR.js","/Users/kondou/Develop/DiaryPage/src/pages/admin/upload.astro?astro&type=script&index=0&lang.ts":"_astro/upload.astro_astro_type_script_index_0_lang.BTej2mpR.js","/Users/kondou/Develop/DiaryPage/src/pages/admin/new.astro?astro&type=script&index=0&lang.ts":"_astro/new.astro_astro_type_script_index_0_lang.D6sy1tU5.js","/Users/kondou/Develop/DiaryPage/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.DTIsLzn2.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/kondou/Develop/DiaryPage/src/pages/admin/edit/[id].astro?astro&type=script&index=0&lang.ts","const a=document.getElementById(\"diary-form\"),d=a?.dataset.id,o=document.getElementById(\"content\"),i=document.getElementById(\"char-count\");function r(){const n=o.value.length;i.textContent=`(${n.toLocaleString()}文字)`}o&&i&&(r(),o.addEventListener(\"input\",r));a?.addEventListener(\"submit\",async n=>{n.preventDefault();const t=new FormData(a),s={title:t.get(\"title\"),content:t.get(\"content\"),tags:t.get(\"tags\")?.toString().split(\",\").map(e=>e.trim()).filter(Boolean)||[],thumbnail:t.get(\"thumbnail\")||void 0,status:t.get(\"status\")};try{const e=await fetch(`/api/diary/${d}`,{method:\"PUT\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(s)});if(e.ok)window.location.href=\"/admin\";else{const c=await e.json();alert(c.error||\"更新に失敗しました。\")}}catch{alert(\"更新に失敗しました。\")}});"],["/Users/kondou/Develop/DiaryPage/src/pages/admin/upload.astro?astro&type=script&index=0&lang.ts","const l=document.getElementById(\"upload-form\"),e=document.getElementById(\"result\");l.addEventListener(\"submit\",async n=>{n.preventDefault();const o=document.getElementById(\"file\").files?.[0];if(!o){alert(\"ファイルを選択してください。\");return}const r=new FormData;r.append(\"file\",o);try{const t=await fetch(\"/api/import\",{method:\"POST\",body:r}),a=await t.json();t.ok?(e.innerHTML=`\n          <div class=\"card\" style=\"background: #dcfce7; border-color: #16a34a;\">\n            <p style=\"color: #16a34a; font-weight: 500;\">インポートが完了しました！</p>\n            <p class=\"mt-md\">\n              <a href=\"/admin\" class=\"btn btn-primary\">管理画面へ戻る</a>\n            </p>\n          </div>\n        `,e.style.display=\"block\",l.style.display=\"none\"):(e.innerHTML=`\n          <div class=\"card\" style=\"background: #fee2e2; border-color: #dc2626;\">\n            <p style=\"color: #dc2626; font-weight: 500;\">エラー: ${a.error}</p>\n          </div>\n        `,e.style.display=\"block\")}catch{alert(\"インポートに失敗しました。\")}});"],["/Users/kondou/Develop/DiaryPage/src/pages/admin/new.astro?astro&type=script&index=0&lang.ts","const a=document.getElementById(\"diary-form\"),o=document.getElementById(\"content\"),i=document.getElementById(\"char-count\");function r(){const n=o.value.length;i.textContent=`(${n.toLocaleString()}文字)`}o&&i&&(r(),o.addEventListener(\"input\",r));a.addEventListener(\"submit\",async n=>{n.preventDefault();const t=new FormData(a),c={title:t.get(\"title\"),content:t.get(\"content\"),tags:t.get(\"tags\")?.toString().split(\",\").map(e=>e.trim()).filter(Boolean)||[],thumbnail:t.get(\"thumbnail\")||void 0,status:t.get(\"status\")};try{const e=await fetch(\"/api/diary\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(c)});if(e.ok)window.location.href=\"/admin\";else{const s=await e.json();alert(s.error||\"保存に失敗しました。\")}}catch{alert(\"保存に失敗しました。\")}});"],["/Users/kondou/Develop/DiaryPage/src/pages/admin/index.astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(\".delete-btn\").forEach(e=>{e.addEventListener(\"click\",async r=>{const t=r.target,a=t.dataset.id,o=t.dataset.title;if(confirm(`「${o}」を削除しますか？`))try{(await fetch(`/api/diary/${a}`,{method:\"DELETE\"})).ok?window.location.reload():alert(\"削除に失敗しました。\")}catch{alert(\"削除に失敗しました。\")}})});"]],"assets":["/favicon.svg","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/styles/global.css","/_worker.js/chunks/DiaryCard_DhUcklNl.mjs","/_worker.js/chunks/Layout_ChuwguAO.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_D2T2k5_p.mjs","/_worker.js/chunks/astro-designed-error-pages_BnqMXbHF.mjs","/_worker.js/chunks/astro_fr0YQW38.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/db_DmU0dmNz.mjs","/_worker.js/chunks/image-endpoint_DPFoJFPn.mjs","/_worker.js/chunks/index_BvoLDMMx.mjs","/_worker.js/chunks/markdown_1o_YKxWM.mjs","/_worker.js/chunks/noop-middleware_B0JBBPRy.mjs","/_worker.js/chunks/path_CH3auf61.mjs","/_worker.js/chunks/remote_CrdlObHx.mjs","/_worker.js/chunks/sharp_DQVpMoM5.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/pages/admin.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/pages/tags.astro.mjs","/_worker.js/chunks/astro/server_D5xLhYud.mjs","/_worker.js/pages/admin/new.astro.mjs","/_worker.js/pages/admin/upload.astro.mjs","/_worker.js/pages/diary/_id_.astro.mjs","/_worker.js/pages/api/diary.astro.mjs","/_worker.js/pages/api/import.astro.mjs","/_worker.js/pages/api/upload.astro.mjs","/_worker.js/pages/tag/_name_.astro.mjs","/_worker.js/pages/admin/edit/_id_.astro.mjs","/_worker.js/pages/api/diary/_id_.astro.mjs"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"HVDCoHKA/LUe0DdpltXHpKzfh6QKg7+eovhCKLdjAME=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
