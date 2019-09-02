<template>
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-navy p-0">
        <a class="navbar-brand p-0 pl-4" href="#">
          <img class=" py-3" width="28" :src="'images/Waver-logo-white.png'" href="https://waverit.com" target="_blank">
        </a>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <a class="nav-item nav-link py-3 active" id="nav-login-tab" data-toggle="tab" href="#nav-login" role="tab" aria-controls="nav-login" aria-selected="true">Login</a>
          <a class="nav-item nav-link py-3" id="nav-signup-tab" data-toggle="tab" href="#nav-signup" role="tab" aria-controls="nav-signup" aria-selected="false">Signup</a>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-login" role="tabpanel" aria-labelledby="nav-login-tab">
          <login></login>
        </div>
        <div class="tab-pane fade" id="nav-signup" role="tabpanel" aria-labelledby="nav-signup-tab">
          <signup></signup>
        </div>
      </div>
    </div>
</template>

<script>
// Components
import Signup from  './signup.vue'
import Login from './login.vue'

export default {
    name: 'Welcome',
    components: {
        Signup,
        Login,
    },
}
</script>

<style lang="scss" scoped>
  .nav-tabs, .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus, .nav-tabs .nav-link {
    border: 0;
    border-radius: 0;
  }
  
</style>