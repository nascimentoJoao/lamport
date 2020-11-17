import * as aws from 'aws-sdk';

export class AwsClient {
  private static instance : AwsClient;
  private awsService : aws.S3;
  
  static getInstance() {
    if (!AwsClient.instance) {
      AwsClient.instance = new AwsClient();
    }
    return AwsClient.instance;
  }

  private constructor() {
    aws.config.loadFromPath("src/aws/config.json");
    this.awsService = new aws.S3();
  }

  get service() : aws.S3 {
    return this.awsService;
  }
}