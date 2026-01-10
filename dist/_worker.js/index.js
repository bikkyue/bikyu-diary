globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D2T2k5_p.mjs';
import { manifest } from './manifest_B986szzw.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/edit/_id_.astro.mjs');
const _page2 = () => import('./pages/admin/new.astro.mjs');
const _page3 = () => import('./pages/admin/upload.astro.mjs');
const _page4 = () => import('./pages/admin.astro.mjs');
const _page5 = () => import('./pages/api/diary/_id_.astro.mjs');
const _page6 = () => import('./pages/api/diary.astro.mjs');
const _page7 = () => import('./pages/api/import.astro.mjs');
const _page8 = () => import('./pages/api/upload.astro.mjs');
const _page9 = () => import('./pages/diary/_id_.astro.mjs');
const _page10 = () => import('./pages/tag/_name_.astro.mjs');
const _page11 = () => import('./pages/tags.astro.mjs');
const _page12 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/admin/edit/[id].astro", _page1],
    ["src/pages/admin/new.astro", _page2],
    ["src/pages/admin/upload.astro", _page3],
    ["src/pages/admin/index.astro", _page4],
    ["src/pages/api/diary/[id].ts", _page5],
    ["src/pages/api/diary/index.ts", _page6],
    ["src/pages/api/import.ts", _page7],
    ["src/pages/api/upload.ts", _page8],
    ["src/pages/diary/[id].astro", _page9],
    ["src/pages/tag/[name].astro", _page10],
    ["src/pages/tags.astro", _page11],
    ["src/pages/index.astro", _page12]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
