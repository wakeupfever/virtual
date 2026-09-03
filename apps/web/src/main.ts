/* 入口引入顺序固定（CLAUDE.md §4）：element-plus → tokens → skins → layout → base → tailwind */
import 'element-plus/dist/index.css'
import '@virtual/design-system/tokens.css'
import '@virtual/design-system/skins/index.css'
import '@virtual/design-system/layout.css'
import '@virtual/design-system/base.css'
import './tailwind.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import DesignSystemUI from '@virtual/design-system'
import App from './App.vue'
import { router } from './router'

createApp(App).use(ElementPlus, { locale: zhCn }).use(DesignSystemUI).use(router).mount('#app')
