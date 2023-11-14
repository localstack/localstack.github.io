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

The new native S3 implementation, introduced in version [`2.3.2`](https://github.com/localstack/localstack/releases/tag/v2.3.2), is now the default S3 provider in LocalStack 3.0. The key features include better parity with AWS features, enhanced performance, improved persistence support, and reduced memory usage for large object uploads/downloads and multipart uploads. The provider brings advanced support for AWS-specific features such as bucket versioning, pagination in `List` operations, precondition headers, S3 Object Lock and Legal Hold, and default Bucket Encryption settings.

S3 is a core AWS service, and undertaking our own implementation was crucial to further improve the parity of our services with AWS. We have also improved performance, with some massive upgrades for some operations including:

- An approximate 10% increase in throughput for operations like `PutObject`, `DeleteObject`, `GetObject`, and `HeadObject` with small files (1 KB to 100 KB), and a 30% increase for 10 MB files.
- A 2.5 times throughput boost for `ListObjectsV2` and a 16 times increase for `ListObjectVersions`.
-  A 33% throughput improvement in multipart uploads.

Check out our [S3 documentation]() for more information.

### New Step Functions provider

### New ElastiCache provider

We have introduced a **new ElastiCache provider** with better parity with AWS and resolves issues around the Redis cluster management in the previous provider. The new provider implements a dedicated Redis control plane to manage Redis instances in non-cluster mode and cluster mode. The new provider will be extended in the future to test automatic failover, snapshotting, scaling replication groups, and more features.

These latest enhancements mark a significant step forward in our commitment to delivering a more robust and fine-tuned ElastiCache provider. The old ElastiCache provider is temporarily available in LocalStack v3 using `PROVIDER_OVERRIDE_ELASTICACHE=legacy` but we highly recommend migrating as soon as possible since we will drop support for this in LocalStack v4.

### New features for Chaos Engineering

### IAM Policy Stream on Web Application

In application development, accessing AWS resources like S3 buckets and RDS databases is common. To grant access, we create IAM roles and attach policies that specify permissions. However, determining the correct permissions can be challenging, often leading developers to assign excessive permissions to IAM roles. To address this, LocalStack introduced the IAM Policy Stream. This tool simplifies identifying the necessary permissions for cloud applications and helps detect logical errors.

We have expanded the IAM Policy Stream feature to be accessible directly through the Web Application, in addition to the existing CLI feature. This enhancement will display the specific policy generated for each API call in the new interface, simplifying permission management and eliminating concerns about assigning correct permissions.

The features available include:

1.  A real-time list of calls and the corresponding policies they generate.
2.  A real-time summary policy that combines all individual policies into a single comprehensive policy.
3.  The option to enable or disable this feature during runtime, allowing for performance optimization as needed.
4.  The ability to reset the stream, enabling a fresh start with a new set of policies.
5.  The capability to use all the above features simultaneously across multiple instances.

{{< img-simple src="localstack-IAM-policy-stream.png" width=300 alt="Image of LocalStack ">}}

Check out our [documentation]() and [video]() on getting started with the IAM Policy Stream.

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

Multi-account and multi-region support within LocalStack has been continuously enhanced through incremental updates. We've completely reworked the way services interact with each other internally, significantly broadening our support for IAM enforcement in inter-service integrations. This structural change is pivotal in advancing our multi-account and multi-region capabilities.

Several providers, including the new StepFunctions provider, CloudWatch, EventBridge, Glue, and more, have seen improvements in their multi-account and multi-region awareness. Notably, SQS is now inherently compatible with multi-accounts, thanks to the introduction of a new default URL endpoint strategy.

In addition, there has been a significant revamp in the way ARNs are constructed internally. This change is particularly beneficial for users working with LocalStack in scenarios involving non-default account IDs or regions. It ensures the generation of more accurate ARNs, aligning closely with real-world AWS environments and enhancing the overall user experience with LocalStack.

### LocalStack Networking initiative

### Miscellaneous

## Get started with LocalStack 3.0

We have many LocalStack 3.0 resources for new and existing users. To learn more about the new functionalities and features of LocalStack 3.0, you can:

- View our [release notes on GitHub]().
- Navigate to our [Developer Hub](https://docs.localstack.cloud/developer-hub/) and try out sample applications to get started.
- Attend our [LocalStack Community Event]() to know more about the 3.0 release.

To get started with using LocalStack 3.0 features:

- Migrate to LocalStack 3.0 by following our [migration documentation](https://discuss.localstack.cloud/t/upcoming-changes-for-localstack-v3/576).
- Migrate your LocalStack networking configuration by following our [networking migration guide](https://discuss.localstack.cloud/t/networking-migration-guide-for-localstack-3-0/588).
- Connect with us on [LocalStack Discuss](https://discuss.localstack.cloud/) for feedback, bug reports, or suggestions.

## What’s next?
