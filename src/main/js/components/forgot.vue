<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-navy">
            <div>
                <small class="d-inline">
                   <a class="text-white" href="#" v-on:click="Welcome"><i class="fas fa-angle-left"></i> Login</a>
                </small>
            </div>
        </nav>
        <div class="container py-3">
            <h5 class="mb-0">Forgot your password?</h5>
            <small class="text-secondary">Reset verification code will be sent to your email.</small>
            <form @submit.prevent="reset" autocomplete="on">
            <div class="form-group my-1">
                <input type="email" class="form-control" name="email" v-model="resetEmail" placeholder="Enter email" required>
            </div>
            <button type="submit" class="btn btn-primary blue-navy-button mt-2">Reset Password</button>
            </form>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

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

export default {
    name: 'Forgot',
    data: function(){
        return{
            resetEmail: null
        }
    },
    methods: {
        Welcome: function(){
            self = this
            self.$router.push({ name: 'Welcome' })
        },
        reset: function(){
            self = this
            
            if(self.resetEmail != null){
                var userData = {
                    Username: self.resetEmail,
                    Pool: UserPool
                };
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.forgotPassword({
                    onSuccess: function (result) {
                        console.log('call result: ' + result);
                    },
                    onFailure: function(err) {
                        alert(err.message);
                    },
                    inputVerificationCode() {
                        var verificationCode = prompt('Please input verification code ' ,'');
                        var newPassword = prompt('Enter new password ' ,'');
                        cognitoUser.confirmPassword(verificationCode, newPassword, this);
                    }
                });
            }
        }
    }
}
</script>