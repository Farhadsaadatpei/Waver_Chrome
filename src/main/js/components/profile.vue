<template>
    <div v-if="userAttributes">
        <nav class="navbar navbar-expand-lg navbar-light bg-navy">
            <div>
                <a href="#" class="pr-2 text-white" v-on:click="account"><i class="fas fa-angle-left"></i></a>
                <small class="d-inline">
                    Edit your account, {{userAttributes.given_name}}. 
                </small>
            </div>
            <div>
                
            </div>
        </nav>

        <div id="accordion">
            <div class="card">
                <div class="card-header p-1 py-2" id="headingOne">
                <h5 class="mb-0 profile-heading">
                    <button class="btn btn-link text-secondary collapsed" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    <i class="fas fa-user-circle mr-1"></i> Personal Detail
                    </button>
                </h5>
                </div>
                <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
                <div class="card-body">
                    <p>Change your personal detail.</p>
                    <form @submit.prevent="updatepersonal" autocomplete="on">
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <input id="firstName" type="text" class="form-control" v-model="userAttributes.given_name"  placeholder="First Name" v-validate="'required'" name="first name">
                                    <small class="form-text text-danger"><span>{{ errors.first('first name') }}</span></small>
                                </div>
                            </div>
                            <div class="col-6">

                                <div class="form-group">
                                    <input id="lastName" type="text" class="form-control" v-model="userAttributes.family_name" v-validate="'required'" name="last name"  placeholder="Last Name">
                                    <small class="form-text text-danger"><span>{{ errors.first('last name') }}</span></small>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <input id="emailAddress" type="email" class="form-control" v-model="userAttributes.email" aria-describedby="emailHelp" placeholder="Enter email" v-validate="'required|email'" name="email address">
                            <small id="emailHelp" class="form-text text-danger"><span>{{ errors.first('email address') }}</span></small>
                            <small>New verification code will be sent to your email. Require to be verified immediately.</small>
                        </div>
                        <button type="submit" class="btn btn-primary blue-navy-button">Update</button>
                    </form>
                </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header  p-1 py-2" id="headingTwo">
                <h5 class="mb-0 profile-heading">
                    <button class="btn btn-link text-secondary collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    <i class="fas fa-lock mr-1"></i> Password
                    </button>
                </h5>
                </div>
                <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                <div class="card-body">
                    <p>Change your password.</p>
                    <form @submit.prevent="changePassword">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <input id="old_password" type="password" class="form-control" v-model="password.old" placeholder="Old Password" v-validate="'required'"  name="old password">
                                    <small class="form-text text-danger"><span v-show="errors.has('old password')" class="help is-danger">{{ errors.first('old password') }}</span></small>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <input id="password" type="password" class="form-control" v-model="password.new" placeholder="New Password"  v-validate="'required|min:8|number|upCase'" name="password" ref="password">
                                    <small class="form-text text-danger"><span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span></small>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <input id="passwordVerification" type="password" class="form-control" v-model="password.verify" placeholder="Confirm New Password" v-validate="'required|confirmed:password'" name="password_confirmation" data-vv-as="password">
                                    <small class="form-text text-danger"><span v-show="errors.has('password_confirmation')" class="help is-danger">{{ errors.first('password_confirmation') }}</span></small>
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary blue-navy-button">Change Password</button>
                            </div>
                        </div>
                    </form>
                </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header  p-1 py-2" id="headingThree">
                <h5 class="mb-0 profile-heading">
                    <button class="btn btn-link text-secondary collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    <i class="fas fa-user-slash"></i> Delete Account
                    </button>
                </h5>
                </div>
                <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                <div class="card-body">
                    <p>Remove your Account.</p>
                    <form @submit.prevent="deleteAccount">
                        <div class="row">
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary red-button"><i class="fas fa-trash-alt"></i> Delete</button>
                            </div>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

// Font Awesome
import '@fortawesome/fontawesome-free/js/all.js'

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

// AWS 
import AWS from 'aws-sdk'
import '../aws_auth'
import * as AmazonCognitoIdentity from  'amazon-cognito-identity-js';

var cognitoUser;

export default {
    name: 'Profile',
    data: function(){
        return {
            userAttributes: {},
            password: {
                old: null,
                new: null,
                verify: null
            },
        }
    },
    created: async function(){

        // Create User Pool to Authenticate
        await this.createUserPool();

        // Init User DATA. 
        this.userInit()
    },
    methods: {
        createUserPool: function(){
            // Create Pool Object 
            var PoolData = { 
                UserPoolId: 'us-east-1_na4CCQL42',
                ClientId: '5gi24c3d8cat153g9msbtr22mb'
            };

            var UserPool = new AmazonCognitoIdentity.CognitoUserPool(PoolData);
            cognitoUser = UserPool.getCurrentUser();
        },
        account: function(){
            self = this
            if(cognitoUser != null){
                self.$router.push({ name: 'Account' })
            }
        },
        updatepersonal: function(){
            self = this
            var attributeList = [];

            var FirstNameAttribute = { Name : 'given_name', Value : self.userAttributes.given_name};
            var LastNameAttribute = { Name : 'family_name', Value : self.userAttributes.family_name};
            var EmailAttribute = { Name : 'email', Value : self.userAttributes.email};

            var attribute = new AmazonCognitoIdentity.CognitoUserAttribute(attribute);

            attributeList.push(FirstNameAttribute);
            attributeList.push(LastNameAttribute);
            attributeList.push(EmailAttribute);

            cognitoUser.updateAttributes(attributeList, function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        },
        changePassword: function(){
            self = this
            if(self.password.old != null && self.password.new != null && self.password.verify != null){
                cognitoUser.changePassword(self.password.old, self.password.verify, function(err, result) {
                    if (err) {
                        alert(err.message);
                        return;
                    }

                    if(result == "SUCCESS") {
                        alert('Password Successfully Changed.')
                    }
                });
            }else {
                alert('Enter your passwords.')
            }
        },
        deleteAccount: function(){
            var deleteAccount = confirm("This is a permanent action. You won't be able to retrieve your data anymore. Are you sure?");
            if(deleteAccount == true){

                // Delete Account from Cognito
                cognitoUser.deleteUser(function(err, result) {
                    if (err) { alert(err); return; }
                    if(result){
                        // Route the User to Welcome Page
                        self.$router.push({ name: 'Welcome' })
                    }
                });
            }
        },
        userInit: function(){
            self = this
            if (cognitoUser != null) {
                cognitoUser.getSession( function (err, session) {
                    // Get User Attributes 
                    cognitoUser.getUserAttributes(async function(err, response) {
                        if (err) {
                            alert(err.message);
                            return;
                        }

                        // Store User Data in Attribute
                        for (let i = 0; i < response.length; i++) {
                            self.$set(self.userAttributes, response[i].getName(), response[i].getValue())
                        }
                    });
                });
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .profile-heading{
        button {
            font-size: 13px;
            text-decoration: none;
        }
    }

    .card {
        border-radius: 0;

        .card-header{
            border-radius: 0;
            border: 0px;
            border-bottom: 1px solid #ccc;
        }
    }
</style>