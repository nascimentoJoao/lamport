"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AwsClient_1 = require("./aws/AwsClient");
require("dotenv/config");
var bucketParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: process.env.AWS_OBJECT_NAME
};
const awsService = AwsClient_1.AwsClient.getInstance().service;
// Call S3 to obtain a list of the objects in the bucket
awsService.getObject(bucketParams, function (err, data) {
    if (err) {
        console.log("Error", err);
    }
    else {
        console.log(data.Body.toString());
    }
});
//# sourceMappingURL=app.js.map