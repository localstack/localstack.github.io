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

The basic interface looks like the following:

```python3
class Extension(BaseExtension):
    """
    An extension that is loaded into LocalStack dynamically. The method
    execution order of an extension is as follows:

    - on_extension_load
    - on_platform_start
    - update_gateway_routes
    - update_request_handlers
    - update_response_handlers
    - on_platform_ready
    """

    namespace: str = "localstack.extensions"
    """The namespace of all basic localstack extensions."""

    name: str
    """The unique name of the extension set by the implementing class."""

    def on_extension_load(self):
        """
        Called when LocalStack loads the extension.
        """
        pass

    def on_platform_start(self):
        """
        Called when LocalStack starts the main runtime.
        """
        pass

    def update_gateway_routes(self, router: Router[RouteHandler]):
        """
        Called with the Router attached to the LocalStack gateway. Overwrite this to add or update routes.
        :param router: the Router attached in the gateway
        """
        pass

    def update_request_handlers(self, handlers: CompositeHandler):
        """
        Called with the custom request handlers of the LocalStack gateway. Overwrite this to add or update handlers.
        :param handlers: custom request handlers of the gateway
        """
        pass

    def update_response_handlers(self, handlers: CompositeResponseHandler):
        """
        Called with the custom response handlers of the LocalStack gateway. Overwrite this to add or update handlers.
        :param handlers: custom response handlers of the gateway
        """
        pass

    def on_platform_ready(self):
        """
        Called when LocalStack is ready and the Ready marker has been printed.
        """
        pass
```

To further look into the developer docs to build new LocalStack Extensions, look into our [developer documentation](https://docs.localstack.cloud/developer-guide/localstack-extensions/) and [API code](https://github.com/localstack/localstack/tree/master/localstack/extensions).

## Conclusion

LocalStack Extensions is currently in Beta and is continually evolving. We use the [Discussion Pages](https://discuss.localstack.cloud/) to share updates on our product and to communicate the roadmap. We look forward to working closely with our growing community and engaging via Discussion Pages on all the upcoming exciting upcoming topics and upcoming updates.

Let’s work together to create a superb developer experience and make cloud development fun! 🚀
