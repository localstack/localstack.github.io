---
title: Announcing LocalStack 3.0 General Availability!
description: Announcing LocalStack 3.0 General Availability!
lead: Announcing LocalStack 3.0 General Availability!
date: 2023-11-13
lastmod: 2023-11-13
images: []
contributors: ["LocalStack Team"]
tags: ['news']
show_cta_1: true
---

## What’s new in LocalStack 3.0?

### New S3 provider

### New Step Functions provider

### New ElastiCache provider

We have introduced a **new ElastiCache provider** with better parity against AWS and resolves issues around the Redis cluster management in the previous provider. The new provider implements a dedicated Redis control plane to manage Redis instances in non-cluster mode and cluster mode. It also features new CRUD operations for the `CacheCluster` and `ReplicationGroup` resources which is critical for the Redis control plane.

These latest enhancements mark a significant step forward in our commitment to delivering a more robust and fine-tuned ElastiCache provider. The old ElastiCache provider is temporarily available in LocalStack v3 using `PROVIDER_OVERRIDE_ELASTICACHE=legacy` but we highly recommend migrating as soon as possible since we will drop support for this in LocalStack v4.

### New features for Chaos Engineering

### IAM Policy Streams

### Ephemeral Environments for LocalStack

We have launched **Ephemeral Instances**, which allows you to run a LocalStack sandbox in the cloud, instead of your local machine. This ephemeral environment is a short-lived, encapsulated deployment of LocalStack which will be terminated after 90 minutes. With these sandboxes, you can run your tests, preview features in your AWS-powered applications, and collaborate asynchronously within and across your team!

With Ephemeral Instances, you can use the same set of features that you use while running LocalStack locally, including the [Resource Browser](https://docs.localstack.cloud/user-guide/web-application/resource-browser/), [State Management (Cloud Pods)](), and [Extensions](https://docs.localstack.cloud/user-guide/extensions/)! While on your local machine, you can switch the [AWS Service Endpoint URL](https://docs.aws.amazon.com/general/latest/gr/rande.html) to point to the deployed sandbox URL to get started! Ephemeral Instances also allows you to generate an preview environment from GitHub Pull Request (PR) builds.

{{< img-simple src="localstack-ephemeral-environments.png" width=300 alt="Image of LocalStack Ephemeral environments with a LocalStack Sandbox running in the cloud">}}

Check out our [documentation]() on getting started with Ephemeral Instances.

### All-new LocalStack Desktop Application

We're excited to announce the release of the **LocalStack Desktop Application**, our cross-platform Desktop client for local cloud development & testing. The Desktop Application features an intuitive user interface, with local [Resource Browser](https://docs.localstack.cloud/user-guide/web-application/resource-browser/) for 30+ AWS services and a simplified way to manage LocalStack containers and logs. The new Desktop Application replaces the LocalStack Cockpit, streamlining the developer experience and making our cloud emulator tooling more accessible. [Download it for free and get started!](https://app.localstack.cloud/download).

{{< img-simple src="localstack-desktop-resource-browser.png" width=300 alt="Image of LocalStack Desktop Application showcasing the local AWS Resource Browsers">}}

Check out our [announcement blog](https://localstack.cloud/blog/2023-11-09-introducing-localstack-desktop-application-for-local-cloud-development-testing/) for more information.

### Multi-region and Multi-account support

### LocalStack Networking initiative

### Miscellaneous

## Get started with LocalStack 3.0

We have many LocalStack 3.0 resources for new and existing users. To learn more about the new functionalities and features of LocalStack 3.0, you can:

- View our [release notes on GitHub]().
- Navigate to our [Developer Hub](https://docs.localstack.cloud/developer-hub/) and try out sample applications to get started.
- Attend our [LocalStack Community Event](https://www.meetup.com/localstack-community/events/292576557/) to know more about the 3.0 release.

To get started with using LocalStack 3.0 features:

- Migrate to LocalStack 3.0 by following our [migration documentation](https://discuss.localstack.cloud/t/upcoming-changes-for-localstack-v3/576).
- Migrate your LocalStack networking configuration by following our [networking migration guide](https://discuss.localstack.cloud/t/networking-migration-guide-for-localstack-3-0/588).
- Connect with us on [LocalStack Discuss](https://discuss.localstack.cloud/) for feedback, bug reports, or suggestions.

## What’s next?
