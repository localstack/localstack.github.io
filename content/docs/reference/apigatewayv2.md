---
title: "API Gateway V2"
description: ""
pro: true
lead: ""
date: 2021-06-25T17:55:39+02:00
lastmod: 2021-06-25T17:55:39+02:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 999
toc: true
---

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

For a simple, self-contained example please refer to [this Github repository](https://github.com/localstack/localstack-pro-samples/tree/master/serverless-websockets).
