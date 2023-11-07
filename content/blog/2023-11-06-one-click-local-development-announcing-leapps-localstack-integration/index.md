---
title: "One Click Local Development: Announcing Leapp's LocalStack Integration"
description: "We're excited to announce our partnership with Leapp by Noovolari to integrate LocalStack. Now you can easily create LocalStack sessions in Leapp and seamlessly switch between local dev and remote cloud environments."
lead: "We're excited to announce our partnership with Leapp by Noovolari to integrate LocalStack. Now you can easily create LocalStack sessions in Leapp to connect to the cloud emulator without hassles."
date: 2023-11-06
lastmod: 2023-11-06
images: []
contributors: ['Harsh Mishra']
leadimage: "localstack-leapp-cover-image.png"
tags: ['news']
show_cta_1: true
---

{{< img-simple src="localstack-leapp-cover-image.png" >}}

[LocalStack](https://localstack.cloud) enables a fully functional cloud stack to emulate AWS cloud services on your local machine. It allows developers to shorten their feedback loop by enabling them develop, test, and deploy their applications locally while reducing costs and improving agility.  

LocalStack supports integrations, such as the [AWS CLI](https://docs.localstack.cloud/user-guide/integrations/aws-cli/), [CDK](https://docs.localstack.cloud/user-guide/integrations/aws-cdk/), [Terraform](https://docs.localstack.cloud/user-guide/integrations/terraform/), along with additional wrappers to make it possible for developers to connect to the local cloud emulator. However, maintaining these wrappers requires additional effort, and a lot of developers would like to switch from AWS to LocalStack in a click. 

We’re excited to announce our official partnership and integration with [Leapp](https://leapp.cloud) by [Noovolari](https://www.noovolari.com/) to help you switch between AWS and LocalStack. You can use Leapp to create a LocalStack session on your developer machine that can then be used to set your local credential file and access your LocalStack resources, using standard integrations such as the AWS CLI.

In this post, we will showcase how you can easily test your cloud applications locally, using LocalStack’s powerful core cloud emulator in combination with [Leapp’s IAM-based desktop app](https://github.com/Noovolari/leapp).

## What is Leapp?

Leapp is a Cross-Platform Cloud Access Desktop application that enables developers to manage and secure cloud access. Developers often run into the risk of cloud security & access, especially while operating in a multi-account environment. Leapp enables various features for developers to securely manage, access, and operate their cloud environment through a user-friendly interface.

{{< img-simple src="leapp-desktop-app.png" >}}

Leapp supports various features via its Desktop application, including:

- Generating temporary cloud credentials with just 1-click.
- Rotating short-lived credentials in an automated fashion.
- Provisioning Sessions using AWS Single Sign-on.
- Storing encrypted data locally in the OS System Vault.
- Creating configurations for multiple cloud access.
- Opening multiple AWS account Console at the same time in a click.

Leapp enables DevOps & Cloud engineers to streamline their cloud access workflows without compromising on security and quality. With the [`v0.20.0` release of Leapp](https://www.leapp.cloud/releases), you can now create a LocalStack session to connect to the local cloud emulator without any hassles.

## Configuring a LocalStack session in Leapp

<div class="quote-container mt-4">

  > _“We are excited to have this integration between LocalStack and Leapp - it allows our customers to easily manage their IAM policies and profiles, and seamlessly switch between local development and real AWS environments at the click of a button!”_
  <div class="quote-author">
    <p><a href="https://www.linkedin.com/in/whummer/">Waldemar Hummer</a>,</p>
    <p>Chief Technology Officer at LocalStack</p>
  </div>
</div>

A Leapp session entails all the necessary details to allow the developer to connect to a cloud provider. A session allows you to perform three actions:

- **Start**: To make temporary credentials available to the provider chain
- **Stop**: To revoke temporary credentials from the provider chain 
- **Rotate**: Generate new temporary credentials by substituting the existing ones in the provider chain

Traditionally, if you are trying to use AWS CLI with LocalStack, you can either use a custom profile or an endpoint URL (with `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` configured as `test`). Alternatively, you can use the [`awslocal` script](https://docs.localstack.cloud/user-guide/integrations/aws-cli/#localstack-aws-cli-awslocal) which wraps the AWS CLI and re-directs all the AWS API requests to the running LocalStack instance. 

With a LocalStack session in Leapp, you don’t need to manually configure any custom profile, endpoint URL, or install any wrapper script. You can use Leapp with a LocalStack session to get started!

### Install Leapp

To install the Leapp Desktop Application, navigate to the [Download page](https://www.leapp.cloud/download/desktop-app). Download the Desktop Application, depending on your Operating System (Windows/Linux/macOS). 

If not done already, you will be prompted to install the [AWS Session Manager Plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html). This plugin helps you to use the AWS CLI to start and end sessions to your managed instances.

### Setup the LocalStack session

You can now setup the LocalStack session. Click the **+** button on the top-bar to add a new session. Select **LocalStack** in the available options. A modal box will appear, and you will be prompted to add a **Session Alias**. Enter the desired alias and click on **Create Session**. Your LocalStack session is ready!

{{< img-simple src="localstack-session-leapp.png" >}}

### Run LocalStack with Leapp 

Your LocalStack session is ready! Select the session and click on **Start Session** in the bottom bar. You can notice that a **local** role has been attached to the session, along with a named profile and region.

{{< img-simple src="start-localstack-session.png" >}}

Start your LocalStack container using your preferred method with `DEBUG=1` enabled. Navigate to your preferred terminal or command prompt and run the following set of commands:

```bash
echo 'def handler(*args, **kwargs):' > /tmp/testlambda.py
echo '  print("Debug output from Lambda function")' >> /tmp/testlambda.py
(cd /tmp; zip testlambda.zip testlambda.py)
aws lambda create-function \
  	--function-name func1 \
  	--runtime python3.8 \
  	--role arn:aws:iam::000000000000:role/lambda-role \
  	--handler testlambda.handler \
  	--timeout 30 \
  	--zip-file fileb:///tmp/testlambda.zip
aws lambda invoke --function-name func1 output.txt
```

The above commands do the following:

- Creates a new Python file named `testlambda.py` and define a function that prints a debug message when the function is executed.
- Creates a ZIP archive named `testlambda.zip`  which will be used as the deployment package for the AWS Lambda function.
- Creates a new Lambda named `func1`  with entrypoint for the Lambda function as `testlambda.handler` and the deployment package as a ZIP archive.
- Invokes the Lambda function and save the function's output to a file named `output.txt`.

Note that we are using the standard AWS CLI here — without specifying the endpoint URL or a customized `localstack` profile. While the above commands should have tried creating a Lambda function on the real AWS Cloud (and failed!), you will notice that the Lambda has been created successfully. You can navigate to the logs for your LocalStack container, and notice the following:

```bash
2023-11-06T09:28:40.940  INFO --- [   asgi_gw_0] localstack.request.aws     : AWS lambda.CreateFunction => 201
2023-11-06T09:29:00.911  INFO --- [   asgi_gw_1] l.u.container_networking   : Determined main container network: bridge
2023-11-06T09:29:00.937  INFO --- [   asgi_gw_1] l.u.container_networking   : Determined main container target IP: 172.17.0.2
2023-11-06T09:29:05.082  INFO --- [   asgi_gw_2] localstack.request.http    : POST /_localstack_lambda/7c6ffd4ea1209a8ef5e12b2b0f4388f5/status/7c6ffd4ea1209a8ef5e12b2b0f4388f5/ready => 202
2023-11-06T09:29:05.107  INFO --- [   asgi_gw_2] localstack.request.http    : POST /_localstack_lambda/7c6ffd4ea1209a8ef5e12b2b0f4388f5/invocations/211a0c2e-4ce1-4ec5-9f1f-05931549c66a/logs => 202
2023-11-06T09:29:05.112  INFO --- [   asgi_gw_2] localstack.request.http    : POST /_localstack_lambda/7c6ffd4ea1209a8ef5e12b2b0f4388f5/invocations/211a0c2e-4ce1-4ec5-9f1f-05931549c66a/response => 202
...
2023-11-06T09:44:07.232 DEBUG --- [   asgi_gw_1] l.s.l.i.version_manager    : > Debug output from Lambda function
...
2023-11-06T09:29:05.118  INFO --- [   asgi_gw_1] localstack.request.aws     : AWS lambda.Invoke => 200
```

Congratulations! 🎉 You will notice the Debug output from Lambda function in your LocalStack logs, indicating that your  Lambda function was invoked successfully! Using a LocalStack session on Leapp, you could use the AWS CLI to redirect all your AWS API requests to LocalStack, instead of the real AWS cloud.

## Conclusion

With Leapp, you can streamline your local cloud development & testing workflows between LocalStack & AWS in a smooth fashion! The integration allows our users to develop and test their application in the same manner as their production applications, without tweaking any additional configuration to make it work against LocalStack’s core cloud emulator. 

With LocalStack, developers can share the same environment and development resources within a fully-local cloud sandbox, mitigating potential conflicts, while switching between development & production on the fly.

If you have questions about configuring and running your project, drop by [Leapp’s Slack Community](https://docs.leapp.cloud/latest/contributing/get-involved/) or the [LocalStack Slack Community](https://localstack.cloud/slack)!
