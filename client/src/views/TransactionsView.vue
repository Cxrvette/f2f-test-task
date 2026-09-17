<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import TransactionsTable from '@/components/TransactionsTable.vue'
import type { Transaction } from '@/types/Transaction'
import AddBalanceModal from '@/components/AddBalanceModal.vue'
import apiClient from '@/api/api'
import { showSnackbar } from '@/stores/snackbar'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const transactions = ref<Transaction[]>([])

const loadTransactions = async () => {
  try {
    const response = await apiClient.get('/users/transactions')
    transactions.value = response.data.map(
      (item: {
        id: string
        amount: number
        created_at: string
        transaction_type: string
        transaction_status: string
        updated_at: string
      }) => ({
        id: item.id,
        amount: item.amount,
        createdAt: new Date(item.created_at).toLocaleString(),
        transactionType: item.transaction_type,
        transactionStatus: item.transaction_status,
        updatedAt: new Date(item.updated_at).toLocaleString(),
      }),
    )
  } catch (err) {
    showSnackbar('Failed to load transactions')
    console.error(err)
  }
}

const addBalance = async (amount: number) => {
  const response = await apiClient.post('users/balance/add', {
    amount,
  })
  if (response.data) {
    await Promise.all([loadTransactions(), userStore.loadBalance()])
  }
}

onMounted(() => {
  loadTransactions()
})

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const onCloseModal = () => {
  isModalOpen.value = false
}
</script>
<template>
  <div class="transactions">
    <div class="transactions__card">
      <div class="header">
        <h2 data-testid="transactions-title">Transactions</h2>
        <div>
          <AppButton data-testid="open-balance-modal" @click="openModal">Add balance</AppButton>
        </div>
      </div>
      <TransactionsTable :transactions="transactions" />
      <p v-if="!transactions.length" class="empty">No transactions yet</p>
    </div>
    <AddBalanceModal
      :isModalOpen="isModalOpen"
      :onClose="onCloseModal"
      v-on:addBalance="addBalance"
    />
  </div>
</template>

<style scoped>
.transactions {
  min-height: 78vh;
  padding: 40px;
  background: rgba(200, 210, 180, 0.3);
  font-family: Arial, sans-serif;
}

.transactions__card {
  background: #ffffff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  margin-top: 20px;
  color: #777;
}
</style>
