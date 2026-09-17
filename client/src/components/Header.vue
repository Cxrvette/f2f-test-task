<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import AppButton from './AppButton.vue'
import LogoutIcon from './icons/LogoutIcon.vue'
import router from '@/router'
import { clearCookie } from '@/utils/cookie'

const userStore = useUserStore()

const logout = async () => {
  userStore.profile = null
  await clearCookie('access_token')
  router.push('/login')
}
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="header__title-container">
      <img alt="App logo" class="header__logo" src="@/assets/logo.svg" width="60" height="60" />
      <h1 class="header__title">F2F Bank</h1>
    </RouterLink>
    <nav class="header__navigation" v-if="userStore.isExist">
      <h2 class="header__link" data-testid="header-balance">Balance: {{ userStore.balance.amount }}</h2>
      <RouterLink class="header__link" to="/">Main</RouterLink>
      <RouterLink class="header__link" to="/profile">Profile</RouterLink>
      <RouterLink class="header__link" to="/transactions" data-testid="transactions-link">Transactions</RouterLink>
      <div class="header__link">
        <AppButton type="button" @click="logout">
          <LogoutIcon />
        </AppButton>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  background-color: rgba(163, 177, 138);
  border-radius: 8px;
}

.header__title-container {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

.header__link {
  font-size: 1.5rem;
  font-weight: 600;
  display: inline-block;
  padding: 0.5rem 1rem;
}
</style>
