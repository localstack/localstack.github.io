---
title: How we are making connecting to LocalStack easier
date: 2023-09-07
lastmod: 2023-09-07
tags:
- news
contributors:
- Simon
- Daniel
- Thomas
draft: true
---

Connecting your application code to LocalStack is not always easy.
In this post we will outline some of the ways we have made connectivity within and **to** LocalStack easier.

<!-- picture -->

There are two main problems with connecting to LocalStack that we are tackling:

1. connectivity to the LocalStack container, and
2. configuration of the LocalStack container.

## Connectivity to the LocalStack container

LocalStack normally runs in a container, meaning that it is isolated from the host system.
By default, LocalStack _publishes_ its edge port (usually 4566) to the host computer.
The edge port is the way applications interact with LocalStack.
This means that port 4566 on your computer is connected to port 4566 inside the LocalStack docker container.
Requests made to `localhost:4566` are then forwarded to the LocalStack container.

This works well when interacting from the host, for example using `awslocal` commands.
It does not work when trying to connect to LocalStack from your own containers, or LocalStack compute resources such as Lambda functions or ECS containers.
We also use the domain name `localhost.localstack.cloud` extensively in our documentation and examples.
This domain name is publically registered and resolves to the IP address `127.0.0.1`.
This allows us to present a valid TLS certificate when using HTTPS from the host, but does not remove the connectivity problem.


## Configuration of the LocalStack container

# Notes

- Why connectivity is difficult
    - in the past we have used `localhost.localstack.cloud` but this resolves to `127.0.0.1` (example dig command, `dig @8.8.8.8 localhost.localstack.cloud`).
    - We run your lambda code in separate docker containers to LocalStack
    - Therefore `127.0.0.1` is not correct when accessing LocalStack created resources
    - Also multiple configuration variables that do different overlapping things
        - cosmetic vs runtime parameters
- One way this is achieved is running our own DNS server
    - We have now moved the DNS server from -ext
    - Lambda, ECS and EC2 compute now supports this
- One difficulty is that the IP address of LocalStack is different to different containers
    - implemented intelligent ip address returning
    - works with transparent endpoint injection too
- How to use the new functionality from your container
    - example compose file
- Configuration of LocalStack has been simplified and made clearer
    - GATEWAY_LISTEN configures the runtime
    - LOCALSTACK_HOST configures the cosmetic variables
