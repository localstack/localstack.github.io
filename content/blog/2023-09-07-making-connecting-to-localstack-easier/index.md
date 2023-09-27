---
title: How we are making connecting to LocalStack easier
date: 2023-09-07
lastmod: 2023-09-26
tags:
- news
contributors:
- Simon Walker
- Daniel Fangl
---

Connecting your application code to LocalStack is not always easy.
In this series we will outline some of the ways we have made connecting to LocalStack easier.

<!-- picture -->

1. In this post, we will talk about how we have made connecting to LocalStack easier.
2. In the next post, we will demonstrate a debugging utility that we have built, to help diagnose network connectivity problems.
3. In the final post, we will show how we have simplified the configuration of the LocalStack container.

## Connectivity to the LocalStack container

LocalStack normally runs in a container, meaning that it is isolated from the host system.
By default, LocalStack _publishes_ its edge port (usually 4566) to the host.
Publishing a port means that a port on the host forwards network communications to the LocalStack container.
Requests made to `localhost:4566` are then forwarded to the LocalStack container.

This works well when interacting from the host, for example using `awslocal` commands.
It does not work when trying to connect to LocalStack from your own containers, or LocalStack compute resources such as Lambda functions or ECS containers.
In the past, some people have suggested connecting their application containers to the host network (`--network host`) or by making requests to `host.docker.internal:4566`.
In some cases, using the host networking solves the problem, but it causes other problems:

* If SSL is used, then certificate validation must be turned off:
    * LocalStack presents a certificate for a set of registered domains;
    * if using host networking (`--network host`), requests are made to an IP address or `localhost`, which is not included in the certificate; and
    * when using the gateway domain (`host.docker.internal`), this domain is also not included in the set of certificate domains.
* Subdomains created by resources such as S3 buckets or OpenSearch clusters will not resolve to the LocalStack container.
* Each host port can only be bound once, whereas container ports are separate from each other and multiple containers can bind to the same port.

We already resolve the first issue by using the domain name `localhost.localstack.cloud` in our documentation and examples.
This domain name is publically registered and resolves to the IP address `127.0.0.1`.
This allows us to present a valid TLS certificate when using HTTPS from the host, but does not remove the connectivity problem.
You can check that the domain maps to `127.0.0.1` by running:

```sh
dig @8.8.8.8 localhost.localstack.cloud
```

which outputs:

```text
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

### Why is using localhost.localstack.cloud not enough?

When you create a lambda function, ECS container or EC2 instance, we create a new Docker container running your application code.
In these situations, using the domain name `localhost.localstack.cloud` will not resolve to the LocalStack container as you may expect.
We currently have code in our Lambda managed runtimes to intercept any domain names that resolve to `127.0.0.1` and rewrite them to the LocalStack container IP, but this is only available to managed runtimes.

To tackle the problem generally, we are bringing a feature from LocalStack Pro into LocalStack open source: our DNS server.
By doing this, we are able to respond with the IP address of the container for any requests to `localhost.localstack.cloud`, provided your code is running in a correctly configured environment.

We are now able to resolve the three issues mentioned above:

* If SSL is used, then certificate validation must be turned off since LocalStack does not present a valid certificate for the domain used(either `localhost` or `host.docker.internal`).
    * **LocalStack presents a valid certificate for `*.localhost.localstack.cloud` domains**
* Subdomains created by resources such as S3 buckets or OpenSearch clusters will not resolve to the LocalStack container.
    * **Subdomains of `localhost.localstack.cloud` also resolve to the LocalStack container**. 
* Each host port can only be bound once, whereas container ports are separate from each other and multiple containers can bind to the same port .
    * **Now all networking can be done over the Docker network, and no ports have to be bound to the host at all**.


## How to use this new feature

For AWS services like Lambda or ECS, we are running your application code in an environment pre-configured to use this feature.

_For your own containers, there is some configuration required._

Docker allows the configuration of a container DNS resolver.
This is done by overriding the `/etc/resolv.conf` file inside the container.
When using the Docker CLI, you can use the `--dns` flag, or the `dns:` entry of a Docker Compose service.
This flag accepts an IP address to use for resolving domain names.
To use this flag, your LocalStack container will need to have a known IP address.

### Setting LocalStack as the DNS server using the Docker CLI

When using the CLI, you can use the `--dns` flag to set your application container DNS to the LocalStack container.

```sh
# start localstack
localstack start -d
localstack wait

# get the ip address of the LocalStack container
docker inspect localstack_main | \
	jq -r '.[0].NetworkSettings.Networks | to_entries | .[].value.IPAddress'
# prints 172.17.0.2

# run your application container
docker run --rm -it --dns 172.17.0.2 <arguments> <image name>
```

### Setting LocalStack as the DNS server using Docker Compose

When using Docker Compose, you can specify the IP address that the LocalStack container will be assigned by using a user-defined network, and using the `ipam` configuration settings.
For example:

```yaml
version: "3.8"

services:
  localstack:
    container_name: "${LOCALSTACK_DOCKER_NAME-localstack-main}"
    image: localstack/localstack
    ports:
      # Now only required if you need to access LocalStack from the host
      - "127.0.0.1:4566:4566"            
      # Now only required if you need to access LocalStack from the host
      - "127.0.0.1:4510-4559:4510-4559"
    environment:
      - DEBUG=${DEBUG-}
      - DOCKER_HOST=unix:///var/run/docker.sock
    volumes:
      - "${LOCALSTACK_VOLUME_DIR:-./volume}:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
    networks:
      ls:
        # Set the container IP address in the 10.0.2.0/24 subnet
        ipv4_address: 10.0.2.20

  application:
    image: ghcr.io/localstack/localstack-docker-debug:main
    entrypoint: ""
    command: ["sleep", "infinity"]
    dns:
      # Set the DNS server to be the LocalStack continer
      - 10.0.2.20
    networks:
      - ls

networks:
  ls:
    ipam:
      config:
        # Specify the subnet range for IP address allocation
        - subnet: 10.0.2.0/24
```

We have created a demo application to show off this functionality: [https://github.com/localstack/networking-demo-application](https://github.com/localstack/networking-demo-application).
This sample uses `*.localhost.localstack.cloud` throughout to seamlessly configure AWS SDK clients to communicate with LocalStack.

* The deploy process runs in a separate Docker container.
* The application container connects across the Docker network to LocalStack.
* A lambda function communicates with LocalStack to subscribe to SQS messages, access objects in S3, and write to a DynamoDB table.

We hope that with this new functionality available today, accessing LocalStack should be considerably easier.
By moving the DNS server into LocalStack and configuring spawned AWS compute environments to use it by default, your Lambda functions, ECS containers, and EC2 instances should already be able to access LocalStack at `localhost.localstack.cloud`.
With a small change in configuration, your application containers will also be able to reach LocalStack at `localhost.localstack.cloud`.

As always, let us know if any issues using the [GitHub issue tracker](https://github.com/localstack/locaslstack/issues), or if you are a Pro customer feel free to [reach out to us directly](https://docs.localstack.cloud/getting-started/help-and-support).
We want to hear your feedback on this feature, so please get in touch!
