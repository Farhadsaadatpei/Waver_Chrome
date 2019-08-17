<template>
  <div id="app">
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="nav-login-tab" data-toggle="tab" href="#nav-login" role="tab" aria-controls="nav-login" aria-selected="true">login</a>
        <a class="nav-item nav-link" id="nav-signup-tab" data-toggle="tab" href="#nav-signup" role="tab" aria-controls="nav-signup" aria-selected="false">signup</a>
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
import Login from './components/login.vue'
import Signup from  './components/signup.vue'
export default {
  components: {
    Login,
    Signup
  }
}
</script>


