/**
 * SCSS Compile
*/

import './scss/app.scss'

/**
 * JS Compile 
*/
import Vue from 'vue';
import 'bootstrap'
import 'aws-sdk/clients/dynamodb'
import './js/aws_auth'

/**
 * Vue Components
 */

/**
 * Init Vue
 */
var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    }
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