---
title: Develop and Test Real-time Data Pipelines with LocalStack
description: "LocalStack makes it easy to develop and test real-time data pipelines that are built with AWS services. Learn how to deploy CloudWatch, Kinesis, Lambda, and external services using CDK on LocalStack."
lead: "LocalStack makes it easy to develop and test real-time data pipelines that are built with AWS services. Learn how to deploy CloudWatch, Kinesis, Lambda, and external services using CDK on LocalStack."
date: 2022-04-04
lastmod: 2022-04-04
draft: false
images: []
contributors: ["Sam Watson"]
tags: ["tutorial"]
leadimage: "develop-test-data-pipelines-localstack.png"
---

{{< img src="develop-test-data-pipelines-localstack.png" >}}

At LocalStack, we rely on AWS Lambda as a key part of our serverless infrastructure toolkit. As with any critical service, we want to extract analytics event data from running Lambda functions and aggregate it in our data warehouse so that we can track user stories and squash bugs. But this presents a challenge: how can we emit detailed analytics data while keeping Lambda code simple and performant? To solve this, we developed a serverless streaming data pipeline using CloudWatch Logs and Kinesis that allows us to decouple analytics from application logic.

{{< img src="pipeline.png" >}}

In this pipeline, a Lambda function writes analytics event data as structured JSON payloads to CloudWatch Logs. From there, we use a [subscription filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Subscriptions.html) to extract the events from the function's log group and deliver them directly to a Kinesis stream. Finally, a separate Lambda function consumes events off the stream in batches and delivers them to our [Tinybird](https://tinybird.co) data warehouse via their HTTP API.
Tinybird is a managed data platform that helps developers build real-time data solutions with familiar tools like HTTP APIs and SQL on top of fully managed ClickHouse clusters.

You may notice that the data pipeline is itself serverless! This approach requires very little code to maintain, but comes with the tradeoff of configuring multiple AWS services. Testing interconnected serverless cloud components can be tricky, but luckily we can use LocalStack to run the entire pipeline locally. This allows us to catch configuration issues before they're deployed, shortening feedback loops and accelerating development.

## Defining the Data Pipeline

