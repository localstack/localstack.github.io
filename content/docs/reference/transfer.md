---
title: "Transfer"
description: ""
pro: true
lead: ""
date: 2021-06-25T18:06:06+02:00
lastmod: 2021-06-25T18:06:06+02:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 999
toc: true
---

The AWS Transfer API provides the ability to create FTP(S) servers to make files in S3 buckets accessible directly via FTP.

A simple example using AWS Transfer is included in [this Github repository](https://github.com/localstack/localstack-pro-samples/tree/master/transfer-ftp-s3). The sample creates an FTP server via the Transfer API locally, uploads two files via FTP to S3, and then finally downloads the files from the target S3 bucket.

**Note:** The Transfer API does not provide a way to return the endpoint URL of created FTP servers. Hence, in order to determine the server endpoint, the local port is encoded as a suffix in the `ServerId` attribute, using the pattern `s-<id>:<port>`. For example, assume the following is the response from the `CreateServer` API call, then the FTP server is accessible on port `4511` (i.e., `ftp://localhost:4511`):
```
{
    "ServerId": "s-73c53daf86da4:4511"
}
```
