<script setup lang="ts">
import type { Transaction } from '@/types/Transaction'

const props = defineProps<{
  transactions: Transaction[]
}>()
</script>
<template>
  <table class="transactions__table">
    <thead>
      <tr>
        <th>Operation ID</th>
        <th>Date</th>
        <th>Operation Type</th>
        <th>Operation Status</th>
        <th>Sum</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in props.transactions" :key="transaction.id" data-testid="transaction-row">
        <td>{{ transaction.id }}</td>
        <td>{{ transaction.createdAt }}</td>
        <td>{{ transaction.transactionStatus }}</td>
        <td>{{ transaction.transactionType }}</td>
        <td
          :class="{
            pending: transaction.transactionStatus === 'pending',
            positive:
              transaction.transactionType === 'deposit' &&
              transaction.transactionStatus === 'completed',
            negative: transaction.transactionType === 'withdrawal',
          }"
        >
          {{ transaction.amount }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="css" scoped>
.transactions__table {
  width: 100%;
  border-collapse: collapse;
}

.transactions__table th,
.transactions__table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.transactions__table th {
  background-color: #f4f6ef;
}

.pending {
  color: orange;
  font-weight: bold;
}

.positive {
  color: green;
  font-weight: bold;
}

.negative {
  color: red;
  font-weight: bold;
}
</style>
