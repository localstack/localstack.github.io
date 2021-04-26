---
title: "Change log"
description: "Change log of LocalStack."
date: 2021-04-26T19:01:19+02:00
lastmod: 2021-04-26T19:01:19+02:00
draft: false
images: []
menu:
  docs:
    parent: "documentation"
weight: 99
toc: true
---

## Change Log

The following list contains a summary of the LocalStack Pro features included in each release. The version numbers below refer to the image tags of the `localstack/localstack` Docker image.

* `0.11.2`: Initial support for AWS Transfer API; add basic initial support for CodeCommit API; add support for multi-account setups; add support for EC2 VMs under Linux; fix S3 Select queries for JSON documents; improve APIs for listing/deleting images in ECR; minor fixes and enhancements for AKS, Athena, Cognito, and EKS
* `0.11.1`: Initial support for QLDB API with ledgers, tables, and mutation/selection queries; enhance implementation of Cognito MFA configs
* `0.11.0`: Add support for S3 Select over JSON/CSV documents; initial version of Glacier API; refactor and improve DNS/edge servers; add AppSync DynamoDB resolver functions; enhance implementation of IoT MQTT broker; add support for Cognito username aliases
* `0.10.9`: Initial version of Athena UI; add/improve support for Cognito triggers; improve stability and create single Docker image for EMR/Athena; initial version of CloudTrail API; initial version of S3 file browser and CloudWatch logs browser in UI; add support for RDS/Lambda data sources in AppSync; various CloudFormation improvements; add missing AppSync schema scalar types; add RDS Aurora Data API; initial version of ECR service
* `0.10.8`: Support for AppSync message subscriptions via WebSockets; initial version of SES UI in Web app; add `AUTOSTART_UTIL_CONTAINERS` and `LOCAL_DNS_NAME_PATTERNS` configurations; enhancements in Athena API and integration with Hive metastore; enhanced persistence support for SQS/SNS; initial version of EC2 VMs in VirtualBox
