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
    parent: "getting-started"
weight: 102
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

Using the Pro services requires a valid subscription with an API key. Your API keys are listed on the [subscriptions page](https://app.localstack.cloud/account/subscriptions), and can be activated using the environment variable `LOCALSTACK_API_KEY`.

**Example:** In order to use the API key `key123`, use the following command in your environment:
```
export LOCALSTACK_API_KEY=key123
```

**IMPORTANT NOTE:** If you are posting any commands, logs, or screenshots from your LocalStack installation (e.g., when reporting an issue on Github or in the community Slack channel), please always make sure to hide or **remove the `LOCALSTACK_API_KEY` variable from the output**!

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
