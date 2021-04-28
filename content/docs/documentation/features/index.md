---
title: "Features"
description: "LocalStack features"
lead: "LocalStack covers a huge range of AWS features."
date: 2021-04-26T18:56:25+02:00
lastmod: 2021-04-26T18:56:25+02:00
draft: false
images: []
menu:
  docs:
    parent: "documentation"
weight: 92
toc: true
---

## Features Overview

The figure below provides an overview of the different usage tiers (Open Source, Pro, Enterprise), and the features provided by each tier.

{{< img-simple src="architecture.png" alt="LocalStack Architecture" >}}

### Available Services

LocalStack Pro spins up the following core Cloud APIs on your local machine.

**Please note:** Starting with version `0.11.0`, all services are exposed via a single edge service endpoint - `http://localhost:4566` by default. (The old service-specific port numbers from previous releases are now deprecated and disabled.)

* **Amplify**
* **API Gateway V2 (WebSockets support)**
* **API Gateway V2**
* **AppSync**
* **Athena**
* **CloudFormation**
* **CloudFront**
* **CloudTrail**
* **CloudWatch**
* **CloudWatch Logs**
* **CodeCommit**
* **Cognito Identity**
* **Cognito Identity Provider (IdP)**
* **DynamoDB**
* **DynamoDB Streams**
* **EC2**
* **ECR**
* **ECS**
* **EKS**
* **ElastiCache**
* **Elasticsearch**
* **EMR**
* **ES (Elasticsearch Service)**
* **EventBridge (CloudWatch Events)**
* **Firehose**
* **Glacier**
* **Glue**
* **IAM**
* **IoT (including IoT Analytics, IoT Data)**
* **Kinesis**
* **Kinesis Data Analytics**
* **KMS**
* **Lambda (including layers)**
* **Managed Streaming for Kafka (MSK)**
* **MediaStore**
* **QLDB**
* **RDS / Aurora Serverless**
* **Redshift**
* **Route53**
* **S3**
* **SageMaker**
* **SecretsManager**
* **SES**
* **SNS**
* **SQS**
* **SSM**
* **StepFunctions**
* **STS**
* **Timestream**
* **Transfer**
* **XRay**

Note that the list above contains a number of additional APIs and advanced features on top of the free open source version.
Details about the Pro features are described in the next section.
