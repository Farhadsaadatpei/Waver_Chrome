<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div>
                <a class="navbar-brand d-inline" href="#"><img class="rounded-circle" width="34" :src="profileImage ? profileImage : 'images/blank_profile.png'"></a>
                <small class="d-inline">
                    Hi, {{userAttributes.given_name}}. 
                    <a class="text-secondary" href="#"> My Account</a>
                </small>
            </div>
            <div>
                <div href="#" id="waver-dot"></div>
                <b-tooltip :show.sync="show" placement="left" target="waver-dot" custom-class="block-tooltip">Block: {{activeURL}}</b-tooltip>
            </div>
        </nav>
        <div class="container-fluid p-0">
            <div class="h-25 px-2 text-secondary">
                <small>Blocked Items</small>
            </div>
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action rounded-0">
                    
                </a>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row d-flex">
                <div class="col-6">
                    <small><a class="d-inline text-secondary" href="#" v-on:click='logOut'>Logout</a></small>
                </div>
                <div class="col-6 text-right">
                    
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

// DyanmoDB Doc Client
var docClient = new AWS.DynamoDB.DocumentClient();
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});

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
            profileImage: null,
            currentURL: null,
            currentTitle: null,
            currentFavicon: null,
            activeURL: null,
            show: true
        }
    },
    created: function () {
        // Create a Table in DynamoDB for first time users. 
        this.userInit();

        // Get Current Browser Data
        this.getCurrentTabData();

         // Get Current Browser Detail
        this.getCurrentBrowserDetail();

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
        userInit: function(){
            self = this
            if (cognitoUser != null) {
                cognitoUser.getSession(function (err, session) {
                    // Get User Attributes 
                    cognitoUser.getUserAttributes(function(err, response) {
                        if (err) {
                            alert(err.message);
                            return;
                        }

                        // Store User Data in Attribute
                        for (let i = 0; i < response.length; i++) {
                            self.$set(self.userAttributes, response[i].getName(), response[i].getValue())
                        }

                        // Create Dynamo Database User doesn't have one
                        self.createDynamoDBUserRow();
                    });

                });
            }
        },
        createDynamoDBUserRow: function(){
            self = this
            let params = {
                TableName: 'waver_items',
                KeyConditionExpression: 'email = :email',
                ExpressionAttributeValues: { ':email': self.userAttributes.email} 
            };

            docClient.query(params, function(err, data) {
                if (err) { alert(err.message)} else {
                    // If User DB, if Dosen't Exist (Count 0).
                    if(data.Count == 0) {
                        var params = {
                            TableName: 'waver_items',
                            Item: {
                                "email": { "S": self.userAttributes.email },
                                "items": { "L": [] }
                            }
                        };

                        dynamoDB.putItem(params, function(err, data) {
                            if (err) { alert(err.message)} 
                        });
                    }
                }
            });
        },
        getCurrentBrowserDetail: function(){
            self = this
            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                self.activeURL = tabs[0].url;
            });
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