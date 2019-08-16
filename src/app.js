/**
 * SCSS Compile
*/
import './scss/app.scss'

/**
 * Include Vendors JS
*/
import 'bootstrap'
import 'aws-sdk/clients/dynamodb'


/**
 * Include Custom JS
*/

import './js/aws_auth'

var docClient = new AWS.DynamoDB.DocumentClient();
var params = {
    TableName: "waver"
};
docClient.scan(params).eachPage((err, data, done) => {
    if (data != null) {
        console.log(data);
    }
    done();
});