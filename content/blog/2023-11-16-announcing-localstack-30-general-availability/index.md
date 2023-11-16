---
title: Announcing LocalStack 3.0 General Availability!
description: We are excited to announce the release of LocalStack 3.0 featuring enhanced AWS services, Chaos Engineering tools, IAM Policy Stream, Desktop Application, improved performance and more!
lead: We are excited to announce the release of LocalStack 3.0 featuring enhanced AWS services, Chaos Engineering tools, IAM Policy Stream, Desktop Application, improved performance and more!
date: 2023-11-16
lastmod: 2023-11-16
images: ['localstack-3.0.png']
contributors: ["LocalStack Team"]
tags: ['news']
show_cta_1: true
leadimage: 'localstack-3.0.png'
weight: 1
---

{{< img-simple src="localstack-3.0.png" >}}

Today, we are excited to announce **LocalStack 3.0**, our latest major release towards empowering developers with a high-fidelity local cloud development & testing experience. Earlier this year, we unveiled [LocalStack 2.0](https://localstack.cloud/blog/2023-03-29-announcing-localstack-2.0-general-availability/), which brought forth a host of new features and improvements, along with better integration with the AWS tooling ecosystem. With the 3.0 release, we're doubling down on our promise to boosting developer productivity and tackling the issues that often slow down cloud software development and delivery workflows — specifically, simplifying onboarding and eliminating the inefficiencies that lead to prolonged dev&test cycles. Additionally, this release represents a significant milestone in our journey as we move beyond traditional cloud emulation, and introduce innovative features that promise to reshape the way developers construct resilient cloud applications.

Whether you’re a LocalStack user or just getting started on your cloud development journey, we have a lot of exciting features to share with you! With LocalStack, you can now:

- Test disaster recovery simulations such as region failover, DNS failover, and service failures.
- Explore and progressively tighten security around IAM policies as your application takes shape.
- Create ephemeral cloud sandboxes for testing your infrastructure locally or on CI pipelines.
- Activate analytics for LocalStack in CI runs to get insights into your infrastructure test runs.
- Utilize enhanced, faster AWS services such as S3, Step Functions, DynamoDB and ElastiCache.
- Get started with a fully-local developer environment with the new LocalStack Desktop Application.

And much more! LocalStack makes it easy to build & test local-first cloud applications, all while improving the **inner dev loop**. We are excited to share our recent developments in this release, and discuss how you can get started with them!

## What’s new in LocalStack 3.0?

In previous releases, we supplemented our cloud emulation capabilities with parity, performance, and interoperability. In LocalStack 3.0, our core areas of focus has been — **resilience**, **efficiency**, and **flexibility**. With LocalStack, we aim to power your local development productivity and cover the most sophisticated enterprise use cases. Collectively, the new features in the release won't just cut away your slow *code → deploy → test → redeploy → ...* loops, but also help your team to confidently ship faster and more secure cloud applications. You can explore *all* the new features by upgrading your LocalStack setup or downloading LocalStack 3.0 today! [Get your free LocalStack account](https://app.localstack.cloud/sign-up).

Let's take a look at our latest release's new features and enhancements to see how you can get the most out of them!

* [New S3 provider](#new-s3-provider)
* [New Step Functions provider](#new-step-functions-provider)
* [New ElastiCache provider](#new-elasticache-provider)
* [New features for Chaos Engineering](#new-features-for-chaos-engineering)
* [IAM Policy Stream on Web Application](#iam-policy-stream-on-web-application)
* [Ephemeral Environments for LocalStack](#ephemeral-environments-for-localstack-beta) (**Beta**)
* [CI Analytics for LocalStack](#ci-analytics-for-localstack-beta) (**Beta**)
* [All-new LocalStack Desktop Application](#all-new-localstack-desktop-application)
* [Multi-region and Multi-account support](#multi-region-and-multi-account-support)
* [LocalStack Networking initiative](#localstack-networking-initiative)
* [Miscellaneous](#miscellaneous)

### New S3 provider

The **new native S3 implementation**, introduced in version [`2.3.0`](https://discuss.localstack.cloud/t/localstack-release-v2-3-0/533/1), is now the default S3 provider in LocalStack 3.0. The new S3 provider offers improved parity with AWS features, significantly enhanced performance and persistence support, and reduced memory usage for large object uploads/downloads and multipart uploads. The provider brings advanced support for AWS-specific features such as bucket versioning, pagination in `List` operations, precondition headers, S3 Object Lock and Legal Hold, and default Bucket Encryption settings.

S3 is a core AWS service, and undertaking our own implementation was crucial to further improve the parity of our services with AWS. We have also improved performance, with some massive upgrades for some operations including:

- An approximate 10% increase in throughput for operations like `PutObject`, `DeleteObject`, `GetObject`, and `HeadObject` with small files (1 KB to 100 KB), and a 30% increase for 10 MB files.
- A 2.5 times throughput boost for `ListObjectsV2` and a 16 times increase for `ListObjectVersions`.
-  A 33% throughput improvement in multipart uploads.

Check out our [S3 documentation](https://docs.localstack.cloud/user-guide/aws/s3/) for more information.

### New Step Functions provider

We're excited to announce a new native implementation of Step Functions, featuring several enhancements and additional capabilities compared to the previous provider. This update significantly expands support, including extended handling of timeouts and heartbeats, state machine versioning, Map states, and integration with EventBridge. It also includes support for the latest set of Intrinsic Functions. A major focus of this update is the improved API parity with AWS Step Functions, aligning more closely with its functionalities.

Our commitment to enhancing the Step Functions implementation continues. In the upcoming months, users can expect further exciting additions such as express workflows, expanded service integrations, and activity support, among others. The adoption of this new native implementation streamlines our ability to introduce new features and address issues in Step Functions more efficiently than ever before.

Check out our [Step Functions documentation](https://docs.localstack.cloud/user-guide/aws/stepfunctions/) and [Discuss post](https://discuss.localstack.cloud/t/new-stepfunctions-implementation-in-localstack-3-0/593) for more information.

### New ElastiCache provider

We have introduced a **new ElastiCache provider** with significantly improved AWS parity and resolving issues around the Redis cluster management in the previous provider. The new provider implements a dedicated Redis control plane to manage Redis instances in non-cluster mode and cluster mode. The new provider will be extended in the future to test automatic failover, snapshotting, scaling replication groups, and more features.

These latest enhancements mark a significant step forward in our commitment to delivering a more robust and fine-tuned ElastiCache provider. The old ElastiCache provider is temporarily available in LocalStack v3 using `PROVIDER_OVERRIDE_ELASTICACHE=legacy` but we highly recommend migrating as soon as possible since we will drop support for this in LocalStack v4.

### New features for Chaos Engineering

Chaos engineering is a practice focused on improving system resilience by intentionally introducing disruptions. To support this, we're introducing a new **Chaos Engineering** dashboard in the LocalStack [Web Application](https://app.localstack.cloud). This feature allows users to conduct fault injection experiments within their application stack. The dashboard offers various Fault Injection Simulator (FIS) experiment options, such as:

- Disrupt a percentage of all incoming requests and return 500 errors instead.
- Disrupt a percentage of requests made against a specific region.
- Simulate the complete outage of a specific region.
- Introduce latency to all API calls to simulate network service degradations.

{{< img-simple src="localstack-chaos-engineering-dashboard.png" width=300 alt="Image of LocalStack Chaos Engineering dashboard">}}

Additionally, we have introduced user guides for various scenarios, including simulating unexpected outages using the [LocalStack Outage Extension](), implementing [Route53 Failover with FIS](), and configuring error probabilities in [Kinesis]() & [DynamoDB]().

These resources are designed to help users effectively respond to such scenarios, facilitating the development of thorough disaster recovery plans. By using these tools, teams can prepare to sustain stability and efficiency even in challenging situations. Check out our [documentation]() for more information.

### IAM Policy Stream on Web Application

In application development, accessing AWS resources like S3 buckets and RDS databases is common. To grant access, we create IAM roles and attach policies that specify permissions. However, determining the correct permissions can be challenging, often leading developers to assign excessive permissions to IAM roles. To address this, LocalStack introduced the **IAM Policy Stream**. This tool simplifies identifying the necessary permissions for cloud applications and helps detect logical errors.

We have expanded the IAM Policy Stream feature to be accessible directly through the Web Application, in addition to the existing CLI feature. This enhancement will display the specific policy generated for each API call in the new interface, simplifying permission management and eliminating concerns about assigning correct permissions.

The features include:

1.  A real-time list of calls and the corresponding policies they generate.
2.  A real-time summary policy that combines all individual policies into a single comprehensive policy.
3.  The option to enable or disable this feature during runtime, allowing for performance optimization as needed.
4.  The ability to reset the stream, enabling a fresh start with a new set of policies.

{{< img-simple src="localstack-IAM-policy-stream.png" width=300 alt="Image of LocalStack IAM Policy Stream dashboard">}}

Check out our [documentation]() and [video]() on getting started with the IAM Policy Stream.

### Ephemeral Environments for LocalStack (**Beta**)

We have launched **Ephemeral Instances**, which allows you to run a LocalStack sandbox in the cloud, instead of your local machine. This ephemeral environment is a short-lived, encapsulated deployment of LocalStack which will be terminated after 90 minutes. With these sandboxes, you can run your tests, preview features in your AWS-powered applications, and collaborate asynchronously within and across your team!

With Ephemeral Instances, you can use the same set of features that you use while running LocalStack locally, including the [Resource Browser](https://docs.localstack.cloud/user-guide/web-application/resource-browser/), [State Management (Cloud Pods)](), and [Extensions](https://docs.localstack.cloud/user-guide/extensions/)! While on your local machine, you can switch the [AWS Service Endpoint URL](https://docs.aws.amazon.com/general/latest/gr/rande.html) to point to the deployed sandbox URL to get started! Ephemeral Instances also allows you to generate an preview environment from GitHub Pull Request (PR) builds.

{{< img-simple src="localstack-ephemeral-environments.png" width=300 alt="Image of LocalStack Ephemeral environments with a LocalStack Sandbox running in the cloud">}}

Check out our [documentation]() on getting started with Ephemeral Instances. The feature is in private beta, and you can reach out to us to get early access!

### CI Analytics for LocalStack (**Beta**)

We're excited to introduce **CI Analytics**, a new feature for comprehensive state browsing and analysis of historical continuous integration (CI) builds. This feature integrates into your LocalStack CI workflow, offering insights and supporting our goal to enhance the cloud developer experience throughout the software development lifecycle (SDLC). With CI Analytics, you can collect, analyze, and visualize critical metrics from your software CI pipelines, helping you understand the impact of cloud infrastructure changes on CI builds. It facilitates root cause analysis for build failures, supports data-driven decisions for continuous improvement, and more.

CI Analytics combines a number of existing features in the LocalStack platform, such as [Cloud Pods]() & [Stack Insights](), and provides a unified view of the state of your LocalStack resources across CI builds. The features include:

- **CI Project Runs**: This gives you a consolidated view of all CI builds for a specific project.
- **Log Output**: You can view detailed log output for individual CI builds.
- **Request/Response Traces**: This feature provides traces of requests and responses, including details of the AWS service and operation, along with expandable request and response payloads.
- **Cloud Pod State**: It allows you to view the state of LocalStack resources for a particular CI build through a Cloud Pod, which can be injected locally or loaded in an Ephemeral Instance.
- **Stack Insights**: This offers a view and audit log of interactions, API error codes in your application stack over time, and enables you to drill down into the most commonly used services and API calls.

{{< img-simple src="localstack-ci-analytics.png" width=300 alt="Image of LocalStack CI Analytics dashboard">}}

Check out our [documentation]() on getting started with CI Analytics. The feature is in private beta, and you can reach out to us to get early access!

### All-new LocalStack Desktop Application

We're excited to announce the release of the **LocalStack Desktop Application**, our cross-platform Desktop client. The Desktop Application features an intuitive user interface, with local [Resource Browser](https://docs.localstack.cloud/user-guide/web-application/resource-browser/) for 30+ AWS services and a simplified way to manage LocalStack containers and logs. The new Desktop Application replaces the LocalStack Cockpit, streamlining the developer experience and making our cloud emulator tooling more accessible. [Download it for free and get started!](https://app.localstack.cloud/download).

{{< img-simple src="localstack-desktop-resource-browser.png" width=300 alt="Image of LocalStack Desktop Application showcasing the local AWS Resource Browsers">}}

Check out our [announcement blog](https://localstack.cloud/blog/2023-11-09-introducing-localstack-desktop-application-for-local-cloud-development-testing/) for more information.

### Multi-region and Multi-account support

**Multi-account** and **multi-region support** within LocalStack has been continuously enhanced through incremental updates. We've completely reworked the way services interact with each other internally, significantly broadening our support for IAM enforcement in inter-service integrations. This structural change is pivotal in advancing our multi-account and multi-region capabilities.

Several providers, including the new Step Functions provider, CloudWatch, EventBridge, Glue, and more, have seen improvements in their multi-account and multi-region awareness. Notably, SQS is now inherently compatible with multi-accounts, thanks to the introduction of a new default URL endpoint strategy.

In addition, there has been a significant revamp in the way ARNs are constructed internally. This change is particularly beneficial for users working with LocalStack in scenarios involving non-default account IDs or regions. It ensures the generation of more accurate ARNs, aligning closely with real-world AWS environments and enhancing the overall user experience with LocalStack.

### LocalStack Networking initiative

Over the past few years, LocalStack's configuration options have expanded to accommodate a wide range of use cases, particularly in networking configuration. This includes setting up the listen address for the LocalStack container and configuring domain names for services like SQS or OpenSearch. 

However, this expansion resulted in an excess of configuration variables, some of which were redundant or overlapping in functionality. Additionally, there was inconsistency in how these variables were used across different services — some services relied on one set of variables, while others used different ones, and some didn't support configuration adjustments at all.

To simplify and standardize this process, LocalStack 2.0 introduced two new configuration variables: `GATEWAY_LISTEN` and `LOCALSTACK_HOST`. Building on this, LocalStack 3.0 further standardizes configuration across all LocalStack services. As part of this update, we have eliminated several older configuration variables, including `EDGE_PORT`, `EDGE_PORT_HTTP`, `EDGE_BIND_HOST`, `LOCALSTACK_HOSTNAME`, and `HOSTNAME_EXTERNAL`, streamlining the configuration experience and enhancing overall usability.

View our [Networking migration guide](https://discuss.localstack.cloud/t/networking-migration-guide-for-localstack-3-0/588) for more details!

### Miscellaneous

- We're introducing a simplified method for managing team licenses. Instead of activating LocalStack with API keys, we're shifting to the use of **Auth Tokens**. This approach facilitates the assignment of licenses to users without necessitating changes to their environment setup. Read our [documentation]() for more information.
- We’ve massively **improved write performance for DynamoDB** in LocalStack, with our benchmarks showing a 60% faster [`PutItem`](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) operation. Using higher batch sizes will profit even more from this change, with [`BatchWriteItem`](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) now being 6.2x faster for 10 items and 9.9x faster for 25 items. That means if you’re populating a large DynamoDB table, you can now take advantage of much faster insertion times! For the best performance please set `DYNAMODB_IN_MEMORY=1`, but even without this, you should still notice a significant performance improvement.
- To limit which services can be started by LocalStack, we have (re-)introduced the concept of **Strict Service Loading**, where only the services defined in the `SERVICES` variable, are going to be started. This also lays the foundation for us to provide standalone images for single services or combinations thereof.
- We’re also currently in the progress of internally refactoring our CloudFormation resource implementations to be more in parity with AWS and also structurally easier for us and contributors to work with. If you’re interested in contributing, [please reach out to us](mailto:info@localstack.cloud)! 

If you want to know more check out the [detailed release notes on GitHub]()!

## Get started with LocalStack 3.0

We have many LocalStack 3.0 resources for new and existing users. To learn more about the new functionalities and features of LocalStack 3.0, you can:

- View our [release notes on GitHub]().
- Navigate to our [Developer Hub](https://docs.localstack.cloud/developer-hub/) and try out sample applications to get started.
- Attend our [LocalStack Community Event]() to know more about the 3.0 release.

To get started with using LocalStack 3.0 features:

- Migrate to LocalStack 3.0 by following our [migration documentation](https://discuss.localstack.cloud/t/upcoming-changes-for-localstack-v3/576).
- Migrate your LocalStack networking configuration by following our [networking migration guide](https://discuss.localstack.cloud/t/networking-migration-guide-for-localstack-3-0/588).
- Connect with us on [LocalStack Discuss](https://discuss.localstack.cloud/) for feedback, bug reports, or suggestions.

LocalStack 3.0 would not have been possible without the invaluable support, community discussions, and bug reports we've received via our GitHub Issues and Discuss posts. We'd like to thank all our dedicated users who are driving forward our vision for a new era where building & testing cloud applications locally is the norm. 

## What’s next?

As we continue to push out new features in our platform & toolings, the fundamental goal remains the same: *Bringing the individual developer back in by empowering them and making things less complicated!* All while keeping the **developer experience**, **product quality**, and **user feedback** at the forefront of our efforts. Your active participation has been the bedrock of our progress!

Thank you for your support and welcome to LocalStack 3.0!

