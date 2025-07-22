// src/types/vite-plugin-crx.d.ts
declare module 'vite-plugin-crx' {
    import { Plugin } from 'vite';
    const plugin: (options: { manifest: unknown }) => Plugin;
    export default plugin;
  }
  