import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'RS-AWS-Task2-WebBucket', {
      bucketName: 'rs-aws-task-2-cdk',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    }); 

    const originAccessIdentity = new cf.OriginAccessIdentity(this, 'RS-AWS-Task2-WebBucketOAI', {
        comment: bucket.bucketName,
    });

    bucket.grantRead(originAccessIdentity);
  
    const cloudfront = new cf.Distribution(this, 'RS-AWS-Task2-WebAppDistribution', {
        defaultBehavior: {
            origin: new origins.S3Origin(bucket, {
                originAccessIdentity: originAccessIdentity,
            }),
            viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        
        defaultRootObject: 'index.html',
        errorResponses: [
            {
                httpStatus: 404,
                responseHttpStatus: 200,
                responsePagePath: '/index.html',
            },
            {
                httpStatus: 403,
                responseHttpStatus: 200,
                responsePagePath: '/index.html',
            }
        ],
    });  
    new deployment.BucketDeployment(this, 'RS-AWS-Task2-DeployWebApp', {
        destinationBucket: bucket,
        sources: [deployment.Source.asset('../dist')],
        distribution: cloudfront,
        distributionPaths: ['/*'],
    });
  
    new cdk.CfnOutput(this, 'Domain URL', {
        value: cloudfront.distributionDomainName,
    });
  }
}
