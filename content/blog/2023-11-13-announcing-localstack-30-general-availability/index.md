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

### Ephemeral Environments

### All-new LocalStack Desktop Application

### Multi-region and Multi-account support

### LocalStack Networking initiative

### Miscellaneous

## Get started with LocalStack 3.0

## What’s next?
