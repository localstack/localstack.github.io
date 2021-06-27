---
title: "Local Cloud Pods"
description: ""
pro: true
lead: ""
date: 2021-06-25T18:22:00+02:00
lastmod: 2021-06-25T18:22:00+02:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 999
toc: true
---

Local Cloud Pods are a mechanism that allows you to take a snapshot of your local instance, persist it to a storage backend (e.g., git repository), and easily share it out with your team members.

You can create and manage local Cloud pods via the Web UI, and in order to load and store the persistent state of pods you can use the `localstack` command line interface (CLI).

Below is a simple example of how you can push and pull Local Cloud Pods using the `localstack` command line:

```
# User 1 pushes state of Cloud Pod to persistent server
$ awslocal kinesis list-streams
{"StreamNames": ["mystream123"]}
$ localstack pod push mypod1
...

# User 2 pulls state from the server to local instance
$ localstack pod pull mypod1
$ awslocal kinesis list-streams
{"StreamNames": ["mystream123"]}
```

**Note**: Using local Cloud pods requires setting the `DATA_DIR` configuration variable to point to a folder on your local machine - this folder will be used to persist and load the state of cloud pods in your local instance.

Local Cloud Pods support different storage mechanisms - currently we're focusing on using `git` repositories as the storage backend, as `git` is often readily available on developers' machines and is easy to integrate with (no additional access control settings required). Support for more storage backends is following soon (e.g., S3 buckets, FTP servers, etc).

You can use the LocalStack Web UI to create a new local cloud pod - see screenshot below (make sure to adjust Git URL and branch name to point to your repo).

{{< img-simple src="cloudPodsUI.png" alt="Local Cloud Pods UI" >}}

Once the pod has been created, you should be able to login and list it via the CLI as well:
```
$ export LOCALSTACK_API_KEY=...
$ localstack login
...
$ localstack pod list
Name    Backend    URL                                Size    State
------  ---------  ---------------------------------  ------  -------
pod1    git        ssh://git@github.com/your_org/...  1.68MB  Shared
```

(**Note**: Please ensure that `LOCALSTACK_API_KEY` is properly configured in the terminal session above.)

After the pod definition has been created, you should be able to use the `push`/`pull` commands listed above to push and pull the pod state to the Git repo. After `pull`ing the pod, LocalStack will automatically restart and restore the pod state in your instance (this may take a few moments to complete).

**Note**: If you `pull` a local cloud pod, it will overwrite the entire state in your LocalStack instance. Please make sure to backup any data before pulling a cloud pod, if required.
