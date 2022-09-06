---
title: Announcing LocalStack Extensions
description: Announcing LocalStack Extensions
lead: Announcing LocalStack Extensions
date: 2022-09-06T5:51:39+05:30
lastmod: 2022-09-06T5:51:39+05:30
images: []
contributors: []
contributors: ["Harsh Mishra"]
tags: ['news']
---

With the LocalStack 1.0 General Availability going live last month, we announced LocalStack Extensions! LocalStack Extensions allow users to extend and customize LocalStack using pluggable Python distributions.

## Setting up LocalStack Extensions

LocalStack Extensions is part of our Pro offering. To get started with using LocalStack Extensions, first log in to your account using the LocalStack CLI:

```bash
$ localstack login
Please provide your login credentials below
Username: ...
```

After a log-in, you can get started using the LocalStack Extensions API:

```bash
$ localstack extensions --help

Usage: localstack extensions [OPTIONS] COMMAND [ARGS]...

  Manage LocalStack extensions (beta)

Options:
  --help  Show this message and exit.

Commands:
  init       Initialize the LocalStack extensions environment
  install    Install a LocalStack extension
  uninstall  Remove a LocalStack extension
```

## Using LocalStack Extensions?

LocalStack Extensions is a Python application that runs together with LocalStack in the LocalStack container. LocalStack Extensions allows you to hook into different lifecycle phases of LocalStack and execute custom code or modify LocalStack’s HTTP gateway with custom routes and server-side code.

We have the following extensions handy for our users to get started with:

- [Stripe LocalStack Extension](https://github.com/localstack/localstack-extensions/tree/main/stripe)
- [AWS Replicator Extension](https://github.com/localstack/localstack-extensions/tree/main/aws-replicator)

To install an extension, specify the name of the `pip` dependency that contains the extension. For example, for the official Stripe extension, you can either use the package distributed on PyPI:

```bash
localstack extensions install localstack-extensions-stripe
```

You can also install it directly from a Git repository:

```bash
localstack extensions install "git+https://github.com/localstack/localstack-extensions/#egg=localstack-extensions-stripe&subdirectory=stripe"
```

## Creating LocalStack Extensions

We invite developers using LocalStack to mock and emulate AWS infrastructure locally to help us build an ecosystem around LocalStack Extensions. LocalStack Extensions can be created using our core Extensions API in our core codebase.

{{< img src="localstack-extensions.png" >}}

To create a new LocalStack Extension, you can use our Extensions CLI to access our developer commands that allows you to create new Extensions, and toggle local development mode for Extensions. With the developer mode toggled on, Extensions can be mounted into the LocalStack container hence you don't need to re-install them every time you change something.

```bash  
Usage: localstack extensions dev [OPTIONS] COMMAND [ARGS]...

  Developer tools for developing Localstack extensions

Options:
  --help  Show this message and exit.

Commands:
  disable  Disables an extension on the host for developer mode.
  enable   Enables an extension on the host for developer mode.
  list     List LocalStack extensions for which dev mode is enabled.
  new      Create a new LocalStack extension from the official extension...
```

To create a new Extension, you can use the `localstack extensions dev new` command:

```bash
% localstack extensions dev new
project_name [My LocalStack Extension]: 
project_short_description [All the boilerplate you need to create a LocalStack extension.]: 
project_slug [my-localstack-extension]: 
module_name [my_localstack_extension]: 
full_name [Jane Doe]: 
email [jane@example.com]: 
github_username [janedoe]: 
version [0.1.0]: 
```

It will kick-start your all-new LocalStack Extension project with all the boilerplate code you need to get started with. 

```sh 
my-localstack-extension
├── Makefile
├── my_localstack_extension
│   ├── extension.py
│   └── __init__.py
├── README.md
├── setup.cfg
└── setup.py
```

You can then run `make install` in the newly created project to make a distribution package. To start developing your Extension and mount it into the LocalStack container, use the `localstack extensions dev enable` command:

```sh 
localstack extensions dev enable ./my-localstack-extension
```

Start LocalStack with `EXTENSIONS_DEV_MODE=1` to mount the Extension into the LocalStack container:

```sh
EXTENSION_DEV_MODE=1 LOCALSTACK_API_KEY=... localstack start
```

You will notice the following in your logs when the Extension is mounted into the LocalStack container:

```sh
==================================================
👷 LocalStack extension developer mode enabled 🏗
- mounting extension /opt/code/extensions/my-localstack-extension
Resuming normal execution, ...
==================================================
```

## What's next?

To further look into the developer docs to build new LocalStack Extensions, look into our [developer documentation](https://docs.localstack.cloud/developer-guide/localstack-extensions/) and [API code](https://github.com/localstack/localstack/tree/master/localstack/extensions).

As a developer, some of the exciting use-cases of LocalStack Extensions are:

- Integrate custom service emulators (like Stripe or more) with LocalStack
- Load Python-based initialization scripts
- Instrument AWS requests before they reach your Lambdas
- Intercept AWS requests for logging or auditing

The sky is the limit!

## Conclusion

LocalStack Extensions is currently in Beta and is continually evolving. We use the [Discussion Pages](https://discuss.localstack.cloud/) to share updates on our product and to communicate the roadmap. We look forward to working closely with our growing community and engaging via Discussion Pages on all the upcoming exciting upcoming topics and upcoming updates.

Let’s work together to create a superb developer experience and make cloud development fun! 🚀
