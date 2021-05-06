---
title: "LocalStack: 30k stars, 40M pulls - and just getting started! 🚀"
description: "At LocalStack, we're working hard to provide the best possible cloud dev experience - giving developers back control over their environments, and enabling a highly efficient, fully local dev&test loop for your cloud applications, <i>to make cloud development fun again</i>."
lead: "At LocalStack, we're working hard to provide the best possible cloud dev experience - giving developers back control over their environments, and enabling a highly efficient, fully local dev&test loop for your cloud applications, <i>to make cloud development fun again</i>."
date: 2021-05-06T14:48:49+02:00
lastmod: 2021-05-06T14:48:49+02:00
draft: false
images: ["xkcd-deploying-to-cloud.png", "first-commit.png"]
contributors: ["LocalStack Team"]
---

While cloud environments offer great characteristics for production
workloads (high scalability, reliability, cost efficiency), the dev
experience often falls short due to the centralized, remote execution
model of clouds.

{{< img-simple src="xkcd-deploying-to-cloud.png" >}}

Developers are faced with a slow and tedious
*code → deploy → test → redeploy → ... cycle* and often find themselves
packaging and uploading their serverless applications tens or hundreds
of times a day. These inherent limitations and hurdles in developing
cloud applications have caused some folks to compare the cloud to the
new mainframe era.

> "Now, in the 2020s, mainframes are back! They're just called 'the
> cloud' now, but not much of their essential nature has changed other
> than the vendor name."
> -- HackerNews user "jiggawatts"

We have been listening to the pains reported by cloud developers, and
we're determined to *empower the dev community* so it can focus on what
it is best at -- *developing great products to solve the world's
pressuring technology problems instead of wasting time with inefficient
dev&test loops in the cloud*.

#### A brief history of LocalStack

It all started out as a small open source project a couple of years ago,
in August 2016. Back then, the main purpose of LocalStack was very
simple: We wanted to help our friends and colleagues to turn their commute
time on the train into something more productive.

