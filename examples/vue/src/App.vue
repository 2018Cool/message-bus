<script setup>
import { ref, computed } from 'vue'
import App from "./views/AppView.vue"
import IframeView from './views/IframeView.vue'
const routes = {
  '/': App,
  '/iframe': IframeView
}
const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] ?? App
})
</script>

<template>
  <component :is="currentView" />
</template>
