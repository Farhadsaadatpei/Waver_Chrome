<template>
    <div class="container py-3">
        <form @submit.prevent="login">
        <div class="form-group">
            <input type="email" class="form-control" v-model="email" placeholder="Enter email">
        </div>
        <div class="form-group">
            <input type="password" class="form-control" v-model="password" placeholder="Password">
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
        </form>
    </div>
</template>

<script>
import AWS from 'aws-sdk'
import '../../js/aws_auth'
import * as AmazonCognitoIdentity from  'amazon-cognito-identity-js';

export default {
    name: 'Login',
    data: function(){
        return{
            email: null,
            password: null,
        }
    }, 
    methods: {
        login(){
            var self = this
            // Authentication Data
            var authenticationData = {
                Username : this.email,
                Password : this.password,
            };

            // Authentication Object 
            var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
            
            // Create Pool Object 
            var PoolData = { 
                UserPoolId: 'us-east-1_na4CCQL42',
                ClientId: '5gi24c3d8cat153g9msbtr22mb'
            };

            var UserPool = new AmazonCognitoIdentity.CognitoUserPool(PoolData);

            // Create User Object
            var UserData = {
                Username : this.email,
                Pool : UserPool
            };
            var cognitoUser = new AmazonCognitoIdentity.CognitoUser(UserData);

            // Authenticate The User
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    self.$router.push({ name: 'Account' })
                },

                onFailure: function(err) {
                    console.log(err);
                },

            });
        }
    }
}
</script>