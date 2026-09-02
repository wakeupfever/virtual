/**
 * 第二层库模式打包：输出 dist/ui.iife.js 供原型 HTML 直接引用。
 * vue 与 element-plus 设为 external，运行时使用 CDN 全局 Vue / ElementPlus，
 * 保证原型与正式项目共用同一份组件源码（R-029）。
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: 'ui/index.ts',
      name: 'DesignSystemUI',
      formats: ['iife'],
      fileName: () => 'ui.iife.js',
      cssFileName: 'ui',
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        exports: 'named',
        globals: { vue: 'Vue', 'element-plus': 'ElementPlus' },
      },
    },
  },
})
