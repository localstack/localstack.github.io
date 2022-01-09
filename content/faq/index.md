---
title : "Frequently Asked Questions"
description: "Frequently asked questions about LocalStack, the services, licenses, and more."
date: 2022-01-06T08:47:36+00:00
lastmod: 2022-01-06T08:47:36+00:00
draft: false
images: []
---

## General

- What is LocalStack?

    LocalStack is a platform that simplifies and accelerates development of cloud applications. At its core, LocalStack provides a cloud service emulation layer that runs in a single container on your laptop or in your CI environment. With LocalStack, you can run your AWS services or Lambdas entirely on your local machine without connecting to a remote cloud provider.

    LocalStack focuses on developer experience (DevX) and offers a number of team collaboration features on top of the core emulation layer, like advanced persistence mechanisms that allow reuse and sharing of resources among team members and across environments. For enterprises LocalStack also comes with advanced analytics and reporting mechanisms.

- Which services are available and how well are the services covered?

    The overview of different usage tiers (Open Source, Pro, Enterprise) can be found at [LocalStack Features page](/features/)

    You can check the latest details about the current feature coverage of the specific services you want to use here: [LocalStack Features coverage](https://docs.localstack.cloud/aws/feature-coverage/).

- What types of LocalStack licenses do you offer?

    We currently offer three types of licenses:

    1. **LocalStack Pro**: Individual User Licenses: Individual user licenses are used on the individual users local machines (they offer unlimited use of LocalStack Pro on   the individual developers local machines).

    2. **LocalStack Pro - CI Licenses**: For using LocalStack Pro in CI environments and shared cloud resources you require a LocalStack Pro CI license key. Only one CI key is required and can be configured across all CI environments, but you have the option to setup different CI keys for usage tracking purposes at no additional cost. Each user triggering a build in the CI pipeline will trigger the same CI keys, therefore CI keys are usage based and independent of the number of users actually triggering the builds. The base LocalStack Pro CI package comes with 200 build credits per month across your CI keys and auto top ups upon credit consumption can be configured or disabled. The same key can be shared across multiple CI nodes and is independent of the number of users.

    3. **LocalStack Enterprise Licenses**: Our advanced enterprise offering covers both individual user licenses and CI licenses, as well as advanced team collaboration and analytics features, user management, and extended enterprise support. For more information please reach out to [info@localstack.cloud](mailto:info@localstack.cloud).

- Is it possible to use LocalStack for commercial use with Community Edition?

    Yes, the Community Edition can be used for commercial use (distributed under the Apache 2.0 open source license).

- Which tools are supported by LocalStack?

    The list of tool integrations supported by LocalStack can be found at [LocalStack integration page](https://docs.localstack.cloud/integrations/).

- How can I get a Slack invite?

    Users receive an invite after signing up to the LocalStack app on [app.localstack.cloud](https://app.localstack.cloud). Otherwise please reach out to [info@localstack.cloud](mailto:info@localstack.cloud).

## Pricing

- Is a free trial available before I purchase?

    Yes, we offer a 14 days free trial. To activate your free trial, sign up on the app [app.localstack.cloud](https://app.localstack.cloud). Under the billing section click on create a new plan.

## Application

- Where can I find my invoices?

    You can find your entire invoice history in your account details at [Account billing section](https://app.localstack.cloud/account#billing).

    Please note, if you are part of an organization account, only your organization’s admins have access to the billing section.

- I would like to cancel my trial. How do I do that?

    Your free trial will automatically expire after 14 days - no need to manually cancel it. We do not automatically add a paid license at the end of the free trial.

- Where can I add more licenses?

    You can create new subscriptions on [Account billing section](https://app.localstack.cloud/account#billing) by using the **+ ADD NEW PLAN** button.

    Please note, if you are part of an organization account, only your organization’s admins have access to the billing section and can assign API keys to you in the member section at [Account members section](https://app.localstack.cloud/account#members).

## Product

- Can I use LocalStack PRO features on a computer not connected to the internet?

    LocalStack Pro currently requires internet connectivity for a short period of time at start up, to activate the API key. Once the stack is up and running and initialized, you should be able to use it offline as well. We also have a mechanism that caches the activation key for a certain period of time (e.g., ~6hours) on the local machine.

- Can API keys be shared by more than 1 developer at a time?

    LocalStack Pro Individual user licenses are bound to one individual developer. As per our terms of use individual user licenses are not offered as a license pool and are not available to be used in CI Systems. You can reassign licenses on a monthly basis, but not change users more frequently.

- I upgraded to the LocalStack Pro Edition (Individual Developer). Can I get all the resources from the free trial transferred to the new subscription?

    You get a new API key when switching from the free 14 day trial to the pro subscription. So any usage events generated towards the old trial key won't be visible.

## Miscellaneous

Where can I find more answers? Navigate to our:

- [LocalStack Slack community](https://localstack-cloud.slack.com/)
- [LocalStack GitHub organization](https://github.com/localstack/)
- [LocalStack Twitter](https://twitter.com/_localstack)
