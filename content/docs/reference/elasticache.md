---
title: "ElastiCache"
description: ""
pro: true
lead: ""
date: 2021-06-25T17:34:26+02:00
lastmod: 2021-06-25T17:34:26+02:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 999
toc: true
---

A basic version of [ElastiCache](https://aws.amazon.com/elasticache/) is provided. By default, the API is started on http://localhost:4598 and supports running a local Redis instance (Memcached support coming soon).

After starting LocalStack Pro, you can test the following commands:
```
$ awslocal elasticache create-cache-cluster --cache-cluster-id i1
{
    "CacheCluster": {
        "CacheClusterId": "i1",
        "ConfigurationEndpoint": {
            "Address": "localhost",
            "Port": 4530
        }
    }
}
```

Then use the returned port number (`4530`) to connect to the Redis instance:
```
$ redis-cli -p 4530 ping
PONG
$ redis-cli -p 4530 set foo bar
OK
$ redis-cli -p 4530 get foo
"bar"
```
