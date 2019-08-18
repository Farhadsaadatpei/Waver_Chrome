<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Waverit</a>
        <a class="nav-item nav-link" href="#" v-on:click='logOut'>Logout</a>
    </nav>
</template>

<script>

// AWS 
import AWS from 'aws-sdk'
import '../aws_auth'
import * as AmazonCognitoIdentity from  'amazon-cognito-identity-js';

// Create Pool Object 
var PoolData = { 
    UserPoolId: 'us-east-1_na4CCQL42',
    ClientId: '5gi24c3d8cat153g9msbtr22mb'
};

var UserPool = new AmazonCognitoIdentity.CognitoUserPool(PoolData);
var cognitoUser = UserPool.getCurrentUser();

export default {
    name: 'Account',
    methods: {
        logOut: function(){
            self = this
            if(cognitoUser != null){
                cognitoUser.signOut();
                self.$router.push({ name: 'Welcome' })
            }
        }
    }
}
</script>