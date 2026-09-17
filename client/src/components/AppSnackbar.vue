<script lang="ts" setup>
import { snackbarMessage, snackbarVisible, snackbarType } from '../stores/snackbar'
import { computed } from 'vue'

const message = computed(() => snackbarMessage.value)
const visible = computed(() => snackbarVisible.value)
const type = computed(() => snackbarType.value)
</script>

<template>
  <div v-if="visible" class="snackbar" :class="type" data-testid="snackbar">
    {{ message }}
  </div>
</template>

<style>
.snackbar {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  transition: opacity 0.3s ease;
}

.snackbar.error {
  background-color: #f44336;
}

.snackbar.success {
  background-color: #4a7a45;
}
</style>
