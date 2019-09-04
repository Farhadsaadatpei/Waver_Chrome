<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-navy">
            <div>
                <small class="d-inline">
                    <a class="text-white" href="#" v-on:click='profile'> <i class="far fa-user-circle"></i> Hi, {{userAttributes.given_name}}. 
                    </a>
                </small>
            </div>
            <div>
                <div href="#" id="waver-dot" v-on:click='blockURL'></div>
                <b-tooltip placement="left" target="waver-dot" custom-class="block-tooltip">Waver It.</b-tooltip>
            </div>
        </nav>
        <div class="container-fluid p-0">
            <div class="h-25 px-2  py-1 headline-container">
                <div class="row d-flex">
                    <div class="col-6">
                        <small>Your Blocked Items:</small>
                    </div>
                    <div class="col-6 text-right">
                        <small><a class="d-inline" href="#" v-on:click='logOut'>Logout</a></small>
                    </div>
                </div>
           </div>
            <div class="list-group" id="blockList">
                <a v-if="blockList === undefined || blockList.length == 0" class="list-group-item list-group-item-action rounded-0">
                    <div class="w-100">
                        <h6 class="mb-1"><i class="far fa-surprise"></i> No URL Blocked.</h6>
                        <small>It's easy to block a URL, Go to the site and press the red Dot on top.</small>
                    </div>
                </a>
                <a v-for="item in blockList" :href="item.URL" class="list-group-item list-group-item-action rounded-0">
                    <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{item.Title}}</h6>
                    <small class="countdown pl-2">
                        <countdown :time="item.TimeStampEnd - new Date().getTime()">
                            <template slot-scope="props">{{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}</template>
                        </countdown>
                    </small>
                    </div>
                    <small><img v-if="item.FaviconURL != null || item.FaviconURL != ' '" :src="item.FaviconURL" width="16" height="16">  <span class="block-url d-inline">{{item.URL}}</span></small>
                
                </a>
            </div>
        </div>
    </div>
</template>

<script>

import Vue from 'vue';
import VueCountdown from '@xkeshi/vue-countdown';
Vue.component(VueCountdown.name, VueCountdown);


// AWS 
import AWS from 'aws-sdk'
import '../aws_auth'
import * as AmazonCognitoIdentity from  'amazon-cognito-identity-js';

// DyanmoDB Doc Client
var docClient = new AWS.DynamoDB.DocumentClient();
var dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var cognitoUser;

export default {
    name: 'Account',
    data: function(){
        return {
            userAttributes: {},
            blockList:  [],
            currentURL: null,
            currentTitle: null,
            currentFavicon: null,
        }
    },
    created: async function () {
        // Get Current Browser Data
        this.getCurrentTabData();

        // Create a Use Pool
        await this.createUserPool()

        // Init User DATA. 
        this.userInit()

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
        createUserPool: function(){
            // Create Pool Object 
            var PoolData = { 
                UserPoolId: 'us-east-1_na4CCQL42',
                ClientId: '5gi24c3d8cat153g9msbtr22mb'
            };

            var UserPool = new AmazonCognitoIdentity.CognitoUserPool(PoolData);
            cognitoUser = UserPool.getCurrentUser();
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

                        // Create Dynamo Database User doesn't have one
                        self.createDynamoDBUserRow();

                        // Load User Block List
                        await self.loadBlockList();
                    });
                });
            }
        },
        createDynamoDBUserRow: function(){
            self = this
            let params = {
                TableName: 'waver',
                KeyConditionExpression: 'username = :username',
                ExpressionAttributeValues: { ':username': self.userAttributes.sub} 
            };

            docClient.query(params, function(err, data) {
                if (err) { alert(err.message)} else {
                    // If User DB, if Dosen't Exist (Count 0).
                    if(data.Count == 0) {
                        var params = {
                            TableName: 'waver',
                            Item: {
                                "username": { "S": self.userAttributes.sub },
                                "URLItems": { "L": [] }
                            }
                        };

                        dynamoDB.putItem(params, function(err, data) {
                            if (err) { alert(err.message)} 
                        });
                    }
                }
            });
        },
        loadBlockList: function(){
            self = this
            let params = {
                TableName: 'waver',
                KeyConditionExpression: 'username = :username',
                ExpressionAttributeValues: { ':username': self.userAttributes.sub} 
            };

            docClient.query(params, function(err, data) {
                if (err) { alert(err.message)} else {
                    var t = []
                    data.Items[0].URLItems.forEach(element => {
                        if(element.TimeStampEnd > new Date().getTime()) {
                            t.push({
                                Title: element.Title,
                                URL: element.URL,
                                FaviconURL: element.FaviconURL,
                                TimeStampStart: element.TimeStampStart,
                                TimeStampEnd: element.TimeStampEnd
                            })
                        }
                    });

                    // Block List Array
                    self.blockList = t

                    // Load it to Local Storage
                    chrome.storage.local.set({WaverBlockList: JSON.stringify(self.blockList)});
                }
            });


        },
        blockURL: function(){
            self = this

            // Search if Item exist in Block List
            var result = self.blockList.filter(function (obj) {
                return obj.URL === self.currentURL;
            })[0];
            
            // If not add it, 
            if(result == undefined){
                self.addURL();
            }

            // Check if item Exist in Block List and Alert the User UI NEEDED
            if(result != undefined){
                alert('URL already in Block List!')
            }
            
        },
        addURL: function(){
            // Add the URL to DB
            if(self.currentURL != null){

                // Make Sure Favicon is URL String and NOT DATA
                if(!ValidURL(self.currentFavicon)){
                    self.currentFavicon = ' ';
                }

                // Create a Append List Paramter to add URL to User Account
                var params = {
                    TableName  : 'waver',
                    Key: {
                        "username": self.userAttributes.sub
                    },
                    UpdateExpression: "SET #URLItems = list_append(#URLItems, :vals)",
                    ExpressionAttributeNames: {
                        "#URLItems": "URLItems"
                    },
                    ExpressionAttributeValues: {
                        ":vals": [{
                            URL: self.currentURL, 
                            Title: self.currentTitle,
                            FaviconURL: self.currentFavicon,
                            TimeStampStart: new Date().getTime(),
                            TimeStampEnd: new Date().addHours(24).getTime()

                        }]
                    },
                    ReturnValues:'ALL_NEW'
                };

                // Add to DB Request
                docClient.update(params, function(err, data) {
                    if (err) console.log(err, err.stack);
                    else{
                        // Clear Block List
                        self.clearBlockList();
                        self.loadBlockList();
                        
                        // Refresh Current Active Tab
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
                        });
                    }
                });
            }
        },
        clearBlockList: function(){
            self = this 
            self.blockList = {}
            document.getElementById('blockList').innerHTML = '';
        },
        profile: function(){
            self = this
            if(cognitoUser != null){
                self.$router.push({ name: 'Profile' })
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

// Add Hours Extenstion for Date
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

// Check for URL String
function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  } else {
    return true;
  }
}
</script>