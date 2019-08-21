/**
 * Configure AWS Authentication to use services.
 */

import AWS from 'aws-sdk';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = "AKIAWHGAKZO7KBZQT7GW";
AWS.config.secretAccessKey = "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";
AWS.config.region = "us-east-1";