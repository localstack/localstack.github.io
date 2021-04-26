---
title: "Pro Features"
description: "LocalStack Pro Features"
date: 2021-04-26T19:01:19+02:00
lastmod: 2021-04-26T19:01:19+02:00
draft: false
images: ["kubernetes.png"]
menu:
  docs:
    parent: "documentation"
weight: 93
toc: true
---

## Features Overview

The Pro version of LocalStack includes, among others, the following features:

* [Support for Lambda Layers](#lambda-layers)
* [Support for Relational Database Service (RDS)](#relational-database-service--rds-)
* [Support for ElastiCache](#elasticache-api)
* [Support for ECS](#elastic-container-service--ecs-)
* [Support for ECR](#elastic-container-registry--ecr-)
* [Support for EKS](#elastic-kubernetes-service--eks-)
* [Support for IoT APIs](#iot-apis)
* [Support for XRay Tracing](#xray-tracing)
* [Support for Cognito Authentication](#cognito-authentication)
* [Support for Athena](#athena)
* [Support for Elastic MapReduce (EMR)](#elastic-mapreduce--emr-)
* [Support for API Gateway V2](#api-gateway-v2)
* [Support for CloudFront](#cloudfront)
* [Support for AppSync](#appsync)
* [Support for SageMaker](#sagemaker)
* [Support for Glue](#glue)
* [Support for Amplify](#amplify)
* [Support for Transfer](#aws-transfer)
* [Support for Quantum Ledger Database (QLDB)](#quantum-ledger-database--qldb-)
* [Support for SMTP in Simple Email Service (SES)](#smtp-in-simple-email-service--ses-)
* [Support for CodeCommit](#codecommit)
* [Support for Kinesis Data Analytics](#kinesis-data-analytics)
* [Support for IAM Security Enforcement](#iam-security-enforcement)
* [Local Cloud Pods](#local-cloud-pods)
* [Multi-Region Support](#multi-region-support)
* [Multi-Account Setups](#multi-account-setups)
* [Test Report Dashboards](#test-report-dashboards)


## Lambda Layers

[Lambda layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) are a new AWS feature that allows to pull in additional code and content into your Lambda functions.

Simply point your Lambda client code at your LocalStack instance, e.g., running on http://localhost. For more details on how to use Lambda layers, please follow the documentation and examples on the [AWS website](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html).

## Relational Database Service (RDS)

LocalStack supports a basic version of [RDS](https://aws.amazon.com/rds/) for testing. Currently, it is possible to spin up PostgreSQL databases on the local machine; support for MySQL and other DB engines is under development and coming soon.

The local RDS service also supports the [RDS Data API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html), which allows executing data queries over a JSON/REST interface. Below is a simple example that illustrates (1) creation of an RDS database, (2) creation of a SecretsManager secret with the DB password, and (3) running a simple `SELECT 123` query via the RDS Data API.
```
$ awslocal rds create-db-instance --db-instance-identifier db1 --db-instance-class c1 --engine postgres
...
$ awslocal secretsmanager create-secret --name dbpass --secret-string test
{
    "ARN": "arn:aws:secretsmanager:eu-central-1:1234567890:secret:dbpass-cfnAX",
    "Name": "dbpass",
    "VersionId": "fffa1f4a-2381-4a2b-a977-4869d59a16c0"
}
$ awslocal rds-data execute-statement --database test --resource-arn arn:aws:rds:eu-central-1:000000000000:db:db1 --secret-arn arn:aws:secretsmanager:eu-central-1:1234567890:secret:dbpass-cfnAX --sql 'SELECT 123'
{
    "columnMetadata": [{
        "name": "?column?",
        "type": 23
    }],
    "records": [[
        { "doubleValue": 123 }
    ]]
}
```

## ElastiCache API

A basic version of [ElastiCache](https://aws.amazon.com/elasticache/) is provided. By default, the API is started on http://localhost:4598 and supports running a local Redis instance (Memcached support coming soon).

After starting LocalStack Pro, you can test the following commands:
```
$ awslocal elasticache create-cache-cluster --cache-cluster-id i1
{
    "CacheCluster": {
        "CacheClusterId": "i1",
        "ConfigurationEndpoint": {
            "Address": "localhost",
            "Port": 4530
        }
    }
}
```

Then use the returned port number (`4530`) to connect to the Redis instance:
```
$ redis-cli -p 4530 ping
PONG
$ redis-cli -p 4530 set foo bar
OK
$ redis-cli -p 4530 get foo
"bar"
```

## Elastic Container Service (ECS)

Basic support for creating and deploying containerized apps using [ECS](https://aws.amazon.com/ecs) is provided in the Pro version. LocalStack offers the basic APIs locally, including creation of ECS task definitions, services, and tasks.

By default, the ECS Fargate launch type is assumed, i.e., the local Docker engine is used for deployment of applications, and there is no need to create and manage EC2 virtual machines to run the containers.

Note that more complex features like integration of application load balancers (ALBs) are currently not available, but are being developed and will be available in the near future.

Task instances are started in a local Docker engine which needs to be accessible to the LocalStack container. The name pattern for task containers is `localstack_<family>_<revision>`, where `<family>` refers to the task family and `<revision>` refers to a task revision (for example, `localstack_nginx_1`).

## Elastic Container Registry (ECR)

A basic version of Elastic Container Registry (ECR) is available to store application images. ECR is often used in combination with other APIs that deploy containerized apps, like ECS or EKS.

```
$ awslocal ecr create-repository --repository-name repo1
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:us-east-1:000000000000:repository/repo1",
        "registryId": "abc898c8",
        "repositoryName": "repo1",
        "repositoryUri": "localhost:4510/repo1"
    }
}
```

You can then build and tag a new Docker image, and push it to the repository URL (`localhost:4510/repo1` in the example above):
```
$ cat Dockerfile
FROM nginx
ENV foo=bar
$ docker build -t localhost:4510/repo1 .
...
Successfully built e2cfb3cf012d
Successfully tagged localhost:4510/repo1:latest
$ docker push localhost:4510/repo1
The push refers to repository [localhost:4510/repo1]
318be7aea8fc: Pushed
fe08d5d042ab: Pushed
f2cb0ecef392: Pushed
latest: digest: sha256:4dd893a43df24c8f779a5ab343b7ef172fb147c69ed5e1278d95b97fe0f584a5 size: 948
...
```

## Elastic Kubernetes Service (EKS)

LocalStack Pro allows you to use the [EKS](https://docs.aws.amazon.com/eks/) API to create Kubernetes clusters and easily deploy containerized apps locally.

Please note that EKS requires an existing local Kubernetes installation. In recent versions of Docker, you can simply enable Kubernetes as an embedded service running inside Docker. See below for a screenshot of the Docker settings for Kubernetes in MacOS (similar configurations apply for Linux/Windows). By default, it is asssumed that Kubernetes API runs on the local TCP port `6443`.

{{< img-simple src="kubernetes.png" alt="Kubernetes in Docker" >}}

The example below illustrates how to create an EKS cluster configuration (assuming you have [`awslocal`](https://github.com/localstack/awscli-local) installed):
```
$ awslocal eks create-cluster --name cluster1 --role-arn r1 --resources-vpc-config '{}'
{
    "cluster": {
        "name": "cluster1",
        "arn": "arn:aws:eks:eu-central-1:000000000000:cluster/cluster1",
        "createdAt": "Sat, 05 Oct 2019 12:29:26 GMT",
        "endpoint": "https://172.17.0.1:6443",
        "status": "ACTIVE",
        ...
    }
}
$ awslocal eks list-clusters
{
    "clusters": [
        "cluster1"
    ]
}
```
Simply configure your Kubernetes client (e.g., `kubectl` or other SDK) to point to the `endpoint` specified in the `create-cluster` output above. Depending on whether you're calling the Kubernetes API from the local machine or from within a Lambda, you may have to use different endpoint URLs (`https://localhost:6443` vs `https://172.17.0.1:6443`).

## IoT APIs

Basic support for [IoT](https://aws.amazon.com/iot/) (including IoT Analytics, IoT Data, and related APIs) is provided in the Pro version. The main endpoints for creating and updating entities are currently implemented, as well as the CloudFormation integrations for creating them.

The IoT API ships with a built-in MQTT message broker. In order to get the MQTT endpoint, the `describe-endpoint` API can be used; for example, using [`awslocal`](https://github.com/localstack/awscli-local):
```
$ awslocal iot describe-endpoint
{
    "endpointAddress": "localhost:4520"
}
```

This endpoint can then be used with any MQTT client to send/receive messages (e.g., using the endpoint URL `mqtt://localhost:4520`).

LocalStack Pro also supports advanced features like SQL queries for IoT topic rules. For example, you can use the [`CreateTopicRule` API](https://docs.aws.amazon.com/iot/latest/apireference/API_CreateTopicRule.html) to define a topic rule with a SQL query `SELECT * FROM 'my/topic' where attr=123` which will trigger a Lambda function whenever a message with attribute `attr=123` is received on the MQTT topic `my/topic`.

## XRay Tracing

LocalStack Pro allows to instrument your applications using [XRay](https://aws.amazon.com/xray/) tracing. This helps in optimizing the interactions between service calls, and facilitates debugging of performance bottlenecks.

For example, a Python Lambda function can be instrumented as follows (based on the example [here](https://docs.aws.amazon.com/lambda/latest/dg/python-tracing.html)):
```
import boto3
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch
patch(['boto3'])
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    s3_client.create_bucket(Bucket='mybucket')
    xray_recorder.begin_subsegment('my_code')
    # your function code goes here...
    xray_recorder.end_subsegment()
```
Running this code in Lambda on LocalStack will result in two trace segments being created in XRay - one from the instrumented `boto3` client when running `create_bucket(..)`, and one for the custom subsegment denoted `'my_code'`. You can use the regular XRay API calls (e.g., [`GetTraceSummaries`](https://docs.aws.amazon.com/xray/latest/api/API_GetTraceSummaries.html), [`BatchGetTraces`](https://docs.aws.amazon.com/xray/latest/api/API_BatchGetTraces.html)) to retrieve the details (timestamps, IDs, etc) of these segments.

## Cognito Authentication

LocalStack Pro contains basic support for authentication via [AWS Cognito](https://eu-central-1.console.aws.amazon.com/cognito/). You can create Cognito user pools, sign up and confirm users, and use the `COGNITO_USER_POOLS` authorizer integration with API Gateway.

For example, if you happen to use [Serverless](https://serverless.com/) to deploy your application, take this snippet of a `serverless.yml` configuration:
```
service: test

plugins:
  - serverless-deployment-bucket
  - serverless-pseudo-parameters
  - serverless-localstack

custom:
  localstack:
    stages: [local]

functions:
  http_request:
    handler: http.request
    events:
      - http:
          path: v1/request
          authorizer:
            arn: arn:aws:cognito-idp:us-east-1:#{AWS::AccountId}:userpool/UserPool

resources:
  Resources:
    UserPool:
      Type: AWS::Cognito::UserPool
      Properties:
        ...
```
This configuration can be directly deployed using `serverless deploy --stage local`. The example contains a Lambda function `http_request` which is connected to an API Gateway endpoint. Once deployed, the `v1/request` API Gateway endpoint will be secured against the Cognito user pool `"UserPool"`. You can then register users against that local pool, using the same API calls as for AWS. In order to make request against the secured API Gateway endpoint, use the local Cognito API to retrieve identity credentials which can be sent along as `Authentication` HTTP headers (where `test-1234567` is the name of the access key ID generated by Cognito):

```
Authentication: AWS4-HMAC-SHA256 Credential=test-1234567/20190821/us-east-1/cognito-idp/aws4_request ...
```

### OAuth Flows via Cognito Login Form

In order to access the local [Cognito login form](https://docs.aws.amazon.com/cognito/latest/developerguide/login-endpoint.html), try accessing the following URL in your browser. Please replace `<client_id>` with the ID of an existing user pool ID, and `<redirect_uri>` with the redirect URL of your application (e.g., `http://example.com`).
```
http://localhost:4590/login?response_type=code&client_id=<client_id>&redirect_uri=<redirect_uri>
```

The login form should look similar to the screenshot below:

{{< img-simple src="cognitoLogin.png" alt="Cognito Login" >}}

After successful login, the page will redirect to the specified redirect URI, with a path parameter `?code=<code>` appended, e.g., `http://example.com?code=test123`. This authentication code can then be used to obtain a token via the Cognito OAuth2 TOKEN endpoint documented [here](https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html).

## Athena

LocalStack Pro ships with built-in support for [Athena](https://aws.amazon.com/athena), Amazon's serverless data warehouse and analytics platform. Athena uses [Presto](https://prestodb.github.io/) under the covers, and your Athena instance will be automatically configured with a Hive metastore that connects seamlessly to the LocalStack S3 API. That is, you can easily connect your local S3 buckets and query data directly from S3 via the powerful Athena query API.

The following commands illustrate how to use Athena from the command line (assuming you have [`awslocal`](https://github.com/localstack/awscli-local) installed):
```
$ awslocal athena start-query-execution --query-string 'SELECT 1, 2, 3'
{
    "QueryExecutionId": "c9f453ad"
}
$ awslocal athena list-query-executions
{
    "QueryExecutionIds": [
        "c9f453ad"
    ]
}
$ awslocal athena get-query-results --query-execution-id c9f453ad
{
    "ResultSet": {
        "Rows": [{
            "Data": [
                { "VarCharValue": "1" },
                { "VarCharValue": "2" },
                { "VarCharValue": "3" }
            ]
        }],
        "ResultSetMetadata": { "ColumnInfo": [] }
    },
    "UpdateCount": 0
}
```

**Note:** In order to use the Athena API, some additional dependencies have to be fetched from the network, including a Docker image of apprx. 1.2GB which includes Presto, Hive and other tools. These dependencies are automatically fetched when you start up the service, so please make sure you're on a decent internet connection when pulling the dependencies for the first time.

## Elastic MapReduce (EMR)

LocalStack Pro allows running data analytics workloads locally via the [EMR](https://aws.amazon.com/emr) API. EMR utilizes various tools in the [Hadoop](https://hadoop.apache.org/) and [Spark](https://spark.apache.org) ecosystem, and your EMR instance is automatically configured to connect seamlessly to the LocalStack S3 API.

To create a virtual EMR cluster locally from the command line (assuming you have [`awslocal`](https://github.com/localstack/awscli-local) installed):
```
$ awslocal emr create-cluster --release-label emr-5.9.0 --instance-groups InstanceGroupType=MASTER,InstanceCount=1,InstanceType=m4.large InstanceGroupType=CORE,InstanceCount=1,InstanceType=m4.large
{
    "ClusterId": "j-A2KF3EKLAOWRI"
}
```

The commmand above will spin up one more more Docker containers on your local machine that can be used to run analytics workloads using Spark, Hadoop, Pig, and other tools.

Note that you can also specify startup commands using the `--steps=...` command line argument to the `create-cluster` command. A simple demo project with more details can be found in [this Github repository](https://github.com/localstack/localstack-pro-samples/tree/master/emr-hadoop-spark-jobs).

**Note:** In order to use the EMR API, some additional dependencies have to be fetched from the network, including a Docker image of apprx. 1.5GB which includes Spark, Hadoop, Pig and other tools. These dependencies are automatically fetched when you start up the service, so please make sure you're on a decent internet connection when pulling the dependencies for the first time.

## API Gateway V2

Basic support for API Gateway V2 is included in the Pro version, which allows for creation of local WebSocket APIs for long-lived connections and bi-directional communication between the API and your clients.

For example, given the following [Serverless](https://serverless.com/) configuration:
```
...
plugins:
  - serverless-localstack
functions:
  actionHandler:
    handler: handler.handler
    events:
      - websocket:
          route: test-action
```
Upon deployment of the Serverless project, a new API Gateway V2 endpoint will be created in LocalStack. The [`awslocal`](https://github.com/localstack/awscli-local) CLI can be used to get the list of APIs, which should contain the WebSocket endpoint, e.g., `ws://localhost:4510` in the example below:
```
$ awslocal apigatewayv2 get-apis
{
    "Items": [{
        "ApiEndpoint": "ws://localhost:4510",
        "ApiId": "129ca37e",
        ...
    }]
}
```
Assuming your project contains a simple Lambda `handler.js` like this:
```
module.exports.handler = function(event, context, callback) {
  callback(null, event);
};
```
... then sending a message to the WebSocket at `ws://localhost:4510` will result in the same message getting returned as a response on the same WebSocket.

For a simple, self-contained example please refer to this repository: https://github.com/localstack/localstack-pro-samples/tree/master/serverless-websockets

## CloudFront

LocalStack Pro supports creation of local CloudFront distributions, which allows you to transparently access your applications and file artifacts via CloudFront URLs like `https://abc123.cloudfront.net`.

For example, take the following simple example which creates an S3 bucket, puts a small text file `hello.txt` to the bucket, and then creates a CloudFront distribution which makes the file accessible via a `https://abc123.cloudfront.net/hello.txt` proxy URL (where `abc123` is a placeholder for the real distribution ID):
```
$ awslocal s3 mb s3://bucket1
$ echo 'Hello World' > /tmp/hello.txt
$ awslocal s3 cp /tmp/hello.txt s3://bucket1/hello.txt --acl public-read
$ domain=$(awslocal cloudfront create-distribution \
  --origin-domain-name bucket1.s3.amazonaws.com | jq -r '.Distribution.DomainName')
$ curl -k https://$domain/hello.txt
```

**Note:** In order for CloudFront to be fully functional, your local DNS setup needs to be properly configured. See the section on [configuring the local DNS server](#configuring-local-dns-server) for details.

**Note:** In the code example above, the last command (`curl https://$domain/hello.txt`) may temporarily fail with a warning message `Could not resolve host`. This is due to the fact that operating systems use different DNS caching strategies, and it may take some time for the CloudFront distribution's DNS name (e.g., `abc123.cloudfront.net`) to become available in the system. Usually after a few retries the command should work, though. Note that a similar behavior can also be observed in the real AWS - CloudFront DNS names can also take up to 10-15 minutes to propagate across the network.

## AppSync

Basic support for AppSync is included in LocalStack Pro. The local AppSync API allows you to spin up local GraphQL APIs and directly expose your data sources (e.g., DynamoDB tables) to external clients.

For example, you can create a DynamoDB table `"posts"` with a key attribute `id`, and define a GraphQL schema in a file `schema.graphql` like this:
```
schema {
    query: Query
}
type Query {
    getPosts: [Post!]!
}
type Post {
    id: DDBString!
}
type DDBString {
    S: String!
}
```
... and then use the AppSync API (or CloudFormation) to create the following entities:

1. a GraphQL API
2. a data source of type `AMAZON_DYNAMODB` that references the `"posts"` DynamoDB table
3. a request mapping template with a content like this:
```
{
    "version" : "2017-02-28",
    "operation" : "Scan"
}
```
4. a response mapping template with a content like this:
```
$util.toJson($context.result["Items"])
```

Once things have been wired up properly, and assuming the ID of your GraphQL API is `"api123"`, you should be able to run the following GraphQL query to retrieve all items from the `"posts"` DynamoDB table:
```
curl -d '{"query":"query {getPosts{id{S}}}"}' http://localhost:4605/graphql/api123
```

For more details, please refer to the self-contained sample published here: https://github.com/localstack/localstack-pro-samples/tree/master/appsync-graphql-api

## SageMaker

LocalStack Pro provides a local version of the SageMaker API, which allows running jobs to create machine learning models (e.g., using TensorFlow).

A basic example using the `sagemaker.tensorflow.TensorFlow` class is provided in this Github repository: https://github.com/localstack/localstack-pro-samples/tree/master/sagemaker-ml-jobs . Essentially, the code boils down to these core lines:
```
inputs = ...  # load training data files
mnist_estimator = TensorFlow(entry_point='mnist.py', role='arn:aws:...',
    framework_version='1.12.0', sagemaker_session=sagemaker_session,
    train_instance_count=1, training_steps=10, evaluation_steps=10)
mnist_estimator.fit(inputs, logs=False)
```

The code snippet above uploads the model training code to local S3, submits a new training job to the local SageMaker API, and finally puts the trained model back to an output S3 bucket. Please refer to the sample repo for more details.

**Note:** SageMaker is a fairly comprehensive API - for now, only a subset of the functionality is provided locally, but new features are being added on a regular basis.

## Glue

Details following soon.

## Amplify

Details following soon.

## AWS Transfer

The AWS Transfer API provides the ability to create FTP(S) servers to make files in S3 buckets accessible directly via FTP.

A simple example using AWS Transfer is included in this Github repository: https://github.com/localstack/localstack-pro-samples/tree/master/transfer-ftp-s3 . The sample creates an FTP server via the Transfer API locally, uploads two files via FTP to S3, and then finally downloads the files from the target S3 bucket.

**Note:** The Transfer API does not provide a way to return the endpoint URL of created FTP servers. Hence, in order to determine the server endpoint, the local port is encoded as a suffix in the `ServerId` attribute, using the pattern `s-<id>:<port>`. For example, assume the following is the response from the `CreateServer` API call, then the FTP server is accessible on port `4511` (i.e., `ftp://localhost:4511`):
```
{
    "ServerId": "s-73c53daf86da4:4511"
}
```

## Quantum Ledger Database (QLDB)

The Quantum Ledger Database (QLDB) API supports queries over cryptographically verifiable data, stored in a journal of immutable transaction events. LocalStack allows to create local ledgers and journals, to perform `CREATE TABLE` statements, to insert data via `INSERT` statements, and to query data via `SELECT` statements.

QLDB uses the [Amazon ION data format](https://amzn.github.io/ion-docs), a data serialization format that represents a superset of JSON, with a number of additional features.

A simple QLDB example running on LocalStack is provided in this Github repository: https://github.com/localstack/localstack-pro-samples/tree/master/qldb-ledger-queries . The sample consists of two simple scenarios: (1) to create and list tables via the `pyqldb` Python library, and (2) to insert data into two tables and perform a `JOIN` query that combines data from the two tables. The sample output is posted below:
```
Scenario 1: create and list tables in ledger
-----------
Creating new test ledger in QLDB API: ledger-test-1
Creating two test tables in ledger
Retrieved list of tables in ledger ledger-test-1: ['foobar1', 'foobar2']
-----------
Scenario 2: create ledger tables and run join query
-----------
Creating two test tables in ledger - "Vehicle" and "VehicleRegistration"
Running a query that joins data from the two tables
Query result: [{'Vehicle': {'id': 'v1'}}, {'Vehicle': {'id': 'v2'}}, {'Vehicle': {'id': 'v3'}}]
```

## SMTP in Simple Email Service (SES)

The Pro version ships with extended support Simple Email Service (SES), including a simple user interface to inspect email accounts and sent messages, as well as support for sending SES messages through an actual SMTP email server.

Please refer to the [Configuration section](#configuration) for instructions on how to configure the connection parameters of your SMTP server (`SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`).

Once your SMTP server has been configured, you can use the SES user interface in the Web app to create a new email account (e.g., `user1@yourdomain.com`), and then send an email via the command line (or your SES client SDK):
```
$ awslocal ses send-email --from user1@yourdomain.com --message 'Body={Text={Data="Lorem ipsum dolor sit amet, consectetur adipiscing elit, ..."}},Subject={Data=Test Email}' --destination 'ToAddresses=recipient1@example.com'
```

The [Web user interface](https://app.localstack.cloud) then allows you to interactively browse through the sent email messages, as illustrated in the screenshot below:

{{< img-simple src="sesInterface.png" alt="SES Web Interface" >}}

## CodeCommit

LocalStack Pro contains basic support for CodeCommit code repositories. The CodeCommit API can be used to create Git repositories, clone these repos to local folders, push commits with changes, etc.

A simple example has been added to the sample repository on Github here: https://github.com/localstack/localstack-pro-samples/tree/master/codecommit-git-repo . The sample creates an Git repository via the AWS CodeCommit API locally, commits and pushes a test file to the repository, and then checks out the file in a fresh clone of the repository.

Please note that CodeCommit is a fairly large API and currently not all methods are supported yet, but we are actively extending the implementation on an ongoing basis.

## Kinesis Data Analytics

The Kinesis Data Analytics API allows you to run continuous SQL queries directly over your Kinesis data streams. Basic support is included in LocalStack Pro - it allows you to create Kinesis Analytics applications, define input and output streams and schema types, and run continuous queries locally.

A simple example has been added to the sample repository on Github here: https://github.com/localstack/localstack-pro-samples/tree/master/kinesis-analytics . More details are following soon.

## IAM Security Enforcement

By default, LocalStack uses not enforce security policies for client requests. The IAM security enforcement feature can be used to test your security policies and create a more realistic environment that more closely resembles real AWS.

**Please note:** The environment configuration `ENFORCE_IAM=1` is required to enable this feature (by default, IAM enforcement is disabled).

Below is a simple example that illustrates the use of IAM policy enforcement. It first attempts to create an S3 bucket with the default user (which fails), then create a user and attempts to create a bucket with that user (which fails again), and then finally attaches a policy to the user to allow `s3:CreateBucket`, which allows the bucket to be created.
```
$ awslocal s3 mb s3://test
make_bucket failed: s3://test An error occurred (AccessDeniedException) when calling the CreateBucket operation: Access to the specified resource is denied
$ awslocal iam create-user --user-name test
...
$ awslocal iam create-access-key --user-name test
...
  "AccessKeyId": "AKIA4HPFP0TZHP3Z5VI6",
  "SecretAccessKey": "mwi/8Zhg8ypkJQmkdBq87UA3MbSa3x0HWnkcC/Ua",
...
$ export AWS_ACCESS_KEY_ID=AKIA4HPFP0TZHP3Z5VI6 AWS_SECRET_ACCESS_KEY=mwi/8Zhg8ypkJQmkdBq87UA3MbSa3x0HWnkcC/Ua
$ awslocal s3 mb s3://test
make_bucket failed: s3://test An error occurred (AccessDeniedException) when calling the CreateBucket operation: Access to the specified resource is denied
$ awslocal iam create-policy --policy-name p1 --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"s3:CreateBucket","Resource":"*"}]}'
...
$ awslocal iam attach-user-policy --user-name test --policy-arn arn:aws:iam::000000000000:policy/p1
$ awslocal s3 mb s3://test
make_bucket: test
```

### Supported APIs

IAM security enforcement is available for the majority of LocalStack APIs - it has been tested, among others, for the following services: ACM, API Gateway, CloudFormation, CloudWatch (metrics/events/logs), DynamoDB, DynamoDB Streams, Elasticsearch Service, EventBus, Kinesis, KMS, Lambda, Redshift, S3 (partial support), SecretsManager, SNS, SQS.

## Local Cloud Pods

Local Cloud Pods are a mechanism that allows you to take a snapshot of your local instance, persist it to a storage backend (e.g., git repository), and easily share it out with your team members.

You can create and manage local Cloud pods via the Web UI, and in order to load and store the persistent state of pods you can use the `localstack` command line interface (CLI).

Below is a simple example of how you can push and pull Local Cloud Pods using the `localstack` command line:

```
# User 1 pushes state of Cloud Pod to persistent server
$ awslocal kinesis list-streams
{"StreamNames": ["mystream123"]}
$ localstack pod push mypod1
...

# User 2 pulls state from the server to local instance
$ localstack pod pull mypod1
$ awslocal kinesis list-streams
{"StreamNames": ["mystream123"]}
```

**Note**: Using local Cloud pods requires setting the `DATA_DIR` configuration variable to point to a folder on your local machine - this folder will be used to persist and load the state of cloud pods in your local instance.

Local Cloud Pods support different storage mechanisms - currently we're focusing on using `git` repositories as the storage backend, as `git` is often readily available on developers' machines and is easy to integrate with (no additional access control settings required). Support for more storage backends is following soon (e.g., S3 buckets, FTP servers, etc).

You can use the LocalStack Web UI to create a new local cloud pod - see screenshot below (make sure to adjust Git URL and branch name to point to your repo).

{{< img-simple src="cloudPodsUI.png" alt="Local Cloud Pods UI" >}}

Once the pod has been created, you should be able to login and list it via the CLI as well:
```
$ export LOCALSTACK_API_KEY=...
$ localstack login
...
$ localstack pod list
Name    Backend    URL                                Size    State
------  ---------  ---------------------------------  ------  -------
pod1    git        ssh://git@github.com/your_org/...  1.68MB  Shared
```

(**Note**: Please ensure that `LOCALSTACK_API_KEY` is properly configured in the terminal session above.)

After the pod definition has been created, you should be able to use the `push`/`pull` commands listed above to push and pull the pod state to the Git repo. After `pull`ing the pod, LocalStack will automatically restart and restore the pod state in your instance (this may take a few moments to complete).

**Note**: If you `pull` a local cloud pod, it will overwrite the entire state in your LocalStack instance. Please make sure to backup any data before pulling a cloud pod, if required.

## Configuring Local DNS Server

LocalStack Pro supports transparent execution mode, which means that your application code automatically accesses the LocalStack APIs on `localhost`, as opposed to the real APIs on AWS. In contrast, the community (open source) edition requires the application code to configure each AWS SDK client instance with the target `endpoint URL` to point to the respective ports on `localhost` (see list of default ports [here](https://github.com/localstack/localstack)).

When the system starts up, the log output contains the IP address of the local DNS server. Typically, this address by default is either `0.0.0.0` (see example below) or `200.200.55.55`.
```
Starting DNS servers (tcp/udp port 53 on 0.0.0.0)...
```

In order to use transparent execution mode, the system needs to be configured to use the predefined DNS server. The DNS configuration depends on the operating system: in Mac OS it can be configured in the Network System Settings, under Linux this is usually achieved by configuring `/etc/resolv.conf` as follows:
```
nameserver 0.0.0.0
```
The example above needs to be adjusted to the actual IP address of the DNS server. You can also configure a custom IP address by setting the `DNS_ADDRESS` environment variable (e.g., `DNS_ADDRESS=200.200.55.55`).

**Note:** Please be careful when changing the network configuration on your system, as this may have undesired side effects.

**Note**: When you configure transparent execution mode, you may still have to configure your application's AWS SDK to **accept self-signed certificates**. This is a technical limitation caused by the SSL certificate validation mechanism, due to the fact that we are repointing AWS domain names (e.g., `*.amazonaws.com`) to `localhost`. For example, the following command will fail with an SSL error:
```
$ aws kinesis list-streams
SSL validation failed for https://kinesis.us-east-1.amazonaws.com/ [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self signed certificate (_ssl.c:1076)
```
... whereas the following command works:
```
$ PYTHONWARNINGS=ignore aws --no-verify-ssl kinesis list-streams
{
    "StreamNames": []
}
```
Disabling SSL validation depends on the programming language and version of the AWS SDK used. For example, the [`boto3` AWS SDK for Python](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html#boto3.session.Session.client) provides a parameter `verify=False` to disable SSL verification. Similar parameters are available for most other AWS SDKs.

## Multi-Region Support

While the open source version of LocalStack can only be configured to use a single region (e.g., `us-east-1`), the Pro version contains several extensions that allow resources to be addressed across regions, using their unique ARN identifiers.

## Multi-Account Setups

Unlike the open source LocalStack, which uses a single hardcoded account ID (`000000000000`), the Pro version allows to use multiple instances for different AWS account IDs in parallel.

In order to set up a multi-account environment, simply configure the `TEST_AWS_ACCOUNT_ID` to include a comma-separated list of account IDs. For example, use the following to start up LocalStack with two account IDs:
```
$ TEST_AWS_ACCOUNT_ID=000000000001,000000000002 SERVICES=s3 localstack start
```

You can then use `AWS_ACCESS_KEY_ID` to address resources in the two separate account instances:
```
$ AWS_ACCESS_KEY_ID=000000000001 aws --endpoint-url=http://localhost:4566 s3 mb s3://bucket-account-one
make_bucket: bucket-account-one
$ AWS_ACCESS_KEY_ID=000000000002 aws --endpoint-url=http://localhost:4566 s3 mb s3://bucket-account-two
make_bucket: bucket-account-two
$ AWS_ACCESS_KEY_ID=000000000001 aws --endpoint-url=http://localhost:4566 s3 ls
2020-05-24 17:09:41 bucket-account-one
$ AWS_ACCESS_KEY_ID=000000000002 aws --endpoint-url=http://localhost:4566 s3 ls
2020-05-24 17:09:53 bucket-account-two
```

Note that using an invalid account ID should result in a 404 (not found) error response from the API:
```
$ AWS_ACCESS_KEY_ID=123000000123 aws --endpoint-url=http://localhost:4566 s3 ls
An error occurred (404) when calling the ListBuckets operation: Not Found
```

**Note:** For now, the account ID is encoded directly in the `AWS_ACCESS_KEY_ID` client-side variable, for simplicity. In a future version, we will support proper access key IDs issued by the local IAM service, which will then internally be translated to corresponding account IDs.

## Test Report Dashboards

LocalStack allows for transparent collection of execution events, in order to provide usage analytics and insights into the testing process overall. Simply configure your system with the `LOCALSTACK_API_KEY` environment variable, and the system will start making your events accessible on the LocalStack dashboard at https://app.localstack.cloud/dashboard.

Please note that data privacy is one of our key concerns; data is only collected in an anonymized way, and never exposes any sensitive information about your application.
