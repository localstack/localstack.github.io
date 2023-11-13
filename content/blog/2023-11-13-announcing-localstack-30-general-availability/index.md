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

We have introduced a new ElastiCache provider with better parity against AWS and resolves issues around the Redis cluster management in the previous provider. The new provider implements a dedicated Redis control plane to manage Redis instances in non-cluster mode and cluster mode. It also features new CRUD operations for the `CacheCluster` and `ReplicationGroup` resources which is critical for the Redis control plane.

These latest enhancements mark a significant step forward in our commitment to delivering a more robust and fine-tuned ElastiCache provider. The old ElastiCache provider is temporarily available in LocalStack v3 using `PROVIDER_OVERRIDE_ELASTICACHE=legacy` but we highly recommend migrating as soon as possible since we will drop support for this in LocalStack v4.

### New features for Chaos Engineering

### IAM Policy Streams

### Ephemeral Environments for LocalStack

### All-new LocalStack Desktop Application

We're excited to announce the release of the LocalStack Desktop Application, our cross-platform Desktop client for local cloud development & testing. The Desktop Application features an intuitive user interface, with local Resource Browser for 30+ AWS services and a simplified way to manage LocalStack containers and logs. The new Desktop Application replaces the LocalStack Cockpit, streamlining the developer experience and making our cloud emulator tooling more accessible. [Download it for free and get started!](https://app.localstack.cloud/download).

{{< img-simple src="localstack-desktop-resource-browser.png" width=300 alt="Image of LocalStack Desktop Application showcasing the local AWS Resource Browsers">}}

Check out our [announcement blog](https://localstack.cloud/blog/2023-11-09-introducing-localstack-desktop-application-for-local-cloud-development-testing/) for more information.

### Multi-region and Multi-account support

### LocalStack Networking initiative

### Miscellaneous

## Get started with LocalStack 3.0

## What’s next?
