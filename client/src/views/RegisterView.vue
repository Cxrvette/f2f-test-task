<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import apiClient from '@/api/api'
import { showSnackbar } from '@/stores/snackbar'
import router from '@/router'

const firstName = ref('')
const surname = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const handleRegister = async () => {
  error.value = ''

  if (!email.value || !firstName.value || !surname.value || !password.value) {
    error.value = 'All fields are required'
    return
  }

  try {
    await apiClient.post('/auth/register', {
      name: firstName.value,
      surname: surname.value,
      email: email.value,
      password: password.value,
      role: 'user',
    })
    showSnackbar('Registration successful! Please log in.', 'success')
    router.push('/login')
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? 'Registration failed'
  }
}
</script>

<template>
  <div class="register-container">
    <h2>Register to F2F Bank</h2>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label>Name</label>
        <AppInput
          data-testid="register-name"
          type="text"
          v-model="firstName"
          required
          name="name"
          placeholder="Type your name"
        />
      </div>

      <div class="form-group">
        <label>Surname</label>
        <AppInput
          data-testid="register-surname"
          type="text"
          v-model="surname"
          required
          name="surname"
          placeholder="Type your surname"
        />
      </div>

      <div class="form-group">
        <label>Email</label>
        <AppInput
          data-testid="register-email"
          type="email"
          v-model="email"
          required
          name="login"
          placeholder="Type your email"
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <AppInput data-testid="register-password" type="password" v-model="password" required name="Type your password" />
      </div>

      <p v-if="error" class="error" data-testid="register-error">{{ error }}</p>

      <AppButton data-testid="register-submit" type="submit"> Register </AppButton>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  width: 420px;
  margin: 100px auto;
  background: rgba(200, 210, 180, 0.3);
  padding: 3rem;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
  margin-bottom: 10px;
}
</style>
