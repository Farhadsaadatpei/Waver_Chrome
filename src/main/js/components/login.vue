<template>
    <div class="container py-3">
        <form @submit.prevent="login" autocomplete="on">
        <div class="form-group my-1">
            <input type="email" class="form-control" name="email" v-model="email" placeholder="Email Address" required>
        </div>
        <div class="form-group my-1">
            <input type="password" class="form-control" name="password" v-model="password" placeholder="Password" required>
        </div>
        <button type="submit" class="btn btn-primary mt-2 blue-navy-button">Login</button>
        </form>
        <div class="col-12 mt-3">
            <small>
                <a href="#" v-on:click="forgot" class="text-secondary"><i class="fas fa-unlock-alt"></i> Forgot your password?</a>
            </small>    
        </div>
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
        forgot: function(){
            self = this
            self.$router.push({ name: 'forgot' })
        },
        login: function(){
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

            if(this.email != null && this.password != null ) {
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(UserData);

                // Authenticate The User
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: function (result) {
                        self.$router.push({ name: 'Account' })
                    },

                    onFailure: function(err) {
                        alert(err.message);
                    },

                });
            }
        }
    }
}
</script>