<template>
  <div id="app">
      <account></account>
      <login></login>
      <signup></signup>
  </div>
</template>

<script>
import Login from './components/login.vue'
import Signup from './components/signup.vue'
import Account from './components/account.vue'
export default {
  components: {
    Login, 
    Signup,
    Account
  }
}
</script>


