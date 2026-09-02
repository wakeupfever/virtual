// 根级 dev server：只用于本地预览静态页面（展示页、原型），不参与构建。
// 正式项目 apps/web 有自己的 vite.config.ts。
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: { port: 5173, open: false },
  appType: 'mpa',
})
