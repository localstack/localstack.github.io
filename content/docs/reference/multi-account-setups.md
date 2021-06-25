---
title: "Multi-Account Setups"
description: ""
lead: ""
date: 2021-06-25T18:28:40+02:00
lastmod: 2021-06-25T18:28:40+02:00
draft: false
images: []
menu: 
  docs:
    parent: "reference"
weight: 999
toc: true
---

Unlike the open source LocalStack, which uses a single hardcoded account ID (`000000000000`), the Pro version allows to use multiple instances for different AWS account IDs in parallel.

In order to set up a multi-account environment, simply configure the `TEST_AWS_ACCOUNT_ID` to include a comma-separated list of account IDs. For example, use the following to start up LocalStack with two account IDs:
```
$ TEST_AWS_ACCOUNT_ID=000000000001,000000000002 SERVICES=s3 localstack start
```

You can then use `AWS_ACCESS_KEY_ID` to address resources in the two separate account instances:
```
$ AWS_ACCESS_KEY_ID=000000000001 aws --endpoint-url=http://localhost:4566 s3 mb s3://bucket-account-one
make_bucket: bucket-account-one
$ AWS_ACCESS_KEY_ID=000000000002 aws --endpoint-url=http://localhost:4566 s3 mb s3://bucket-account-two
make_bucket: bucket-account-two
$ AWS_ACCESS_KEY_ID=000000000001 aws --endpoint-url=http://localhost:4566 s3 ls
2020-05-24 17:09:41 bucket-account-one
$ AWS_ACCESS_KEY_ID=000000000002 aws --endpoint-url=http://localhost:4566 s3 ls
2020-05-24 17:09:53 bucket-account-two
```

Note that using an invalid account ID should result in a 404 (not found) error response from the API:
```
$ AWS_ACCESS_KEY_ID=123000000123 aws --endpoint-url=http://localhost:4566 s3 ls
An error occurred (404) when calling the ListBuckets operation: Not Found
```

**Note:** For now, the account ID is encoded directly in the `AWS_ACCESS_KEY_ID` client-side variable, for simplicity. In a future version, we will support proper access key IDs issued by the local IAM service, which will then internally be translated to corresponding account IDs.
