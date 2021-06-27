---
title: "Amazon Neptune"
description: ""
pro: true
lead: ""
date: 2021-06-25T18:07:18+02:00
lastmod: 2021-06-25T18:07:18+02:00
draft: false
images: []
menu:
  docs:
    name: "Neptune"
    parent: "reference"
weight: 999
toc: true
---

The Neptune API provides a graph database to store nodes and edges that can be accessed via Apache TinkerPop and Gremlin queries.

For example, you can create a Neptune cluster like this:
```
client = boto3.client('neptune', endpoint_url='http://localhost:4566')
cluster = client.create_db_cluster(DBClusterIdentifier='c1', Engine='neptune')['DBCluster']
cluster_url = 'ws://localhost:%s/gremlin' % cluster['Port']
graph_client = gremlin_client.Client(cluster_url, 'g')
```
... and then submit and query values to the DB like this:
```
values = '[1,2,3,4]'
result_set = graph_client.submit(values)
results = result_set.all().result()
assert results == [1, 2, 3, 4]
```

For a simple Neptune sample running on LocalStack, please refer to [this Github repository](https://github.com/localstack/localstack-pro-samples/tree/master/neptune-graph-db).