At LocalStack we use AWS [Cloud Development Kit](https://aws.amazon.com/cdk/) (CDK) to define our infrastructure as code. We can use the [cdklocal](https://github.com/localstack/aws-cdk-local) tool to deploy the same CDK stacks on our development machines under LocalStack as we do in production. This allows us to test our CDK code, and therefore our infrastructure itself, without needing to deploy.
Okay, let's define a CDK stack for our data pipeline! We'll start with a boilerplate class definition:

```python
# data_pipeline_stack.py


class DataPipelineStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        monitored_log_group_arn: str,
        tinybird_auth_token: str,
        tinybird_url: str,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)
```

If you're familiar with CDK there shouldn't be anything surprising here. We declare a `DataPipelineStack` as a CDK Stack class. We also define a few parameters in the constructor that will be useful to us later: the ARN of the CloudWatch log group associated with the Lambda we want to monitor, plus an auth token and API URL for communicating with our Tinybird data warehouse.
Now let's define the beginning of the pipeline.

```python
# data_pipeline_stack.py


kinesis_stream = aws_kinesis.Stream(
    self,
    "data_pipeline_kinesis_stream",
    shard_count=1,
)

monitored_log_group = aws_logs.LogGroup.from_log_group_arn(
    self, "monitored_log_group", monitored_log_group_arn
)
monitored_log_group.add_subscription_filter(
    "monitored_log_group_cloudwatch_subscription",
    destination=aws_logs_destinations.KinesisDestination(kinesis_stream),
    filter_pattern=aws_logs.FilterPattern.all(
        aws_logs.FilterPattern.exists("$.event_class"),
        aws_logs.FilterPattern.exists("$.event_type"),
    ),
)

```
First we stand up a Kinesis stream for our event data. Next, we import the log group associated with the Lambda function we're interested in using its ARN. Finally, we declare a subscription filter using these two elements. The subscription filter acts as the "glue" between CloudWatch and Kinesis. Note the filter pattern: this ensures that only the structured events that we care about will be sent to Kinesis. We don't want every Lambda log message to show up in our data warehouse! Our filter only accepts log lines that meet the following criteria:
* JSON encoded
* Contains an `event_class` field
* Contains an `event_type` field

This filter was chosen based on the particular analytics event format we use at LocalStack.
Finally, let's deploy a "loader Lambda" function to consume events from Kinesis and load them into Tinybird. You can find the function code [here](https://github.com/localstack/serverless-streaming-data-pipeline/blob/main/lambdas/kinesis_tinybird_loader/kinesis_tinybird_loader.py)

```python
# data_pipeline_stack.py


loader_lambda = aws_lambda.Function(
    self,
    "kinesis_tinybird_loader",
    runtime=aws_lambda.Runtime.PYTHON_3_9,
    handler="kinesis_tinybird_loader.handler",
    code=aws_lambda.Code.from_asset(
        path.join(
            path.realpath(path.dirname(__file__)),
            "../..",
            "kinesis_tinybird_loader_pkg.zip",
        )
    ),
    timeout=Duration.seconds(7),
    environment={
        "TINYBIRD_AUTH_TOKEN": tinybird_auth_token,
        "TINYBIRD_URL": tinybird_url,
    },
)
loader_lambda.add_event_source(
    aws_lambda_event_sources.KinesisEventSource(
        kinesis_stream,
        starting_position=aws_lambda.StartingPosition.LATEST,
        retry_attempts=20,
        batch_size=200,
        max_batching_window=Duration.minutes(2),
    )
)
```

## Mocking External Resources

We've defined the data pipeline, but in order to test it end-to-end locally we need to mock two additional components. We need to set up a Lambda function with a log group that we can monitor for events, plus a local endpoint that can imitate the Tinybird API.

### Logger Lambda for Testing

Since CloudWatch logging is integrated with Lambda out of the box the code for emitting a structured analytics event as a log message is dead simple:

```python
# test_logger.py

import json


def handler(event, context):
    message = event.get('message', None)
    print(json.dumps({"event_class": "test", "event_type": "test", "message": message}))
```

### Mock Tinybird Endpoint

Tinybird has a convenient and simple HTTP API for ingesting data. For the purposes of testing the data pipeline, we just need a local HTTP endpoint that accepts POST requests from the loader Lambda. We'll use a simple Flask server that records requests with the help of the [http-server-mock](https://pypi.org/project/http-server-mock/) library. You can find the code [here](https://github.com/localstack/serverless-streaming-data-pipeline/blob/main/tests/integration/mocks/tinybird_request_recorder.py).

## Deploying Locally

With our data pipeline stack defined and external resource mocks in order, it's time to deploy everything locally using `cdklocal`.

### Define a Local App

To keep things tidy, we'll create a [separate stack](https://github.com/localstack/serverless-streaming-data-pipeline/blob/main/deployments/cdk/external_test_resources_stack.py) for the test logger Lambda and deploy it alongside the data pipeline stack under a single CDK app specifically for local testing. This way the data pipeline stack itself stays identical to what we deploy to AWS in production.

```python
# local_app.py

def main():
    # configuration variables for connecting to local mock Tinybird server
    port = 5111
    host = os.getenv("TINYBIRD_MOCK_HOST") or "host.docker.internal"
    tinybird_mock_path = "tinybird"
    tinybird_mock_url = f"http://{host}:{port}/{tinybird_mock_path}"
    
    app = App()

    external_resources = ExternalTestResourcesStack(
        app,
        "ExternalTestResourcesStack",
        env=constants.ENV_LOCAL,
    )

    data_pipeline = DataPipelineStack(
        app,
        "DataPipelineStack",
        env=constants.ENV_LOCAL,
        monitored_log_group_arn=Fn.import_value("test-logger-log-group-arn"),
        tinybird_auth_token="dummy value",
        tinybird_url=tinybird_mock_url,
    )
    data_pipeline.add_dependency(external_resources)

    app.synth()


if __name__ == "__main__":
    main()
```

Note how the `DataPipelineStack` uses the log group ARN value imported from the `ExternalTestResources` stack.

### Deploy Locally

Alright, let's deploy! First, we need to start LocalStack, bootstrap the local CDK environment, and deploy the logger Lambda. Please note that you will need [LocalStack Pro](https://localstack.cloud/pricing/) enabled for the log subscription feature to work.

```bash
LOCALSTACK_API_KEY="your key here" localstack start -d
cdklocal bootstrap --app "python local_app.py"
cdklocal deploy --app "python local_app.py" ExternalTestResourcesStack
```
You should see output similar to the following:

```
 ✅  ExternalTestResourcesStack

✨  Deployment time: 6.78s

Outputs:
ExternalTestResourcesStack.testloggerlambdaname = ExternalTestResourcesStack-testlogger39117BFF-c39d4d5a
ExternalTestResourcesStack.testloggerloggrouparn = arn:aws:logs:us-east-2:000000000000:log-group:/aws/lambda/ExternalTestResourcesStack-testlogger39117BFF-c39d4d5a:*
Stack ARN:
arn:aws:cloudformation:us-east-2:000000000000:stack/ExternalTestResourcesStack/b5143830

✨  Total time: 13.53s
```
Before we can deploy the data pipeline itself we have to invoke the logger Lambda. CloudWatch log groups for Lambda functions aren't created until the function is executed for the first time. Unless we do this step first the deployment will fail because CDK won't be able to locate the log group resource.
Another small wrinkle is that CDK creates a name for our logger Lambda funtion with a randomly generated suffix. You can automatically identify the function name and invoke it like so:

```bash
LAMBDA_NAME=$( \
    awslocal cloudformation list-exports \
    --region=us-east-2 \
    --query="Exports[?Name=='test-logger-lambda-name'].Value" \
    --no-paginate \
    --output text) && \
awslocal lambda invoke \
    --function-name $LAMBDA_NAME /dev/stdout 2>/dev/null \
    --region us-east-2 \
    --payload '{"message": "hello world"}'
```

Finally, we can deploy the data pipeline stack :tada::

```bash
cdklocal deploy --app "python local_app.py" DataPipelineStack
```

### Test End-to-End

The entire data pipeline is now up and running on our local development machine. To test it we just need to invoke the logger lambda and observe the event arrive at our mock Tinybird endpoint. Make sure you have the mock Tinybird server running. In a separate shell, invoke the logger lambda as shown above. You should see output similar to this appear in the mock server window:

```bash
{"event_class": "test", "event_type": "test", "message": "hello world"}
127.0.0.1 - - [01/Apr/2022 12:30:16] "POST /tinybird HTTP/1.1" 200 -
```

This proves that our data pipeline stack is defined and configured correctly. It's reading event data emitted from the logger Lambda into CloudWatch, streaming it through Kinesis, and finally delivering it to our data warehouse API - all running locally!
With this local deployment pattern established, we can build a robust test suite to validate the correctness of the pipeline. Incorporating cloud infrastructure tests into a CI pipeline ensures that any bugs will be caught prior to deployment. You can view a sample integration test case [here](https://github.com/localstack/serverless-streaming-data-pipeline/blob/main/tests/integration/e2e/test_pipeline.py).

## Conclusion

Serverless infrastructure allows organizations to deploy sophisticated, interconnected cloud services with minimal code. But this strategy requires developers to shift their energy towards configuring connections between serverless components. Developers can leverage LocalStack to validate infrastructure before it hits the cloud, shortening feedback loops and keeping systems robust.

Thanks for reading. You can find the complete serverless data pipeline deployment example codebase [here](https://github.com/localstack/serverless-streaming-data-pipeline).
