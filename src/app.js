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

/**
 * Init Vue
 */
var app = new Vue({
    el: '#app',
    render: h => h(App)
  })














// var docClient = new AWS.DynamoDB.DocumentClient();
// var params = {
//     TableName: "waver"
// };
// docClient.scan(params).eachPage((err, data, done) => {
//     if (data != null) {
//         console.log(data);
//     }
//     done();
// });