---
title: Announcing LocalStack Extensions
description: Announcing LocalStack Extensions
lead: Announcing LocalStack Extensions
date: 2022-08-08T5:51:39+05:30
lastmod: 2022-08-08T5:51:39+05:30
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

## Developing LocalStack Extensions

We invite developers using LocalStack to mock and emulate AWS infrastructure locally to help us build an ecosystem around LocalStack Extensions. LocalStack Extensions can be created using our core Extensions API in our core codebase.

{{< img src="localstack-extensions.png" >}}  

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
