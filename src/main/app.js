/**
 * SCSS Compile
*/

import './scss/app.scss'

/**
 * JS Compile 
*/
import 'bootstrap'
import BootstrapVue from 'bootstrap-vue'
import Vue from 'vue'
import App from './js/app.vue'
import router from './js/router'

Vue.use(BootstrapVue)           // User Bootstrap 4.0

/**
 * Init Vue
 */
var app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })