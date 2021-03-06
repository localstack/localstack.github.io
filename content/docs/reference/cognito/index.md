---
title: "Cognito"
description: ""
lead: ""
pro: true
date: 2021-06-25T17:49:09+02:00
lastmod: 2021-06-25T17:49:09+02:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 380
toc: true
---

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
