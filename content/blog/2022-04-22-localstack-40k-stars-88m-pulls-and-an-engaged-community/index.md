---
title: LocalStack — 40K stars, 88M Pulls and an engaged community!
description: At LocalStack, we are aiming to revolutionize cloud service emulation to help you develop & test your cloud applications locally. Touching the milestone of over 40K GitHub Stargazers, 88M Docker Pulls and over a 11K+ strong community, further motivates us to provide the best possible cloud dev experience - giving developers back control over their development & testing loops!
lead: At LocalStack, we are aiming to revolutionize cloud service emulation to help you develop & test your cloud applications locally. Touching the milestone of over 40K GitHub Stargazers, 88M Docker Pulls and over a 11K+ strong community, further motivates us to provide the best possible cloud dev experience - giving developers back control over their development & testing loops!
date: 2022-04-22T10:34:04+05:30
lastmod: 2022-04-22T10:34:04+05:30
images: []
contributors: ["LocalStack Team"]
tags: ['news']
---

LocalStack provides a cloud emulation platform that simplifies developing, testing, and debugging cloud apps locally and across CI/CD. Our core emulation service which provides emulated LocalStack Cloud APIs, currently focused on AWS cloud, shipped as a Docker image, is currently being used by a large and active open source community with over 100K active users worldwide.

We recently crossed 40,000 Stargazers over GitHub and hit a new milestone of over 88,000,000 Docker pulls. Ever since our last community-focussed blog, our Slack community has grown to over 11,000+ developers who are actively using LocalStack and helping engineering teams build a consistent local development & test loop for cloud applications.

{{< img src="localstack-star-history.png" >}}

## What’s new in LocalStack?

Since our last community blog, we have had over 17 releases spanning a time period of over 11 months. In this timeframe, we have released a number of new features, enhancements, bug fixes and more that helps you drive you to a better cloud development experience.

In the past few months, we worked on a number of new enhancements:

- Improved performance & startup time (From 10s to 1s)
- New plugin system, enhanced request routing.
- Multi-arch build (incl. ARM64 / Apple M1).
- Advanced persistence support.
- Refurbished Web user interface & Desktop Application.

We now also feature a lot of services which aims to shape the next-gen software team collaboration patterns for LocalStack. Some of these include:

- Compute services (e.g., Lambda, ECS, EKS) 
- Databases (e.g., DynamoDB, RDS) 
- Messaging (e.g., SQS, Kinesis, MSK) 
- Sophisticated/exotic APIs (e.g., QLDB, Athena, Glue)

Our range of integrations now  a wide range of tools from the cloud development ecosystem. Whether you are using Infrastructure-as-Code (IaC) to manage your AWS infrastructure, or are developing applications using AWS SDKs like Boto, LocalStack now supports your local workflow runs independently.

{{< img src="localstack-integrations.png" >}}

For our LocalStack SaaS as part of our Pro offering, we have innovated in a new Web User interface with a simple usage dashboard and a simplified AWS console. Take it for a run on app.localstack.cloud and visualize your LocalStack usage through a Web interface.

{{< img src="localstack-web-dashboard.png" >}}

We have also invested in improving the developer experience and the usability of LocalStack through our open-sourced documentation. You can navigate to docs.localstack.cloud and check out the various services, integrations, tools and guides that can help you understand LocalStack and start developing on it!

## What’s next in LocalStack?

While talking to our customers and users at LocalStack, we realize that they are mostly driven by the following motivation:

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

To further support this, we are now working on the LocalStack Cloud Pods. With Cloud Pods you can now take a persistent snapshot of your LocalStack instance and share it with your team members. With features like branching, versioning, you can treat your cloud environment similar to your Git-based workflow to collaboratively take a snapshot of your entire LocalStack instance, tear down and start up LocalStack with the same application state.

{{< img src="localstack-ci-analytics.png" >}}

We are also looking forward to support seamless integration with the CI/CD systems, where we can sync state and test data from production into the development/CI environment. It will also help the developers to capitalize on the Local Cloud Pods Storage Backend where application state can be pushed or pulled easily and easy collaboration can be made possibly by shared state. LocalStack is now also compatible with all major CI providers like GitHub Actions, TravisCI, CircleCI, GitLab CI and Jenkins.

We now also feature the beta release of our CI Time Travel Analytics and LocalStack Cockpit. While the CI analytics allow you to visualize your CI runs from your browser, the LocalStack Cockpit brings a Desktop experience of managing your LocalStack instance. Through Cockpit, you can inspect the service status view, debug logs, define configuration profiles and more! Try it out by downloading LocalStack Cockpit!

{{< img src="localstack-cockpit.png" >}}

## Building the LocalStack Community

While we focus on engineering the LocalStack core, we also aim to support our ever-growing community with all the support they need! LocalStack Slack community has grown to over 11,000+ developers from all parts of the world, currently engaging in using LocalStack to build a great cloud development experience!

To support our LocalStack Pro users, we now have the LocalStack Pro Support Bot, which is designed to be used in private conversations for 1:1 resolution of your problem. If you are an open-source user, you can send in your query over the `#community-support` channel or create an issue over the LocalStack GitHub repository.

At LocalStack, we have put forward a 100% commitment to open source code, and support academic, student, or open source projects and non-profit/philanthropic organizations. To further support this, we launched the LocalStack Educational License plan, that supports educators and students to work on local cloud development without spending significantly on real cloud resources! 

With the LocalStack GitHub repository touching 40,000+ stars, we also aim to support new contributors in the community. In the past six months, we have onboarded more than 25 new contributors, who are either a part of LocalStack Developers or have submitted voluntary contributions! We aim to support this further and help more and more developers contribute towards our goal of a growing open-source community!

## The games should continue

At LocalStack, we are actively growing and we will be further sharing the upcoming updates on our social handles and our blog! To be a part of the rocket-ship, check out our careers page or drop a star on our GitHub repository and tune in the notifications! 

We are also actively looking for feedback from our users and customers on our 40K feedback! Take out five minutes to fill up this form really quick, to steer the future of our focus in making cloud development easier for you!

Let’s make cloud development fun again!
