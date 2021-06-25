---
title: "Starting Up"
description: ""
lead: ""
date: 2021-06-25T17:25:34+02:00
lastmod: 2021-06-25T17:25:34+02:00
draft: false
images: []
menu: 
  docs:
    parent: "getting-started"
weight: 20
toc: true
---

To start the LocalStack platform in your local Docker environment:
```
SERVICES=... localstack start
```

The environment variable `SERVICES` is a comma-separated list of services (see available services [here](#available-services)). We recommend limiting the list of services to start up (e.g., `SERVICES=lambda,s3,cognito,rds`), to keep a low memory footprint and optimize performance.

**Please note:** Starting with version `0.11.0`, all services are exposed via a single edge service endpoint - `http://localhost:4566` by default. (The old service-specific port numbers from previous releases are now deprecated and disabled.)


## Running In Docker Compose

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
