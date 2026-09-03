<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MENU } from './router'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const activeKey = computed(() => String(route.name ?? ''))
const go = (key: string) => router.push(`/${key}`)
</script>

<template>
  <UiShell v-model:collapsed="collapsed" title="示例系统" :menu="MENU" :active-key="activeKey" @select="go">
    <RouterView />
  </UiShell>
</template>
