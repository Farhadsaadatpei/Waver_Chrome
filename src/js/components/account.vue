<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#"></a>
            <small><a class="text-secondary" href="#">Add</a></small>
        </nav>
        <div class="container-fluid p-0">
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action rounded-0">
                    <div class="d-block w-100 ">
                        <small>{{currentTitle}}</small> <img v-if="currentFavicon != null" width="16" height="16" v-bind:src="currentFavicon" />
                    </div>
                </a>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-6"></div>
                <div class="col-6 text-right">
                    <small>Hi, {{userAttributes.given_name}}. <a class="d-inline text-secondary" href="#" v-on:click='logOut'>Logout</a></small>
                </div>
            </div>
        </div>
    </div>
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
    data: function(){
        return {
            userAttributes: {},
            currentURL: null,
            currentTitle: null,
            currentFavicon: null,
        }
    },
    mounted: function () {
        // Create a Table in DynamoDB for first time users. 
        this.getUserInfo();

        // Get Current Browser Data
        this.getCurrentTabData();
    },
    methods: {
        getCurrentTabData: function(){
            self = this
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                self.currentURL = tabs[0].url;
                self.currentTitle = tabs[0].title;
                self.currentFavicon = tabs[0].favIconUrl
            });
        },
        getUserInfo: function(){
            self = this
            if (cognitoUser != null) {
                cognitoUser.getSession(function (err, session) {
                    // Get User Attributes 
                    cognitoUser.getUserAttributes(function(err, response) {
                        if (err) {
                            alert(err.message);
                            return;
                        }

                        console.log(response);
                        // Store User Data in Attribute
                        for (let i = 0; i < response.length; i++) {
                            self.$set(self.userAttributes, response[i].getName(), response[i].getValue())
                        }
                    });

                });
            }
        },
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