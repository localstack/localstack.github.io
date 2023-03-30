---
title: Announcing LocalStack 2.0 General Availability!
description: We are excited to announce the release of LocalStack 2.0 that brings new features, greater AWS parity, and better performance!
lead: We are excited to announce the release of LocalStack 2.0 that brings new features, greater AWS parity, and better performance!
date: 2023-03-29T9:35:38+05:30
lastmod: 2023-03-29T9:35:38+05:30
images: []
contributors: ["LocalStack Team"]
tags: ['news']
leadimage: "localstack-v2-cover.jpg"
weight: 1
---

{{< img-simple src="localstack-v2-cover.jpg" >}}

Last year we announced the [general availability of LocalStack 1.0](https://localstack.cloud/blog/2022-07-13-announcing-localstack-v1-general-availability/), our first major release, to help development teams propel their productivity by developing & testing their cloud applications locally! Between then and now, LocalStack has achieved significant adoption and amassed over 135 million Docker pulls and thousands of new customers worldwide! As we continue to execute our vision of making LocalStack the go-to platform for local cloud development, we are excited to announce our latest major release!

Today we are excited to announce the general availability of **LocalStack 2.0**, our next-generation cloud emulation platform, focused on providing a better way to develop and test your cloud applications. This release is significant for us, as it expands our scope of building a frictionless, integrated cloud developer experience for our users. LocalStack 2.0 is our second major release with many new features, enhancements, and improved parity for more extensive integration across the AWS tooling ecosystem.

With the 2.0 release, LocalStack offers the most comprehensive local cloud development platform that enables our users and customers to continue boosting their individual productivity and team collaboration. As we continue to build on the feedback and deliver value for our community and users, we look forward to seeing the local cloud development paradigm adopted en masse to give developers back control over their environments. In this blog, we will look at what’s new in LocalStack 2.0, highlight new features and enhancements, and discuss how you can get the most out of them!

## What’s new in LocalStack 2.0?

LocalStack 2.0 delivers our strong investment across three  critical areas — **parity**, **performance**, and **interoperability** to provide the best developer experience. With LocalStack 2.0, we have significantly optimized the internals of the platform and moved to new service implementations, images, and internal toolings to make it easy for developers to build & test their cloud applications locally! LocalStack 2.0 is an exciting leap forward in our mission to make local cloud development possible, and we recommend you try out our new features and share your feedback with us!

Let us take a look at our new features and enhancements, and what you can benefit from when using our latest release!

* [Completely new Lambda and S3 provider]({{< ref "#new-lambda--s3-provider" >}})
* Significant reduction in LocalStack container image size through [separation of LocalStack communtiy & LocalStack Pro docker images]({{< ref "#separation-of-community--pro-image" >}})
* New [Snapshot persistence mechanism]({{< ref "#new-snapshot-persistence-mechanism" >}})
* [Community Cloud Pods]({{< ref "#support-for-community-cloud-pods" >}})
* [Cloud pods launchpad]({{< ref "#cloud-pods-launchpad" >}})
* [Mono container support for Big Data services]({{< ref "#mono-container-support-for-big-data-services" >}})
* [Simplified Host configuration and Docker Networking]({{< ref "#simplified-host-configuration-and-docker-networking" >}})
* [New features for the LocalStack Web Application]({{< ref "#new-features-for-the-localstack-web-application" >}})
* [Improved LocalStack toolings for local cloud development]({{< ref "#improved-localstack-toolings-for-local-cloud-development" >}})
* [All-new LocalStack Developer Hub &amp; Tutorials]({{< ref "#all-new-localstack-developer-hub--tutorials" >}})
* [Improved LocalStack Coverage Docs Overview]({{< ref "#improved-localstack-coverage-docs-overview" >}})
* [Cross Service IAM Enforcement]({{< "#cross-service-iam-enforcement" >}})

### New Lambda & S3 provider

LocalStack has made significant improvements around having an active parity with AWS. To push forward on this, we have entirely rewritten our [Lambda](https://docs.localstack.cloud/references/lambda-provider-v2/) & [S3](https://docs.localstack.cloud/user-guide/aws/s3/) providers, which feature significant performance improvements that would allow testing your cloud applications faster!

The new Lambda provider has significantly decreased execution times, from 800 - 1000ms from the old `docker` executor to around 10ms for a simple Lambda invocation with an Echo function. The new Lambda provider has a new [Lambda API](https://docs.localstack.cloud/references/lambda-provider-v2/#lambda-api), [Docker Execution Environment](https://docs.localstack.cloud/references/lambda-provider-v2/#docker-execution-environment), [Configuration](https://docs.localstack.cloud/references/lambda-provider-v2/#configuration), and [Hot Reloading](https://docs.localstack.cloud/references/lambda-provider-v2/#hot-reloading).

Previously, Lambdas were executed within the LocalStack container. With the new provider, official AWS images are pulled that match the Lambda production environment as closely as possible. We have also enabled functions to be created asynchronously and added stricter input validation for your Lambda functions.

The new S3 provider is now faster, more stringent, and compatible with AWS behavior. From a user perspective, you can see better performance, especially for S3 notifications, which are asynchronous now. The new S3 & Lambda providers with a significant AWS parity will make your serverless experience a breeze with LocalStack. You can find more information about them on our S3 & Lambda documentation.

### Separation of Community & Pro image

With the 2.0 release, our Pro & Team customers need to migrate to our new LocalStack Pro image ([`localstack/localstack-pro`](https://hub.docker.com/r/localstack/localstack-pro)). Community users are not affected by this change, as they can continue using the open-source community image ([`localstack/localstack`](https://hub.docker.com/r/localstack/localstack)). This separation solves a critical circular dependency between the community version of LocalStack and our proprietary LocalStack Pro extensions. If you use an API key and continue using the community image to activate the Pro extensions, you will see an error message.

This separation of the Community & Pro image has significantly reduced our image size. The image size for the Community image has dropped from 775 MB to ~320 MB, while for the Pro image, it has dropped from 750 MB to ~570 MB. From a developer perspective, it has allowed us to shed away a lot of legacy code and build on new infrastructure. It will allow our development process to be more efficient due to this change and allow us to deliver more value to our users through this going forward.

You can find more details about migrating to a new image in our [Discuss post](https://discuss.localstack.cloud/t/separating-localstack-community-and-pro-containers/236).

### New Snapshot Persistence mechanism

We are introducing a new snapshot persistence mechanism which introduces behavioural changes when data is restored and saved. Snapshots allowed you to preserve your state across LocalStack Pro container restarts. We have introduced ways to configure the ways how and when snapshots are saved and loaded.

Previously, the only option was to load snapshots from disk per service when services were initialized, lazy-loading the state the first time a service was used. With the new persistence mechanism, persistent data is loaded on LocalStack startup. Users can configure it by setting `SNAPSHOT_LOAD_STRATEGY` to `on_request or on_startup`.

We also discovered that creating a snapshot for a particular service on each request leads to problems related to concurrency and performance. To fix this, we have introduced an alternative approach to store snapshots on LocalStack shutdown, which produces no performance overhead during runtime but will not protect you against data loss if LocalStack does not terminate correctly.
For saving snapshots, the default strategy is on a scheduled basis. Specifically, we take snapshots of services that have changed every 15 seconds and on shutdown. You can configure this behaviour by setting `SNAPSHOT_SAVE_STRATEGY` to `on_request`, `on_shutdown` or `scheduled`, respectively.
You can find more information on our [Persistence documentation](https://docs.localstack.cloud/references/persistence-mechanism/). 


### Support for Community Cloud Pods

Cloud Pods are persistent state snapshots that enable next-generation state management and team collaboration features in LocalStack. With Cloud Pods, you can take a snapshot of your LocalStack container state at any time and selectively restore, merge, and inject it into your instance. With LocalStack 1.0, we released Cloud Pods for our Team tier to handle state files, storage and versioning, and merging of cloud pod state. We have now made [Cloud Pods available to the Community edition](https://docs.localstack.cloud/user-guide/tools/cloud-pods/community/) to allow users to create persistent snapshots and store it locally or in a Git repository.

The layout of Cloud Pods has been changed, and Cloud Pods created with v1.x.x may be incompatible with LocalStack 2.0. Check out our [Cloud Pods documentation](https://docs.localstack.cloud/user-guide/tools/cloud-pods/) for more information.

### Cloud Pods launchpad

We have released the Cloud Pods launchpad, a simple application to to share and inject cloud pods directly from your repositories or via a URL. 
Simply include the official LocalStack launchpad badge, which you can get from our [badge generator](https://app.localstack.cloud/launchpad), in your READMEs.

<div class='d-flex justify-content-center'>
{{< img-simple src="badge.png" style="max-width: 866; max-height: 244px;" >}}
</div>

Everyone that clicks on the badge will be redirected to our launchpad, where they will be able to inject the linked pod into their LocalStack instance.
<div class='d-flex justify-content-center'>
    {{< img-simple src="launchpad.png" style="max-width: 662px; max-height: 558px;" >}}
</div>

Find out more about our Cloud Pods launchpad on our [official documentation](https://docs.localstack.cloud/user-guide/tools/cloud-pods/launchpad/).

### Mono container support for Big Data services

We have introduced an all-new Mono container mode for our Big Data services (Glue, EMR, Athena). Previously, this feature was behind a feature flag, and now it would be the default behaviour. The previous implementation with a separate sidecar `localstack_bigdata` container is deprecated and will be removed in a future release. With the Mono container mode, some dependencies are lazily downloaded and installed at runtime, increasing the processing time on the first load. The library is cached in the `var_libs` directory. We also provide a separate `localstack/localstack-pro:2.0.0-bigdata` Mono container image with the default dependencies pre-installed.

### Simplified Host configuration and Docker Networking

We have introduced several enhancements and features to simplify our host configuration. The variables `HOSTNAME_EXTERNAL` and `LOCALSTACK_HOSTNAME` have been unified into `LOCALSTACK_HOST`, which allows the configuration of hostnames returned by LocalStack more consistently.

If provided, this variable is used systematically throughout services that return URLs to access created resources, such as OpenSearch clusters, SQS queues, or RDS databases. We are also unifying the variables `EDGE_BIND_HOST`, `EDGE_PORT` and `EDGE_PORT_HTTP` into `GATEWAY_LISTEN`, which will allow configuration of the addresses and ports the LocalStack process listens on.

You can find out more about this in our [migration guide](https://discuss.localstack.cloud/t/upcoming-changes-for-localstack-v2/239#networking-7).

We have also spent time improving our documentation on networking are happy to present a new [networking troublehsooting](https://docs.localstack.cloud/references/network-troubleshooting/) guide. Based on feedback from the community, we have enumerated different networking scenarios LocalStack is often used in, and created a comprehensive guide on how to configure the specific scenario.

Check out [our extensive documentation](https://docs.localstack.cloud/tags/networking/) on connecting your application code to LocalStack.

{{< img-simple src="network-troubleshooting.png" >}}

### New features for the LocalStack Web Application

We have overhauled the [LocalStack Web Application](app.localstack.cloud) with an immediate focus on improving the user interface and experience. The LocalStack Web Application now features an improved sign-up flow, API key and subscription management, and a getting started section. 

We have also polished the UI/UX for managing resources in our Resource Browser, for which we have also added support for Glue, SES v2, RDS Clusters, and Lambda Layers, bringing up the number of supported services to 28!

{{< img-simple src="resource-browser.png" >}}

### Improved LocalStack toolings for local cloud development

Over the past few months, we have introduced & improved LocalStack Tools to make your life as a cloud developer easier. These include:

- [LocalStack Docker Extension](https://docs.localstack.cloud/user-guide/tools/localstack-docker-extension/) that enables developers working with LocalStack to operate their LocalStack container via Docker Desktop. It includes checking service status, container logs, and configuring profiles.
- [LocalSurf](https://docs.localstack.cloud/user-guide/tools/localsurf/), a Chrome browser plugin to repoint AWS service calls to LocalStack. LocalSurf enables the browser to connect to the local endpoint (`http://localhost:4566`) instead of the AWS production servers (`*.amazonaws.com`).
- An improved [Lambda Hot Reloading experience](https://docs.localstack.cloud/user-guide/tools/lambda-tools/hot-reloading/) that continuously applies code changes to Lambda functions without manual redeployment. Users can use Hot Reloading with AWS CLI, Terraform, CDK, and Serverless framework for fast feedback cycles during the development & testing of Lambda functions.

### All-new LocalStack Developer Hub & Tutorials

We have launched the [Developer Hub](https://docs.localstack.cloud/developer-hub/), a new Web experience enabling developers to find up-to-date LocalStack samples spanning various use cases: Serverless, Containers, Big Data, Identity, and much more! The Developer Hub offers a consolidated view of [LocalStack sample applications](https://docs.localstack.cloud/applications) that educate developers to build and run cloud and serverless applications. With additional [tutorials](https://docs.localstack.cloud/tutorials), we strive to keep the gap between LocalStack and AWS as small as possible and focus on getting users, step by step, started with LocalStack!

The Developer Hub is currently in beta and available on our [documentation website](https://docs.localstack.cloud/developer-hub/).
We are increasingly improving our sample applications' quality and service coverage while actively seeking user feedback.
In the future, we would like to expand this concept to include explainer videos, lab environments, broader code samples, and more blog posts, making it the resource go-to for our community.

{{< img-simple src="developer-hub-collage.png" >}}

### Improved LocalStack Coverage Docs Overview

Our documentation has a new style for the [LocalStack Coverage](https://docs.localstack.cloud/references/coverage/). Each service has a dedicated coverage page, and we also included a search field to make navigation easier.

The coverage pages provide detailed information regarding the supported operations in LocalStack. The coverage page also displays details on how these operations are tested and covered by our integration test suits.

{{< img-simple src="coverage_docs_screenshot.png" >}}

### Cross Service IAM Enforcement

Our IAM Enforcement, activated using `ENFORCE_IAM=1`, now has the ability to enforce internal requests between services. This exciting feature makes it easier for you to debug your IAM policies and enables LocalStack to provide clear feedback for internal and external requests that are denied due to missing permissions.

We've made some important changes to the way that resource-based permissions are evaluated when a request is made. As a result, both external and cross-service requests will now be evaluated correctly, ensuring that your IAM policies are respected across the board.

## Get started with LocalStack 2.0

We have many LocalStack 2.0 resources for new and existing users. To learn more about the new functionalities and features of LocalStack 2.0, you can:

<!-- TODO: update release notes link -->
- View our [release notes on GitHub](https://github.com/localstack/localstack/issues/7882).
- Check out our [new documentation](https://docs.localstack.cloud) on using [services](https://docs.localstack.cloud/user-guide/aws/feature-coverage/) and [integrations](https://docs.localstack.cloud/user-guide/integrations/) locally.
- Attend our [LocalStack Community Event](https://www.meetup.com/localstack-community/events/292576557/) to learn more about the 2.0 release.

To get started with using LocalStack 2.0 features:

- Migrate to LocalStack 2.0 by following our [migration documentation](https://discuss.localstack.cloud/t/upcoming-changes-for-localstack-v2/239).
- Navigate to our [LocalStack samples](https://github.com/localstack/localstack-pro-samples) & [Developer Hub](https://docs.localstack.cloud/developer-hub) and try the examples and applications, respectively.
- Contact us on [discussion pages](https://discuss.localstack.cloud/) for feedback, bug reports, or suggestions.

LocalStack 2.0 could not have been possible without active user feedback, community discussions, and bug reports we received through our GitHub Issues and Discuss posts. We're proud to see that community continues to grow, and in the last year, we have seen tremendous growth, and this has been made possible by our users, who continue to propel our dream of a new era of local cloud development & testing, enabled by LocalStack's cloud emulation platform.

## What’s next?

TODO