The initial commit ([`44326584`](https://github.com/localstack/localstack/commit/44326584))
added support for 8 core AWS APIs
(incl. API Gateway, Lambda, DynamoDB, and a few others).

{{< img-simple src="first-commit.png" >}}

Since then, the project has turned into *a flagship project on Github* -
we've recently hit the landmark number of *30k stars* on Github, as well
as *40Mio pulls* of the localstack/localstack image from Docker Hub.

And we are just getting started.

Today, we're already *supporting some \~30 core AWS APIs* in our free
LocalStack OpenSource project - an achievement that would have never
been possible without the great support and contributions from the
entire community! ♥️

Additionally, we have recently launched our **LocalStack Pro** offering,
which provides a set of *30+ advanced APIs, additional features,
graphical resource browsers, usage dashboards, and much more* - to power
your local dev productivity and cover even the most sophisticated of
your enterprise use cases.

#### From Chaos engineering, to Local Cloud Pods, to DNS integration - pushing the boundaries of Local Cloud Development

We still love trains, but at some point we realized that we are going
beyond the simple use case of supporting our friends to develop while on
one of our favorite eco-friendly means of transportation, and that we
are actually fundamentally reinventing cloud app development.

We have embarked on a journey to *fix the broken cloud software
development model* and firmly believe a new way of developing and
testing cloud applications is possible. As developers and engineers
ourselves, we can confidently say:

***Yes**, we want to be able to fully run and test our serverless apps and
cloud based microservices locally.*

***Yes**, we want to take local snapshots of our cloud resources and easily
spin them up on a different machine.*

***Yes**, we want to make a local code change and get immediate feedback.*

***No**, we don't want to constrain teams to keep cloud development costs
under control.*

***And yes** - believe it or not - we also want to be able to develop our
cloud apps offline!*

Today, we are enabling our users to *shift their entire cloud stack to
their local machine*, and this is only the beginning, as we continue to
rethink the limits of local development and testing. We are excited to
share a few of our recent developments, illustrating the power of your
LocalStack:

-   **Local Cloud Pods** allow you to take a *persistent snapshot* of
    your LocalStack instance and share it with your team members,
    enabling *collaborative debugging* and pre-seeded test environments
    with shared data and artifacts.
-   **Local security testing** - to support fast and efficient dev&test
    loops, LocalStack APIs by default do not require credentials, but
    once your dev cycle approaches the finish line, you can easily
    leverage the *advanced IAM features* and policy enforcement for
    local security testing.
-   **Transparent execution mode** is an approach to running your cloud
    applications locally and vice versa *without any code change
    whatsoever*, by leveraging a local DNS server that automatically
    resolves all cloud hostnames (e.g., \*.amazonaws.com) to a local IP
    address.
-   **Chaos engineering** is facilitated by *systematically injecting
    faults and errors* in the local infrastructure, to test and harden
    your applications for resilience and fault tolerance.

We are keeping up to speed with supporting your advanced cloud dev use
cases - some of the AWS features already supported include:

-   **Lambda container images** are a new mechanism to package and
    provision Lambda functions, based on pre-built Docker images that
    implement the Lambda Runtime API.
-   **Custom CloudFormation Resources** spawn user-defined Lambda
    functions with custom user code to provision CloudFormation
    resources. Using transparent execution code, existing Custom
    Resource Lambda functions can be used locally out of the box.
-   **AppSync resolvers** allow you to expose data from DynamoDB/RDS
    databases or Lambda functions, accessible using GraphQL queries,
    rendered via Velocity templates.
-   **Cognito triggers** support the full lifecycle of Cognito users and
    user pools, by running Lambda functions with custom logic for user
    validation, user migration, or pre-/post-authentication triggers.
-   ... and much more!

#### Ecosystem and Partnerships

We continue to focus on strengthening the LocalStack ecosystem and
integrations with best-of-breed cloud and Infrastructure as Code (IaC)
frameworks, making your local development experience a breeze. We have
recently added integrations for
[*CDK*](https://github.com/localstack/aws-cdk-local),
[*Amplify*](https://github.com/localstack/amplify-js-local),
[*Copilot*](https://github.com/localstack/copilot-cli-local), and
[*Pulumi*](https://github.com/localstack/pulumi-local) - complementing
the existing integrations for
[*Serverless*](https://github.com/localstack/serverless-localstack),
[*Terraform*](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/guides/custom-service-endpoints#localstack),
and [*AWS CLI*](https://github.com/localstack/awscli-local).

We are also establishing partnerships to make it even easier for you to
integrate LocalStack with your existing environments and dev workflows. For
example, you should *check out* [*Shipyard*](https://shipyard.build/), the new
way of spinning up ephemeral environments in Kubernetes to turbocharge your
application lifecycle. We'll cover some more exciting news about
one-click-deployments of LocalStack on Shipyard in a follow-up blog post soon.

#### Going multi-cloud and beyond

We're excited to announce that we are going multi-cloud - focusing on
Azure APIs as the next cloud layer, based on all the learnings we have
gathered in our journey so far. If you'd like to participate in our
*Azure beta program*, please get in touch with us directly.

But it doesn't stop there. More and more of our users are asking
for LocalStack to support AI apps - we feel the pain of AI engineers
that increasingly depend on cloud platforms for their machine learning
workflows. Managing the end-to-end lifecycle of AI models (training,
deployment, runtime monitoring) involves juggling a huge tech stack, and
LocalStack has a track record of simplifying these processes. Also, the
increasing demand for AI at the edge has prompted the giants to build
tools like AWS IoT Greengrass or Azure IoT Edge, which we look forward
to exploring and working on more.

#### We're just getting started!

Stay tuned for more updates! We are excited to have the privilege of
working with all of you to accelerate your cloud journey and to put
developers back in charge. *Let's make cloud development fun again!*
