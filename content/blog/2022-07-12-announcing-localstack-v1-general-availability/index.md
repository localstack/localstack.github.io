---
title: Announcing LocalStack 1.0 General Availability!
description: Announcing LocalStack 1.0 General Availability!
lead: Announcing LocalStack 1.0 General Availability!
date: 2022-07-12T11:00:55+05:30
lastmod: 2022-07-12T11:00:55+05:30
images: []
contributors: ["LocalStack Team"]
tags: ['news']
---

Today, we are excited to announce the general availability of LocalStack 1.0. This major release is a significant milestone towards our vision to propel developer productivity - by allowing dev teams to quickly and conveniently develop & test their cloud applications locally and across the CI/CD pipeline.

LocalStack 1.0 is available with our Docker image, shipped for both our Community and Pro users, as well as all users of our newly introduced Team product tier. LocalStack's core emulation platform provides emulated cloud APIs, currently primarily focused on AWS cloud. It is presently being used by a large and active open source community with over 100K active users worldwide. With various features for individual productivity and team collaboration, we provide a comprehensive ecosystem of local AWS services, integrations and tools to make cloud development a breeze.

With LocalStack 1.0, we mark the first milestone of LocalStack's mission to become the go-to platform for local cloud development. We have spent the last year significantly re-shaping the codebase to make it easier to introduce and extend AWS services, improving parity with AWS, introducing mechanisms to monitor parity, adding new Pro features and introducing a completely new Team tier focused on cross team collaboration. This blog looks at what's new in LocalStack and what it means for our community and users.

## What’s new in LocalStack?

LocalStack started as an open-source project in August 2016, with the initial commit adding support for eight-core AWS APIs, including API Gateway, Lambda, DynamoDB, and a few others. With the v1 release, we now support over 80 services distributed across our community and pro versions as well as a number of advanced team collaboration features in our new product tier to power your local development and testing productivity and better cover your use-cases ranging from individual needs to wide enterprise use-cases.

A 1.0 release for LocalStack is a significant milestone for us after over 1,000,000 PyPI downloads and over 100,000,000 Docker pulls. LocalStack now satisfied the requirements we laid out in our previous blog to fix the broken cloud software development model. LocalStack currently operates with greater interoperability with the real AWS cloud, provides stability to our APIs and protocols, introduces new ways of reporting parity with AWS, persistence support and much more!

These features include:

### New Pro and Team Features

-   Polished Cloud Pods experience
-   Revamp of multi-account setups (experimental)
-   Introducing Extensions (experimental)
-   IAM enforcement for all services
-   Detailed stack analytics

### Community Features and Major Changes

-   New filesystem hierarchy with simplified configuration
-   Full rollout of the AWS Server Framework (ASF)
-   A framework for testing, analyzing, and reporting parity with AWS
-   All new logging output and error reporting
-   Improved persistence support

### Polished Cloud Pods experience

Cloud Pods are persistent snapshots of your application state that can be easily stored, versioned, shared, and injected into your instance. This enables entirely new ways to collaborate and interact with LocalStack - from bootstrapping a CI/CD environment with predefined test state, to collaborative debugging of application state with your team members.

We have significantly reworked the cloud pods experience, which now supports convenient handling of state files, fully integrated storage and versioning, as well as merging of cloud pod state into your running LocalStack instance.

### Revamp of multi-account setups

