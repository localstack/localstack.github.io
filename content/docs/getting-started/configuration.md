---
title: "Configuration"
description: "Configuration options for LocalStack"
lead: ""
date: 2021-06-25T12:58:30+02:00
lastmod: 2021-06-25T12:58:30+02:00
draft: false
images: []
menu: 
  docs:
    parent: "getting-started"
weight: 30
toc: false
---

For a list of general configuration options for LocalStack, please refer to the [README in the public Github repo](https://github.com/localstack/localstack).

Additionally, LocalStack Pro provides the following configurations that can be set as environment variables:
* `DNS_ADDRESS`: IP address that the local DNS server should be bound to (default: `0.0.0.0`). Can be configured to avoid port clashes in case a DNS server is already running on `localhost` port `53`. Set to `0` or `false` to avoid exposing DNS port altogether.
* `DNS_RESOLVE_IP`: IP address that AWS hostnames should resolve to for transparent execution mode (default: `127.0.0.1`). If your code is running in Docker, this should be configured to resolve to the Docker bridge network address, e.g., `DNS_RESOLVE_IP=172.17.0.1`.
* `DNS_SERVER`: fallback DNS server used to resolve non-AWS DNS names (default: `8.8.8.8`).
* `DNS_LOCAL_NAME_PATTERNS`: Comma-separated list of regex patterns for DNS names to resolve locally (e.g., `'.*cloudfront\.net'`). Can be used to whitelist certain host names to resolve to local endpoints, while resolving any non-matching AWS host names to their real DNS entries.
* `CLOUDFRONT_STATIC_PORTS`: Whether to use separate ports for each CloudFront distribution (e.g., `localhost:4511`) instead of locally resolvable hostnames (e.g., `abc123.cloudfront.net`). Can be useful in case you prefer not to use the local DNS server.
* `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`/`SMTP_EMAIL`: The SMTP configuration (host, username, password, and sender address) to use when sending automated test emails in the platform (e.g., to send Cognito signup confirmation codes)
* `ENFORCE_IAM`: Whether to enforce IAM security policies when processing client requests (default: `false`)
* `AUTOSTART_UTIL_CONTAINERS`: Whether to automatically start up utility containers (e.g., Spark/Hadoop for EMR, Presto for Athena)
* `DISABLE_EVENTS`: Flag to disable sending of anonymized usage events (default: `false`). (Note that this will disable the Web dashboard and any analytics features.)
* `SERVICE_INSTANCES_PORTS_START`-`SERVICE_INSTANCES_PORTS_END`: Start and end ports for service instances being created, e.g., WebSocket APIs, RDS instances, etc (default: `4510`-`4530`).
