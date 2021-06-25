---
title: "Local DNS Server"
description: ""
lead: ""
date: 2021-06-25T18:24:58+02:00
lastmod: 2021-06-25T18:24:58+02:00
draft: false
images: []
menu: 
  docs:
    parent: "reference"
weight: 999
toc: true
---

LocalStack Pro supports transparent execution mode, which means that your application code automatically accesses the LocalStack APIs on `localhost`, as opposed to the real APIs on AWS. In contrast, the community (open source) edition requires the application code to configure each AWS SDK client instance with the target `endpoint URL` to point to the respective ports on `localhost` (see list of default ports [here](https://github.com/localstack/localstack)).

When the system starts up, the log output contains the IP address of the local DNS server. Typically, this address by default is either `0.0.0.0` (see example below) or `200.200.55.55`.
```
Starting DNS servers (tcp/udp port 53 on 0.0.0.0)...
```

In order to use transparent execution mode, the system needs to be configured to use the predefined DNS server. The DNS configuration depends on the operating system: in Mac OS it can be configured in the Network System Settings, under Linux this is usually achieved by configuring `/etc/resolv.conf` as follows:
```
nameserver 0.0.0.0
```
The example above needs to be adjusted to the actual IP address of the DNS server. You can also configure a custom IP address by setting the `DNS_ADDRESS` environment variable (e.g., `DNS_ADDRESS=200.200.55.55`).

**Note:** Please be careful when changing the network configuration on your system, as this may have undesired side effects.

**Note**: When you configure transparent execution mode, you may still have to configure your application's AWS SDK to **accept self-signed certificates**. This is a technical limitation caused by the SSL certificate validation mechanism, due to the fact that we are repointing AWS domain names (e.g., `*.amazonaws.com`) to `localhost`. For example, the following command will fail with an SSL error:
```
$ aws kinesis list-streams
SSL validation failed for https://kinesis.us-east-1.amazonaws.com/ [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self signed certificate (_ssl.c:1076)
```
... whereas the following command works:
```
$ PYTHONWARNINGS=ignore aws --no-verify-ssl kinesis list-streams
{
    "StreamNames": []
}
```
Disabling SSL validation depends on the programming language and version of the AWS SDK used. For example, the [`boto3` AWS SDK for Python](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html#boto3.session.Session.client) provides a parameter `verify=False` to disable SSL verification. Similar parameters are available for most other AWS SDKs.
