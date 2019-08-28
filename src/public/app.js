/**
 * Compile CSS
 */

import './scss/app.scss'

/**
 * JS Compile 
*/
import 'bootstrap'
import 'popper.js'
import Vue from 'vue'
import App from './js/app.vue'

/**
* Create a Waver Dot App DIV and Init Vue
*/

//et body = document.body;

var body = document.querySelector('body')
body.innerHTML += body.innerHTML = '<div id="waver-dot"></div>'

var app = new Vue({
    el: '#waver-dot',
    render: h => h(App)
  })
