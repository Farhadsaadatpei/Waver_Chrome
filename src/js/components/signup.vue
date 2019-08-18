<template>
    <div class="container py-3">
        <form @submit.prevent="signup">
        <div class="row">
            <div class="col-6">
                <div class="form-group">
                    <input type="text" class="form-control" v-model="firstName"  placeholder="First Name">
                </div>
            </div>
            <div class="col-6">

                <div class="form-group">
                    <input type="text" class="form-control" v-model="lastName"  placeholder="Last Name">
                </div>
            </div>
        </div>
        <div class="form-group">
            <input type="email" class="form-control" v-model="email" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
            <input type="password" class="form-control" v-model="password" placeholder="Password">
        </div>
        <div class="form-group">
            <input type="password" class="form-control" v-model="passwordverification" placeholder="Confirm Password">
        </div>
        
        <button type="submit" class="btn btn-primary">Sign Up!</button>
        </form>
    </div>
</template>


<script>
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

                UserPool.signUp(this.email, this.password, attributeList, null, function(err, response) {
                    if(err){
                        throw(err)
                        return
                    } else {
                        console.log(response) // DO SOMETHING
                    }


                })
            }
        }
    }
}
</script>