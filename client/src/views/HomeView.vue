<script setup lang="ts">
import { ref } from 'vue'
import AppInput from '@/components/AppInput.vue'
import { useUserStore } from '@/stores/userStore'
import { showSnackbar } from '@/stores/snackbar'

const userStore = useUserStore()

const phone = ref('')
const amount = ref<number | null>(null)
const purpose = ref('')
const isLoading = ref(false)
const success = ref(false)
const phoneError = ref('')

const validatePhone = (): boolean => {
  const raw = phone.value.trim()
  const digits = raw.replace(/\D/g, '')
  if (!raw) {
    phoneError.value = 'Phone number is required'
  } else if (!raw.startsWith('+')) {
    phoneError.value = 'Must start with + and country code. Example: +7 999 123-45-67'
  } else if (digits.length < 10 || digits.length > 15) {
    phoneError.value = 'Phone must contain 10–15 digits'
  } else {
    phoneError.value = ''
  }
  return !phoneError.value
}

const reset = () => {
  phone.value = ''
  amount.value = null
  purpose.value = ''
  success.value = false
  phoneError.value = ''
}

const handleSubmit = async () => {
  if (!validatePhone()) return
  if (!amount.value || !purpose.value) {
    showSnackbar('Please fill in all fields')
    return
  }
  if (amount.value <= 0) {
    showSnackbar('Amount must be greater than zero')
    return
  }
  isLoading.value = true
  try {
    await userStore.transfer(phone.value, amount.value, purpose.value)
    success.value = true
    showSnackbar('Transfer completed successfully', 'success')
  } catch {
    showSnackbar('Transfer failed. Check your balance.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <div class="sbp-logo">SBP</div>
        <div class="card-title" data-testid="transfer-title">Transfer by phone number</div>
        <div class="balance-hint">Balance: {{ userStore.balance.amount }}</div>
      </div>

      <div v-if="success" class="success-block">
        <div class="success-icon">✓</div>
        <div class="success-text" data-testid="transfer-success">Transfer completed</div>
        <button class="btn-outline" @click="reset">New transfer</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label>Phone number</label>
          <AppInput
            data-testid="transfer-phone"
            v-model="phone"
            name="phone"
            type="text"
            placeholder="+7 999 123-45-67"
            @blur="validatePhone"
          />
          <span v-if="phoneError" class="field-error" data-testid="phone-error">{{ phoneError }}</span>
        </div>

        <div class="form-group">
          <label>Amount</label>
          <AppInput
            data-testid="transfer-amount"
            v-model="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            required
          />
        </div>

        <div class="form-group">
          <label>Payment purpose</label>
          <AppInput
            data-testid="transfer-purpose"
            v-model="purpose"
            name="purpose"
            type="text"
            placeholder="e.g. debt repayment"
            required
          />
        </div>

        <div class="actions">
          <button data-testid="transfer-submit" type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Sending...' : 'Send' }}
          </button>
          <button type="button" class="btn-outline" @click="reset">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 16px;
  min-height: calc(100vh - 80px);
}

.card {
  width: 100%;
  max-width: 480px;
  background: rgba(200, 210, 180, 0.3);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(80, 110, 70, 0.12);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.sbp-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(120, 140, 80, 0.9), rgba(150, 170, 110, 0.9));
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #3b5d35;
  margin-bottom: 0.25rem;
}

.balance-hint {
  font-size: 13px;
  color: rgba(58, 107, 53, 0.65);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #4a6a40;
  margin-bottom: 6px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 1.75rem;
}

.btn-primary {
  flex: 1;
  padding: 12px 22px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(120, 140, 80, 0.9), rgba(150, 170, 110, 0.9));
  color: #f4f4f4;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(100, 120, 80, 0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(100, 120, 80, 0.35);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  flex: 1;
  padding: 12px 22px;
  border: 1.5px solid rgba(120, 140, 80, 0.7);
  border-radius: 12px;
  background: transparent;
  color: #4a7a45;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(120, 140, 80, 0.1);
  border-color: rgba(120, 140, 80, 0.9);
}

.success-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(120, 140, 80, 0.9), rgba(150, 170, 110, 0.9));
  color: #fff;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-text {
  font-size: 18px;
  font-weight: 600;
  color: #3b5d35;
}

.field-error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #d32f2f;
}

@media (prefers-color-scheme: dark) {
  .card {
    background: rgba(255, 255, 255, 0.06);
  }

  .card-title {
    color: #c8e0b8;
  }

  .balance-hint {
    color: rgba(180, 215, 155, 0.7);
  }

  .form-group label {
    color: #a8c890;
  }

  .success-text {
    color: #c8e0b8;
  }

  .btn-outline {
    color: #a8c890;
    border-color: rgba(160, 190, 120, 0.6);
  }

  .btn-outline:hover {
    background: rgba(160, 190, 120, 0.12);
    border-color: rgba(160, 190, 120, 0.9);
  }
}
</style>
