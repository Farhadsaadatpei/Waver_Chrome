/**
 * SCSS Compile
*/

import './scss/app.scss'

/**
 * JS Compile 
*/
import 'bootstrap'
import Vue from 'vue'
import App from './js/app.vue'
import router from './js/router'

/**
 * Init Vue
 */
var app = new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })

