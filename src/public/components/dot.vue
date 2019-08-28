<template>
    <a href="#" id="waver-dot"></a>
</template>

<script>
import AWS from 'aws-sdk'
import '../js/aws_auth'
import * as AmazonCognitoIdentity from  'amazon-cognito-identity-js';

// Create Pool Object 
var PoolData = { 
    UserPoolId: 'us-east-1_na4CCQL42',
    ClientId: '5gi24c3d8cat153g9msbtr22mb'
};

var UserPool = new AmazonCognitoIdentity.CognitoUserPool(PoolData);
var cognitoUser = UserPool.getCurrentUser();


export default {
    name: 'dot',
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
                    console.log(session);
                });
            }
        }
    }
}
</script>