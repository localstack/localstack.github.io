---
title: Hot Swapping Python Lambda Functions using LocalStack
description: "Debugging and testing AWS Lambda functions using Hot code swapping with LocalStack’s code mounting"
lead: "Debugging and testing AWS Lambda functions using Hot code swapping with LocalStack’s code mounting"
date: 2022-03-22T8:53:01+05:30
lastmod: 2022-22-07T8:53:01+05:30
draft: false
images: []
contributors: ["LocalStack Team"]
tags: ["tutorial"]
---

{{< img src="hot-swapping-python-lambda-functions.png" >}}

AWS Lambda is a Serverless Function as a Service (FaaS) system that allows you to write code in your favorite programming language and run it on the AWS ecosystem. Unlike deploying your code on a server, you can now break down your application into many independent functions and deploy them as a singular units. With the help of AWS Lambda, you can strive for more modular code that can be tested and debugged while integrated with the AWS infrastructure and your core system.

However, iterating over your Lambda functions can be a slow process. When developing with AWS, Lambda functions need to be re-deployed on every change before you can test or debug. Having many functions that depend on each other or rely on other AWS services can create really slow development loops that impede progress and cost money. These slow loops incentivizes developers to deploy changes without testing them properly. Suddenly, you may be deploying critical bugs to production, and it will be much more expensive to find the defect and fix it.

LocalStack was created to solve this kind of problem. LocalStack is a cloud service emulator that can run in a single container on your local machine or in your CI environment, which lets you run your cloud and serverless applications without connecting to an AWS account. All cloud resources your application depend on are now available locally, allowing you to run automated tests of your application in an AWS environment without the need for costly AWS developer accounts, slow re-deployments, or transient errors from remote connections.

Moreover, with LocalStack, you can avoid deploying your Lambdas with every change to debug and test it. Rather, LocalStack can mount your source code directly into a Lambda and run it. It is a great way to test your code on every change without having to deploy it on AWS, or even re-running your deployment scripts.

## Anatomy of a Lambda Function

To understand how this works and how it can help you, let's first take a look at a simple Python Lambda example:

```python
import json

def lambda_handler(event, context): 
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
```

You can see that we have defined a `lambda_handler`, the function which is executed by the Lambda service every time a trigger event occurs. It takes two arguments: `event` and `context`. The `event` argument is the input data that contains detailed information about the event that triggered the execution, while the `context` argument contains methods and properties that provide information about the invocation. Lambda is an event-driven service, which implies that every Lambda execution happens when it is triggered by another AWS service.

While deploying it on AWS, you would need to specify the handler (`lambda_handler` in our case), which will serve as the entry point for the Lambda function. Second, we would choose a runtime environment (Python in our case), which is the language that the Lambda function will run in. Finally, a trigger is configured and you can save the code to AWS Lambda and then test the function. You will get the following output:

```sh
{
    'statusCode': 200,
    'body': "\"Hello from Lambda!\""
}
```

## Setting up LocalStack

LocalStack allows you to run your Lambda functions locally. You can run the Lambda by either deploying it locally or mounting your code directly into LocalStack. This blog covers the latter, where we will test our Lambda function by mounting our code directly into the container. It will facilitate blazing-fast testing and debugging our Lambda functions while ensuring that a watcher will continue to look at your code, compile it and update the local Lambda inside the LocalStack container on every change.

Let's get started with LocalStack. To install LocalStack, you need to ensure that the LocalStack CLI is installed. Through `pip`, you can easily do that using the following command:

```sh
pip install localstack
```

It will install the `localstack-cli` which is used to run the Docker image that hosts the LocalStack runtime. You can start LocalStack in a detached mode by running the following command:

```sh
localstack start -d
```

For the purpose of this blog, we will use a sample AWS Lambda function from the [AWS SDK examples](https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/python/example_code/lambda/lambda_handler_basic.py). Here is our Lambda function:


```python
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose

Shows how to implement an AWS Lambda function that handles input from direct
invocation.
"""

# snippet-start:[python.example_code.lambda.handler.calculate]
import logging
import math

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Define a list of Python lambda functions that are called by this AWS Lambda function.
ACTIONS = {
    'square': lambda x: x * x,
    'square root': lambda x: math.sqrt(x),
    'increment': lambda x: x + 1,
    'decrement': lambda x: x - 1,
}


def lambda_handler(event, context):
    """
    Accepts an action and a number, performs the specified action on the number,
    and returns the result.

    :param event: The event dict that contains the parameters sent when the function
                  is invoked.
    :param context: The context in which the function is called.
    :return: The result of the specified action.
    """
    logger.info('Event: %s', event)

    result = ACTIONS[event['action']](event['number'])
    logger.info('Calculated result of %s', result)

    response = {'result': result}
    return response
# snippet-end:[python.example_code.lambda.handler.calculate]
```

To get started with hot swapping the above Lambda function, start the LocalStack container by configuring the `LAMBDA_REMOTE_DOCKER`:

```sh
LAMBDA_REMOTE_DOCKER=0 localstack start -d
```