LocalStack now ships with a revamped multi-accounts system. This allows multi-tenant setups on a single LocalStack instance, with resources namespaced based on AWS account IDs. Previously we we had to start up one LocalStack instance per account, which has now been drastically simplified and will reduce resource consumption. The new system requires minimal configuration on the LocalStack-side, and you can enable the feature setting MULTI_ACCOUNTS=1. You can find more details about the current state and limitations in our [documentation](https://docs.localstack.cloud/tools/multi-account-setups/).

### Introducing Extensions

We are introducing [LocalStack Extensions](https://github.com/localstack/localstack-extensions/), which allow users to extend and customize LocalStack using pluggable Python distributions. An extension is a Python application that runs together with LocalStack in the LocalStack container. The extension API allows you to hook into different lifecycle phases of LocalStack and execute custom code, or modify LocalStack’s HTTP gateway with custom routes and server-side code. You can find the API reference of the extensions API, and examples of extensions in our [localstack-extensions](https://github.com/localstack/localstack-extensions/) repository.

Use cases for extensions include:

-   Starting custom services together with LocalStack in the same container (see our [LocalStack Stripe example](https://github.com/localstack/localstack-extensions/tree/main/stripe))
-   Instrumenting AWS requests with additional information before they reach your Lambdas (see [case study with Thundra](https://localstack.cloud/blog/2021-09-16-test-monitoring-for-localstack-apps/))
-   Logging AWS API calls to custom data backends
-   ... and much more!

### IAM enforcement for all services

LocalStack now supports IAM enforcement for all supported AWS services! In addition to that, you can expect more parity regarding the required actions for requests, and our Explainable IAM feature will tell you which declarations are missing from your policies! IAM enforcement can be activated with ENFORCE_IAM=1. You can find more information in our [IAM documentation](https://docs.localstack.cloud/aws/iam/).

### Detailed stack analytics

As part of an upcoming Team feature we call “Stack Insights”, we have instrumented LocalStack to report AWS API usage telemetry of LocalStack runs to your LocalStack Team account. We can now show you which APIs you are using, which clients of your integrations use particular services and API operations, and which services cause the most API errors, and more. No sensitive data of your stacks are collected! Over the next weeks we will be rolling out new UI features to give you fine-grained access to this data.

> Note: You can disable all type of event logging by starting LocalStack with `DISABLE_EVENTS=1`.

### New filesystem hierarchy with simplified configuration

We are introducing the _LocalStack volume_ as a unified volume mount directory in the LocalStack container.

Previous versions of LocalStack had multiple directory configurations that were a frequent source of problems. We have worked to unify the experience, and have revamped the filesystem hierarchy used inside the LocalStack container. You can find a [detailed explanation in our documentation](https://docs.localstack.cloud/localstack/filesystem/).

Simply mount any directory from your host into the LocalStack volume path `/var/lib/localstack`. The CLI uses by default your system’s cache directory `<cache>/localstack/volume`. All LocalStack state, extensions, logs, or third-party packages are stored in the volume. You no longer need to define `TMPDIR`, `HOST_TMP_PATH`, or `DATA_DIR`. See the [How to migrate](https://github.com/localstack/localstack/issues/6398) section of the release notes for more details.

### Full rollout of the AWS Server Framework (ASF)

Over the past six months we have significantly reworked the LocalStack codebase to generalize and unify the way we implement AWS service providers. ASF is a server-side framework that works directly with the AWS API specifications, which drastically reduces the number of protocol-related issues in LocalStack. ASF enables lots of new features that were previously not possible, such as LocalStack Extensions, or testing, analyzing, and reporting parity with AWS.

### A framework for testing, analyzing, and reporting parity with AWS

LocalStack’s mission is to provide a cloud sandbox that behaves exactly as AWS, and we strive towards having the highest possible parity with AWS. When you are testing your application against LocalStack, you should be able to trust that it behaves just as it would behave in the real cloud environment and vice versa. 

To facilitate the continuous improvement of parity, we have developed new tools that improve our internal QA process and allow us to communicate better the current parity level with AWS. Integration tests now have the option to use custom snapshots, allowing developers to cover more API surface area when testing for parity with the cloud, than ever before. 

Tracking metrics that describe API coverage and quality of parity allows us to monitor and improve continuously, enabling new use cases and ultimately leading to a better experience when using LocalStack.

### All new logging output and error reporting

We have completely revamped the logging output and error reporting of LocalStack.

AWS requests are now logged uniformly in the `INFO` log level (set by default or when `DEBUG=0`). The shape is `AWS <service>.<operation> => <http-status> (<error type>)`. Requests to HTTP endpoints are logged in a similar way.

```shell
2022-07-12T10:12:03.250  INFO --- [   asgi_gw_0] localstack.request.aws     : AWS s3.PutObject => 404 (NoSuchBucket)
2022-07-12T10:12:11.295  INFO --- [   asgi_gw_0] localstack.request.aws     : AWS s3.CreateBucket => 200
2022-07-12T10:12:13.159  INFO --- [   asgi_gw_1] localstack.request.aws     : AWS s3.PutObject => 200
2022-07-12T10:12:28.761  INFO --- [   asgi_gw_0] localstack.request.http    : GET /_localstack/health => 200
```

If you want access to detailed log output, including the input and output of requests, you can start LocalStack with `LS_LOG=trace`, which will provide the same log format, but append the request and response objects, as well as the HTTP headers to the log line.

When `DEBUG=1` is enabled, errors inside LocalStack are now reported to the client in full. When writing issue reports, these stack traces help LocalStack contributors to better triage your issues.

### Improved persistence support

We are introducing an enhanced persistence mechanism that allows you to preserve your state across LocalStack container restarts (available in the Pro version).

In the past, there used to be a naive persistence implementation based on record&replay of API calls. This mechanism had several conceptual flaws and was hence deprecated in version. The all-new persistence experience is much more performant and more reliable.

The main change from a user perspective: we used to configure `DATA_DIR` to point to a persistent local directory, but with our new filesystem hierarchy (see above) you can now simply configure `PERSISTENCE=1` in your LocalStack environment to enable persistence, and the data will be automatically stored on disk (by default inside `<cache>/localstack/volume`).

## Get started with LocalStack 1.0

We have many LocalStack 1.0 resources for new and existing users. To learn more about the new functionalities and features of LocalStack 1.0 you can:

-   View our release notes on [GitHub](https://github.com/localstack/localstack/issues/6398).
-   Check out our new [documentation](https://docs.localstack.cloud) on using services and integrations locally.
-   Attend our [LocalStack Community Event Meetup](https://www.meetup.com/localstack-community/) to discuss the 1.0 release!

To get started with using LocalStack 1.0 features:

-   Migrate to LocalStack 1.0 by following our [How to Migrate documentation](https://github.com/localstack/localstack/issues/6398).
-   Navigate to our [LocalStack samples](https://github.com/localstack/localstack-pro-samples) and try out the examples.
-   Reach out to us on [discussion pages](https://discuss.localstack.cloud) for any feedback, bug report or suggestion.

We are thankful to our community and our users for providing a lot of suggestions, feedback, and bug reports through GitHub Issues and our Slack community. It would not have been possible without all the support that we have got and we are thankful for that!

## What's next?

LocalStack's mission is to become the standard platform for local cloud development.
We are planning to branch out to new cloud providers, while also solidifying the AWS developer experience.
Next to the continuous increase in parity with AWS, here are some of things you can expect in the upcoming months:

* Additional Cloud Pods functionality
* Advanced analytics capabilities for enterprise customers
* Improved developer tools for building LocalStack extensions
* Better IAM support and tools to develop and test IAM policies

Stay tuned!
