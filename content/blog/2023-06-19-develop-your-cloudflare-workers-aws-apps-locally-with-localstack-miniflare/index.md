---
title: Develop your Cloudflare Workers + AWS apps locally with LocalStack & Miniflare
description: Develop your Cloudflare Workers + AWS apps locally with LocalStack & Miniflare
lead: Develop your Cloudflare Workers + AWS apps locally with LocalStack & Miniflare
date: 2023-06-19T3:27:34+05:30
lastmod: 2023-06-19T3:27:34+05:30
images: []
contributors: ["Harsh Mishra", "Waldemar Hummer", "Brendan Coll", "Adam Murray"]
tags: ['showcase']
---

In this post, we showcase how Cloudflare Workers and AWS applications can be easily tested locally, using the powerful Miniflare emulator in combination with the LocalStack platform.

## What is LocalStack?

LocalStack is a cloud development platform that turbocharges your cloud application development & testing, fosters team collaboration, and provides an integrated cloud developer experience with a local cloud sandbox. [LocalStack’s core cloud emulator](https://github.com/localstack/localstack) runs inside a Docker container and provides a set of external network ports for [integrations](https://docs.localstack.cloud/user-guide/integrations/), [SDKs](https://docs.localstack.cloud/user-guide/integrations/sdks/), or [CI providers](https://docs.localstack.cloud/user-guide/ci/) for developers to execute their cloud & serverless applications fully locally without talking to the real cloud services. This enables a highly efficient development loop, by reducing the feedback cycles from minutes to seconds.

LocalStack has traditionally been popular among cloud developers for its extensive set of AWS services, such as [DynamoDB](https://docs.localstack.cloud/user-guide/aws/dynamodb/), [S3](https://docs.localstack.cloud/user-guide/aws/s3/), [EKS](https://docs.localstack.cloud/user-guide/aws/elastic-kubernetes-service/), and more, and for its comprehensive feature set, like [hot reloading for Lambda](https://docs.localstack.cloud/user-guide/tools/lambda-tools/hot-reloading/) & [Cloud Pods](https://docs.localstack.cloud/user-guide/tools/cloud-pods/), that provides a frictionless development experience.

With the [LocalStack 1.0 release](https://localstack.cloud/blog/2022-07-13-announcing-localstack-v1-general-availability/), we introduced [LocalStack Extensions](https://localstack.cloud/blog/2022-09-12-announcing-localstack-extensions/). Extensions allow users to extend and customize LocalStack using pluggable Python distributions. The Extensions API allows developers to easily plug in their own custom logic and services into the LocalStack container.

With LocalStack Extensions, it is now possible to start custom services with LocalStack in the same container, while leveraging the existing features in the ecosystem. Developers can add new services, extend existing services, and even add custom functionality that goes beyond the scope of AWS cloud emulation - in particular, it can encompass other cloud providers, like Cloudflare!

## What are Cloudflare Workers & Miniflare?

[Cloudflare](https://www.cloudflare.com/) is an internet service provider focused on providing content delivery network (CDN) and web security services. One of the key features in their service offering is [Cloudflare Workers](https://workers.cloudflare.com), a platform to run JavaScript service workers at the Edge. It allows users to inject functionality like setting user cookies, performing web redirects, modifying served content via search/replace, rewriting URLs, etc.

The Cloudflare team has released a high-fidelity local emulator called _Miniflare_ that allows users to run the JavaScript code of Cloudflare Workers locally. Cloudflare recently announced the release of [Miniflare v3](https://blog.cloudflare.com/wrangler3/) during their Developer Week in May 2023. Miniflare v3, now based on the `workerd` runtime, offers several new features and enhancements, providing even higher parity with the real environment. This is a major step towards providing a _local-first_ developer experience for Clouflare users, and is a perfect match for LocalStack's vision of giving developers back control over their local dev cycles.

## A sample application using Cloudflare Workers + AWS

Consider an illustrative sample of a Cloudflare Workers application that connects to the AWS Simple Queueing Service (SQS) to publish incoming messages to a queue. The sample is adapted from the [Cloudflare examples repository](https://github.com/cloudflare/workers-sdk/tree/main/templates/worker-aws), and the essential parts are summarized below (the complete source code of the sample is available in [this repository](https://github.com/localstack/localstack-extensions/tree/main/miniflare/example-aws)).

First, we define some imports and create the main fetch event listener for the Worker:

```js
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export default {
  async fetch(request) {
    return handleRequest(request);
  }
};
```

In the request handler below, we call a sendSqsMessage function, receive the result, and simply return the result back to the caller.

```js
async function handleRequest() {
   const result = await sendSqsMessage();
   return new Response(JSON.stringify(result), {
      headers: { 'content-type': application/json' },
   });
}
```

To allow the Worker to access an SQS resource, we first need to configure the credentials and region of the AWS SDK client - note that the code snippet below uses the global variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` which are later defined as secrets and are automatically injected into the environment.

```js
const myCredentialProvider = () => ({
   // use wrangler secrets to provide these variables
   accessKeyId: AWS_ACCESS_KEY_ID,
   secretAccessKey: AWS_SECRET_ACCESS_KEY,
});


const clientParams = {
  region: AWS_REGION,
  credentialDefaultProvider: myCredentialProvider,
};
```

The main business logic is happening in the sendSqsMessage function below: we first create an SQS client using the AWS JavaScript SDK, and we then create a `SendMessageCommand` request object and call the send API to send the message to SQS. Note that the SQS queue URL is retrieved from an environment variable `AWS_SQS_QUEUE_URL` which we’ll define further below.

```js
async function sendSqsMessage() {
   const client = new SQSClient(clientParams);
   const send = new SendMessageCommand({
      // use wrangler secrets to provide this global variable
      QueueUrl: AWS_SQS_QUEUE_URL,
      MessageBody: 'Hello SQS from a Cloudflare Worker',
   });
   return client.send(send);
}
```

Ok, so how can we now test this Cloudflare Workers + AWS application locally? In the following sections, we illustrate how it all comes together.

## Extending Miniflare with LocalStack’s Cloudflare Extension

Combining Miniflare’s capability with LocalStack’s cloud sandbox, which can be spun up as a Docker container, helps developers to get up and running with Workers development within a few seconds. This is particularly interesting for Cloudflare applications that are connecting to AWS services and resources, such as S3 buckets, SQS queues, or DynamoDB tables.

The figure below illustrates how Miniflare is embedded as an Extension into the LocalStack platform. Once enabled, the LocalStack Cloudflare Extension exposes an additional endpoint at `http://localhost:4566/miniflare` which provides an emulated version of the Cloudflare API, allowing users to create local services, script uploads, deployments — while additionally leveraging the full power of the LocalStack AWS emulator.

You can operate LocalStack’s Cloudflare extension via the `wrangler` CLI as the extension receives the deployment requests under the `/cloudflare/…` endpoint. Internally, the `miniflare`/`wrangler` process is started inside the LocalStack container and is accessible under a new local endpoint like `w1.cloudflare.localhost.localstack.cloud`. The client can use this endpoint to invoke the deployed Worker via the Web browser or an HTTP client like `cURL`.

## Testing our sample application using the LocalStack Cloudflare Extension

To test and run our sample application locally, we are adding a small change to the `clientParams` object above with a switch for local development: if the `ENV` is set to `dev`, then we set the AWS SDK endpoint to use the LocalStack APIs on `localhost:4566`.

```js
const clientParams = {...};
if (ENV === “dev”) {
  // define LocalStack endpoint for local testing
  clientParams.endpoint = "http://localhost:4566";
}
```

In the following, we describe the detailed installation steps to run the sample application locally.

### Install LocalStack Cloudflare Extension

To install the LocalStack Cloudflare Extension, we first install the `localstack` CLI on your development machine. To use Extensions with LocalStack, you must have an API key configured (you can [sign-up for a free trial](https://app.localstack.cloud/) to get your API key). Before installing the Extension, log in to your LocalStack account using your username and password:

```sh
$ localstack login
Please provide your login credentials below
Username: …
Password: …
```

After logging in into your LocalSack account, install the Extension using the following command:

```sh
$ localstack extensions install "git+https://github.com/localstack/localstack-extensions/#egg=localstack-extension-miniflare&subdirectory=miniflare"
```

After the installation of the LocalStack Cloudflare Extension, you can start the LocalStack container with your API key configured. Run the following command:

```sh
$ export LOCALSTACK_API_KEY=XXX
$ localstack start -d
```

### Set up the Wrangler application with LocalStack

To use the extension, we can simply use the [`wrangler`](https://github.com/cloudflare/workers-sdk) CLI after exporting the relevant environment variables `CLOUDFLARE_API_BASE_URL` and `CLOUDFLARE_API_TOKEN`, which cause wrangler to run the deployment requests against the LocalStack Cloudflare Extension. Let us set the following environment variables for local development:

```sh
$ export AWS_DEFAULT_REGION=us-east-1
$ export CLOUDFLARE_API_TOKEN=test
$ export CLOUDFLARE_API_BASE_URL=http://localhost:4566/miniflare 
$ wrangler init
```

Next, we create an SQS queue locally in LocalStack, using the [`awslocal`](https://github.com/localstack/awscli-local) command line interface (note that we’re extracting the queue URL from the output and assign it to the `queueUrl` variable):

```sh
$ queueUrl=$(awslocal sqs create-queue --queue-name q1 | jq -r .QueueUrl) 
```

We can now use wrangler to define the secrets, which will be automatically injected as environment variables in our script above. In the shell commands below, we are setting the values for the AWS credentials, the SQS queue URL, as well as the `ENV=dev` switch for local development.

```sh
$ echo "test" | wrangler secret put AWS_ACCESS_KEY_ID
$ echo "test" | wrangler secret put AWS_SECRET_ACCESS_KEY
$ echo "$queueUrl" | wrangler secret put AWS_SQS_QUEUE_URL
$ echo "dev" | wrangler secret put ENV
```

Now that everything is set up and configured, we can trigger the local deployment of our Worker application via the `wrangler publish` command:

```sh
$ wrangler publish
```

After a successful deployment, the local Cloudflare worker can be easily invoked via `cURL` - note that the `*.miniflare.localhost.localstack.cloud` DNS name resolves to a local IP address (`127.0.0.1`):

```sh
$ curl http://worker-aws.miniflare.localhost.localstack.cloud:4566/test
{
	"Messages": [{
        	"MessageId": "f76db8be-9cc8-47da-8918-9df686169712",
        	"ReceiptHandle": "NGUwNDg3NTM…",
        	"MD5OfBody": "58d3b165…",
        	"Body": "Hello SQS from a Cloudflare Worker"
    	}]
}
```

Congratulations! 🎉 If you see the output above, then the end-to-end roundtrip of invoking our Cloudflare Worker + AWS application has completed successfully. It is worth noting that no cloud credentials are required to run this sample, hence we are also not incurring any costs during development. Once the application is ready to deploy to production, we can easily make the switch and point `wrangler` to the real Cloudflare environment (by adjusting the environment secrets accordingly).

## Conclusion

With LocalStack Extensions, you can now leverage an end-to-end local development cycle for your Worker apps that empowers you to build, test, and deploy your applications reliably and efficiently. The LocalStack Cloudflare Extension allows you to create a locally reproducible environment that can be easily integrated into your CI/CD pipeline and execute integration tests and your production environment seamlessly. In addition, with your applications running in a sandbox environment, you will not incur significant costs while isolated from real cloud resources.

At LocalStack, we continue to invest in our Extensions mechanism and provide emulators that go beyond our core scope of running AWS apps locally — aiming to become the go-to platform for running emulators for any API or managed service out there! We would love to hear your thoughts and whether you have ideas for new LocalStack Extensions we could develop. Join our [Discuss Forum](https://discuss.localstack.cloud/) to get started and share your feedback and suggestions 🚀

If you have questions about configuring and running your project, drop by [Cloudflare’s Community Discord server](https://discord.com/invite/cloudflaredev) or the [LocalStack Slack Community](https://slack.localstack.cloud/)!
