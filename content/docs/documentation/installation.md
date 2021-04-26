---
title: "Installation"
description: "Installing and configuring LocalStack."
lead: "LocalStack is easy to install and highly configurable."
date: 2021-04-26T19:01:19+02:00
lastmod: 2021-04-26T19:01:19+02:00
draft: false
images: []
menu:
  docs:
    parent: "documentation"
weight: 90
toc: true
---

## Prerequisites

* **Docker**: The recommended way of installing LocalStack is using Docker
* **Python**: Required to install the `localstack` command-line interface (CLI)

## Installation

The easiest way to install LocalStack is via `pip`:

```
pip install localstack
```

You can then list the available commands:
```
localstack --help
```

**Note:** If the command `localstack` is not available after successfully installing the package, please ensure that the folder containing `pip` binaries is configured in your `$PATH`.

## Environment Setup

Using the Pro services requires a valid subscription with an API key. Your API keys are listed on the [subscriptions page](/account/subscriptions), and can be activated using the environment variable `LOCALSTACK_API_KEY`.

**Example:** In order to use the API key `key123`, use the following command in your environment:
```
export LOCALSTACK_API_KEY=key123
```

**IMPORTANT NOTE:** If you are posting any commands, logs, or screenshots from your LocalStack installation (e.g., when reporting an issue on Github or in the community Slack channel), please always make sure to hide or **remove the `LOCALSTACK_API_KEY` variable from the output**!

## Starting Up

To start the LocalStack platform in your local Docker environment:
```
SERVICES=... localstack start
```

The environment variable `SERVICES` is a comma-separated list of services (see available services [here](#available-services)). We recommend limiting the list of services to start up (e.g., `SERVICES=lambda,s3,cognito,rds`), to keep a low memory footprint and optimize performance.

### Running In Docker Compose

Alternatively, you can also spin up LocalStack using [Docker Compose](https://docs.docker.com/compose/). Below is a sample `docker-compose.yml` configuration file that can be used as a starting point (please make sure to fill in `LOCALSTACK_API_KEY`, and that the port ranges correspond to the services you're starting):
```
version: '2.1'
services:
  localstack:
    image: localstack/localstack
    ports:
      - "53:53"
      - "443:443"
      - "4510-4520:4510-4520"
      - "4566-4620:4566-4620"
      - "${PORT_WEB_UI-8080}:${PORT_WEB_UI-8080}"
    environment:
      - LOCALSTACK_API_KEY=...
      - SERVICES=serverless,cognito,rds
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
      - DOCKER_HOST=unix:///var/run/docker.sock
      - HOST_TMP_FOLDER=${TMPDIR}
    volumes:
      - "${TMPDIR:-/tmp/localstack}:/tmp/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
```

**Note:** Please make sure to mount a persistent temporary folder `/tmp/localstack` into the container, as this is required to enable **API key caching**, allowing you to work offline (see [this section](#api-key-caching) for more details).

## Configuration

For a list of general configuration options for LocalStack, please refer to the README in the public Github repo: https://github.com/localstack/localstack

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

## Updating

Make sure to run the following commands to update to the latest version:
```
pip install --upgrade localstack localstack-ext localstack-client
docker pull localstack/localstack
```

Please also kill and remove any LocalStack Docker containers on your machine when updating to the latest version.

## API Key Caching

LocalStack Pro provides a mechanism to cache the API key activation on your local machine, allowing you to work offline or to continue using LocalStack in case of any network issues. The cached tokens are stored by default under `/tmp/localstack/.localstack` inside the container, therefore please make sure to mount `/tmp/localstack` as a persistent folder from your local machine. For example, if you're using docker-compose:

```
volumes:
  - "${TMPDIR:-/tmp/localstack}:/tmp/localstack"
```

With the configuration above, you'll need connectivity for the first API key activation, and then the cached auth token can be used for up to 12h.
