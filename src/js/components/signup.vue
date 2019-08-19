<template>
    <div class="container py-3">
        <form @submit.prevent="signup">
        <div class="row">
            <div class="col-6">
                <div class="form-group">
                    <input id="firstName" type="text" class="form-control" v-model="firstName"  placeholder="First Name" v-validate="'required'" name="First Name">
                    <small class="form-text text-muted"><span>{{ errors.first('First Name') }}</span></small>
                </div>
            </div>
            <div class="col-6">

                <div class="form-group">
                    <input id="lastName" type="text" class="form-control" v-model="lastName" v-validate="'required'" name="Last Name"  placeholder="Last Name">
                    <small class="form-text text-muted"><span>{{ errors.first('Last Name') }}</span></small>
                </div>
            </div>
        </div>
        <div class="form-group">
            <input id="emailAddress" type="email" class="form-control" v-model="email" aria-describedby="emailHelp" placeholder="Enter email" v-validate="'required|email'" name="Email Address">
            <small id="emailHelp" class="form-text text-muted"><span>{{ errors.first('Email Address') }}</span></small>
        </div>
        <div class="form-group">
            <input id="password" type="password" class="form-control" v-model="password" placeholder="Password"  v-validate="'required|min:8|number|upCase'" name="password" ref="password">
            <small class="form-text text-muted"><span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span></small>
        </div>
        <div class="form-group">
            <input id="passwordVerification" type="password" class="form-control" v-model="passwordverification" placeholder="Confirm Password" v-validate="'required|confirmed:password'" name="password_confirmation" data-vv-as="password">
            <small class="form-text text-muted"><span v-show="errors.has('password_confirmation')" class="help is-danger">{{ errors.first('password_confirmation') }}</span></small>
        </div>
        
        <button type="submit" class="btn btn-primary">Sign Up!</button>
        </form>
        <small id="success-respond" class="text-success"></small>
    </div>
</template>


<script>

// Vue and Third-parties
import Vue from 'vue';
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

// Custom Password Strentgh
VeeValidate.Validator.extend('upCase', {
    getMessage: () => "Require 1 uppercase character",
    validate: value => value.match(/[A-Z]/g) !== null
})

VeeValidate.Validator.extend('number', {
    getMessage: () => "Require 1 number.",
    validate: value => value.match(/[0-9]/g) !== null
})

// AWS Services
import AWS from 'aws-sdk'
import '../aws_auth'
import * as AmazonCognitoIdentity from  'amazon-cognito-identity-js';

export default {
    data: function(){
        return {
            email: null,
            firstName: null, 
            lastName: null,
            password: null, 
            passwordverification: null,
        }
    }, 
    methods: {
        signup(){
            // Make Sure Password Match
            if(this.password != this.password){
                alert(`Password Doesn't Match`)
                throw("Password Doesn't Match")
            } else {
                // Pool Data
                var PoolData = {
                    UserPoolId: 'us-east-1_na4CCQL42',
                    ClientId: '5gi24c3d8cat153g9msbtr22mb'
                }

                // User Pool
                var UserPool = new AmazonCognitoIdentity.CognitoUserPool(PoolData);
                
                var attributeList = []

                // Data to Pass
                var dataEmail = { Name: 'email', Value: this.email } // Email
                var dataFirstName = { Name: 'given_name', Value: this.firstName } // First Name
                var dataLastName = { Name: 'family_name', Value: this.lastName } // Last Name

                // Create Cognito User Attribute
                var aEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
                var aFirstName = new AmazonCognitoIdentity.CognitoUserAttribute(dataFirstName)
                var aLastName = new AmazonCognitoIdentity.CognitoUserAttribute(dataLastName)

                attributeList.push(aEmail)
                attributeList.push(aFirstName)
                attributeList.push(aLastName)


                this.$validator.validate().then(valid => {
                    if(valid) {
                        UserPool.signUp(this.email, this.password, attributeList, null, function(err, response) {
                            if(err){ alert(err.message); } 

                            if(response){

                                // Clear the Fields
                                document.getElementById("firstName").value = "";
                                document.getElementById("lastName").value = "";
                                document.getElementById("emailAddress").value = "";
                                document.getElementById("password").value = "";
                                document.getElementById("passwordVerification").value = "";

                                // Ask User to Verify their email.
                                alert('Check your Email. verify your account by clicking on the link send to your email.');
                                
                                
                            }
                        })
                    }
                });
            }
        }
    }
}
</script>