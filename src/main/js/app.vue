<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// AWS 
import AWS from 'aws-sdk'
import './aws_auth'
import * as AmazonCognitoIdentity from  'amazon-cognito-identity-js';

// Create Pool Object 
var PoolData = { 
    UserPoolId: 'us-east-1_na4CCQL42',
    ClientId: '5gi24c3d8cat153g9msbtr22mb'
};

var UserPool = new AmazonCognitoIdentity.CognitoUserPool(PoolData);
var cognitoUser = UserPool.getCurrentUser();


export default {
  name: 'app',
  mounted: function () {
    this.getSessionStatus()
  },
  methods: {
    getSessionStatus: function(){
      var self = this
      if (cognitoUser != null) {
        // Check If user still loggedIn
        cognitoUser.getSession(function(err, session) {
            if (err) { console.log(err); return; }
            // User session still valid. Route User to Account
            self.$router.push({ name: 'Account' })
        });
      }
    }
  }

}
</script>


