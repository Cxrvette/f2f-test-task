<script setup lang="ts">
import { ref } from 'vue'
import AppInput from './AppInput.vue'

const props = defineProps<{
  onClose: () => void
  isModalOpen: boolean
}>()

const amount = ref<number | null>(null)

const emit = defineEmits<{
  (e: 'add-balance', value: number): void
}>()

const closeModal = () => {
  amount.value = null
  props.onClose()
}

const submit = () => {
  if (amount.value && amount.value > 0) {
    emit('add-balance', amount.value)
    closeModal()
  }
}
</script>

<template>
  <div v-if="props.isModalOpen" class="modal-overlay">
    <div class="modal">
      <h3 data-testid="balance-modal-title">Add balance</h3>
      <AppInput data-testid="balance-amount" v-model.number="amount" type="number" placeholder="Enter sum" name="balance" />
      <div class="modal-actions">
        <button data-testid="balance-submit" class="confirm-btn" @click="submit" type="submit">Add</button>
        <button class="cancel-btn" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 16px;
  width: 300px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.modal h3 {
  margin-top: 0;
}

.modal input {
  width: 100%;
  padding: 8px;
  margin: 15px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.confirm-btn {
  background-color: #5a6b3c;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #ccc;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
