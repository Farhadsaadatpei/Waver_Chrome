/**
 * Configure AWS Authentication to use services.
 */

import AWS from 'aws-sdk';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = "XXXXXXX";
AWS.config.secretAccessKey = "XXXXXXXX";
AWS.config.region = "us-east-1";
