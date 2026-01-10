/// <reference types="astro/client" />

interface CloudflareEnv {
    DB: import('@cloudflare/workers-types').D1Database;
    BUCKET: import('@cloudflare/workers-types').R2Bucket;
}

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>;

declare namespace App {
    interface Locals extends Runtime { }
}
