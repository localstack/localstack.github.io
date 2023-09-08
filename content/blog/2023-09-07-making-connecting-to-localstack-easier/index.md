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

We are tackling two problems users experience when connecting to LocalStack:

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
You can check that the domain maps to `127.0.0.1` by running:

```sh
dig @8.8.8.8 localhost.localstack.cloud

; <<>> DiG 9.10.6 <<>> @8.8.8.8 localhost.localstack.cloud
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 54676
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;localhost.localstack.cloud.	IN	A

;; ANSWER SECTION:
localhost.localstack.cloud. 600	IN	A	127.0.0.1

;; Query time: 54 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Fri Sep 08 11:23:20 BST 2023
;; MSG SIZE  rcvd: 71
```

This command queries the Google public nameserver (`8.8.8.8`) for the `localhost.localstack.cloud` domain.
In the "ANSWER" section we see `127.0.0.1` returned, as an `A` record, meaning IP address.


## Configuration of the LocalStack container

* `GATEWAY_LISTEN`
* `LOCALSTACK_HOST`

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
