---
title: LocalStack — 40K stars, 90M Pulls and an engaged community!
description: At LocalStack, we are aiming to propel cloud developer productivity by allowing development teams to quickly and conveniently develop & test their cloud applications directly in their local environments. Touching the milestone of over 40K GitHub Stargazers, 90M Docker Pulls and over a 11K+ strong community, further motivates us to provide the best possible cloud dev experience - giving developers back control over their environments for efficient development & testing loops!
lead: At LocalStack, we are aiming to propel cloud developer productivity by allowing development teams to quickly and conveniently develop & test their cloud applications directly in their local environments. Touching the milestone of over 40K GitHub Stargazers, 90M Docker Pulls and over a 11K+ strong community, further motivates us to provide the best possible cloud dev experience - giving developers back control over their environments for efficient development & testing loops!
date: 2022-04-22T10:34:04+05:30
lastmod: 2022-04-22T10:34:04+05:30
images: []
contributors: ["LocalStack Team"]
tags: ['news']
---

{{< img src="localstack-banner.png" >}}

[LocalStack](https://localstack.cloud) provides a local cloud development platform that simplifies developing, testing, and debugging cloud apps locally and across CI/CD. Our core emulation service which provides emulated LocalStack Cloud APIs (currently focused on [AWS cloud](https://aws.amazon.com/)), is shipped as a Docker image and is currently being used by a large and active open source community with over 100K active users worldwide.

We recently crossed 40,000 Stargazers over [GitHub](https://github.com/localstack/localstack) and hit a new milestone of over 90,000,000 [Docker pulls](https://hub.docker.com/r/localstack/localstack). Ever since our [last community-focussed blog](https://localstack.cloud/blog/2021-05-06-localstack-40k-stars/), our Slack community has grown to over 11,000+ developers who are actively using LocalStack and helping engineering teams build a consistent local development & test loop for cloud applications.

{{< img src="localstack-star-history.png" >}}

## What’s new in LocalStack?

Since our last community blog, we have published over 17 releases in a time period of 11 months. In this timeframe, we have released a number of new features, enhancements, bug fixes and more for a better cloud development experience.

In the past few months, we worked on a number of new enhancements:

- Improved performance & startup time (From 10 seconds to 1 second).
- New plugin system, enhanced request routing.
- Multi-arch build (including ARM64 / Apple M1).
- Advanced persistence support.
- Refurbished Web user interface & Desktop Application.

We now also feature a lot of services which are aimed at shaping the next-gen software team collaboration patterns for LocalStack. Some of these include:

- Compute services (e.g., Lambda, ECS, EKS) 
- Databases (e.g., DynamoDB, RDS) 
- Messaging (e.g., SQS, Kinesis, MSK) 
- Sophisticated/exotic APIs (e.g., QLDB, Athena, Glue)

Our supported integrations now cover a wide range of tools from the cloud development ecosystem. Whether you are using Infrastructure-as-Code (IaC) to manage your AWS infrastructure, or are developing applications using AWS SDKs like Boto, LocalStack now supports your local workflow runs independently.

{{< img src="localstack-integrations.png" >}}

Our LocalStack Pro SaaS platform now also covers a new Web User interface with a practical usage dashboard and a resource browser (console) that allows you to inspect the state of your locally deployed resources. Take it for a run on [app.localstack.cloud](https://app.localstack.cloud/) and visualize your LocalStack usage through a Web interface.

{{< img src="localstack-web-dashboard.png" >}}

We have also invested in improving the developer experience and the usability of LocalStack through our [open-sourced documentation](https://github.com/localstack/docs). You can navigate to [docs.localstack.cloud](https://docs.localstack.cloud/) and check out the various services, integrations, tools and guides that can help you understand LocalStack and start developing on it!

## What’s next in LocalStack?

The main use cases and motivations our customers and users mention for leveraging LocalStack services, include:

- Increased agility / efficiency through local development (reproducibility, speed & ease → higher quality).
- Operating in a regulated environment with restricted access to Cloud.    
- Rapidly experimenting without the risk of breaking production and with reduced management overhead.    
- Involving new devs and remote teams without giving access to the real cloud.    
- Cost savings, as compared to real cloud environment.

To support new AWS features, we are working on:

-  Compute services (e.g., Lambda, ECS/ECR, EKS, AppSync, StepFunctions)
-  Databases (e.g., S3, RDS, DynamoDB, ElastiCache, QLDB, NeptuneDB, Aurora Serverless, TimestreamDB, ...)
-  Data Processing (e.g., Athena, EMR, Glue, Glacier, Batch, Kinesis Data Analytics)
-  Ingest & Messaging (e.g., API Gateway, CloudFront, SQS, SNS, Kinesis, EventBridge, MSK)
-  Authentication & User management (e.g., Cognito, IAM, STS, SecretsManager, Amplify)
-  Monitoring (e.g., CloudWatch, XRay, CloudTrail)

To further support team collaboration, the next exciting product we are pushing forward are the LocalStack Cloud Pods. With Cloud Pods you can now take a persistent snapshot of your LocalStack instance and share it with your team members. With branching and versioning features, you can treat your cloud environment similar to your Git-based workflows: take a snapshot of your LocalStack instance, tear down and start up LocalStack with the same application state ingested, and collaborate with your team members on your own application state or across your CI pipeline.

{{< img src="localstack-ci-analytics.png" >}}

We are supporting seamless integrations across your CI/CD systems and LocalStack is compatible with all major CI providers like GitHub Actions, TravisCI, CircleCI, GitLab CI and Jenkins. Soon you will also be able to sync the state and test data from production directly into your development/CI environments. Development teams can then  capitalize on the Local Cloud Pods storage backend by pushing or pulling the application state and collaborating with team members on the shared state.

We now also feature beta releases of the LocalStack Cockpit as well as our new CI Time Travel Analytics product, which allows you to visualize your CI runs directly in your browser. The [LocalStack Cockpit](https://localstack.cloud/products/cockpit/) brings a Desktop experience for managing your LocalStack instance to your local machine. In the Cockpit, you can inspect the service status, debug logs, define configuration profiles and much more! Try it out by downloading LocalStack Cockpit!

{{< img src="localstack-cockpit.png" >}}

## Building the LocalStack Community

While we focus on engineering the LocalStack core, we also aim to give our ever-growing community all the support they need! Our LocalStack Slack community has grown to over 11,000+ developers from all parts of the world, who are engaging with LocalStack to facilitate a great cloud development experience across their teams!

To better support our LocalStack Pro users, we offer the LocalStack Pro Support Application in our community, which is designed to facilitate private 1:1 conversations between our Pro users and our technical team for resolution of your technical issues. Open-source users can send in questions over the `#community-support` channel in our LocalStack Slack community or create an issue over the LocalStack GitHub repository.

At LocalStack, we have put forward a 100% commitment to open source code, and support academic, student, or open source projects and non-profit/philanthropic organizations. We are very proud to have launched the LocalStack Pro Educational License plan, that supports educators and students in exploring local cloud development without the headache of spending on real cloud resources! 

With the LocalStack GitHub repository touching 40,000+ stars, we also aim to support new contributors in the community. In the past six months, we have onboarded over 25 new contributors, who are either a part of the LocalStack Development team or have submitted voluntary contributions! We aim to support this further and help more and more developers contribute towards our goal of a growing open-source community!

## The games should continue

At LocalStack, we are rapidly growing and we will be further sharing upcoming updates on our social handles and our blog! To get on the rocket-ship, check out our careers page or drop a star on our GitHub repository and tune in the notifications! 

We are also always actively looking to get your feedback and would highly appreciate if you could take out five minutes to fill in this [feedback form](https://form.typeform.com/to/REn2U10O), and help us prioritize and focus on the main pain points you want us to tackle for making cloud development a breeze for you!

Let’s make cloud development fun again!