The `LAMBDA_REMOTE_DOCKER` is configured as `false` to ensure that the Lambda volume mounts works while we are mounting a temporary folder on the host. If you are using a Docker-Compose setup to start LocalStack, you can add the following option to your `docker-compose.yml` file:

```yml
services:
  localstack:
    ...
    environment:
      ...
      - LAMBDA_REMOTE_DOCKER=false
```

You will also need to install our LocalStack AWS CLI, which is a thin wrapper around the aws command line interface for use with LocalStack, using `pip`:

```sh
pip install awscli-local
```

## Hot Swapping Lambda functions

Before we get started with hot-swapping the Lambda function, we first need to create it on LocalStack. We will deploy the Lambda using a special S3 bucket indicated by using `__local__` as the bucket name. The S3 key path should point to the directory of your Lambda function code. You can save the above example as a file in a directory of your choice. The handler is referenced by the filename of your Lambda function where the code inside of it is invoked. Let's try it out:


```sh
awslocal lambda create-function --function-name my-cool-local-function \
    --code S3Bucket="__local__",S3Key="/some/path" \
    --handler lambda_handler_basic.lambda_handler \
    --runtime python3.8 \
    --role cool-stacklifter
```

Let's break that down.

The `--function-name` is the name of the Lambda function that we are trying to deploy. The `--code` specifies the code for the function which has been configured inside the special S3 bucket using `S3Bucket`, by mounting a local directory with `S3Key` which references the directory path. The `--handler` is the name of the method within your code that Lambda calls to execute your function while the `--runtime` is the identifier of the runtime (using Python as an example here). The `--role` specifies the Amazon Resource Name (ARN) of the function's execution role.

We can now test out Lambda function by specifying a simple payload:

```sh
awslocal lambda invoke --function-name my-cool-local-function --payload '{"action": "square", "number": 3}' output.txt
```

We specify that we are looking for a number to be squared. The invocation returns the following response:

```sh
{
    "StatusCode": 200,
    "LogResult": "",
    "ExecutedVersion": "$LATEST"
}
```

The `output.txt` contains:

```text
{"result":9}
```

Let's change our Lambda code now and see how things work. This time, the function has already been mounted as a file in the executing container. It means that we do not need to deploy the Lambda once again to test our code. We can go ahead, make changes to our file and the output would be reflected in an instant.

Let us change this line `response = {'result': result}` to `response = {'math_result': result}`. The result of the previous request (without redeploying or updating) would look like:

```text
{"math_result":9}
```

### Testing every change

But that's just a simple plain Python Lambda, right? How can we hot swap Lambda functions with external dependencies? For this purpose, we recommend using a virtual environment. You can specify a `requirements.txt` where all your dependencies are specified and you can install them by activating the environment and running the command: `pip install -r requirements.txt`. Now we can prepare a special folder and a watchman script for hot code swapping!

We will specify a `watchman.sh` script that will act as a wrapper while we mount our folder as mounting point for Lambdas. We will use `build/hot` as an example here. Here is an example of what the script would look like:

```sh
trap "watchman watch-del $(pwd)" EXIT

folder=$(pwd)/$1
echo "watching folder $folder for changes"

while watchman-wait $folder; do
  bash -c "$2"
  watchman watch-del $(pwd)
done
```

You can now add a `Makefile` here to prepare the codebase for hot swapping:

```sh
VENV_DIR ?= .venv
VENV_RUN ?= . $(VENV_DIR)/bin/activate
BUILD_FOLDER ?= build
PROJECT_MODULE_NAME = my_project_module

build-hot:
	$(VENV_RUN);
  rm -rf $(BUILD_FOLDER)/hot && mkdir -p $(BUILD_FOLDER)/hot;
	cp -r $(VENV_DIR)/lib/python$(shell python --version | grep -oE '[0-9]\.[0-9]')/site-packages/* $(BUILD_FOLDER)/hot;
	cp -r $(PROJECT_MODULE_NAME) $(BUILD_FOLDER)/hot/$(PROJECT_MODULE_NAME);
	cp *.toml $(BUILD_FOLDER)/hot;

watch:
	bin/watchman.sh $(PROJECT_MODULE_NAME) "make build-hot"

.PHONY: build-hot watch
```

It will copy the `PROJECT_MODULE_NAME` along with all dependencies to `build/hot` folder which will then be mounted to the Lambda inside LocalStack container. Just start this with `make watch` and see the magic!

## Conclusion

Testing your Lambda function with LocalStack is a great way to test your code and make sure you're not pushing faulty code to the cloud. With LocalStack, you can instill greater confidence in your code when deploying it to your AWS production account, while meeting the standards and compatibility with your core system. LocalStack Tools help improve your development efficiency with LocalStack Cloud Developer Tools. You can not only hot-swap your Lambda function but also remotely debug them, inject LocalStack service endpoints inside your application, persist the state of your AWS services using cloud pods and much more! With a few lines of code, you can make your life as a cloud developer easier.

Find the documentation for [LocalStack Tools](https://docs.localstack.cloud/tools/) and the code on [LocalStack repository](https://github.com/localstack/localstack). You can create an issue on [GitHub](https://github.com/localstack/localstack/issues/new) or connect with us on [LocalStack Slack](https://localstack.cloud/contact) to get help.
