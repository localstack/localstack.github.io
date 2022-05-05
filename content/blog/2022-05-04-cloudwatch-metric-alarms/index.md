---
title: CloudWatch in Action - Get notified when your Lambda suddenly fails
description: "LocalStack now supports CloudWatch metric alarms! In this article, you will learn how to configure and test a simple AWS CloudWatch metric alarm with LocalStack, to get notified on infrastructure failures."
lead: "LocalStack now supports CloudWatch metric alarms! In this article, you will learn how to configure and test a simple AWS CloudWatch metric alarm with LocalStack, to get notified on infrastructure failures."
date: 2022-05-04
lastmod: 2022-05-04
draft: false
images: []
contributors: ["Stefanie"]
tags: ["tutorial"]
---


[AWS CloudWatch](https://docs.aws.amazon.com/cloudwatch/index.html) is a service that enables monitoring of your AWS infrastructure by collecting logs and operational metrics of your deployment. An integral part of infrastructure operations is reacting in real-time to anomalous changes in metrics, e.g., spiking disk or CPU usage, or failures in your serverless functions. This is where CloudWatch metric alarms and actions come into play, which you can now develop and test using LocalStack!

LocalStack now supports CloudWatch metric alarms with `statistic` and `comparison-operator`.
In this article, we will discuss how you can use a CloudWatch metric alarm to get notified automatically when your Lambda function invocations fail. In our example, we will set up an email notification using the Simple Email Service (SES).

## Prerequisites

For this tutorial you will need:
* [LocalStack Pro](https://localstack.cloud), to send emails via SMTP and SES.
* The [awslocal](https://docs.localstack.cloud/integrations/aws-cli/#localstack-aws-cli-awslocal) command line utility
* A mock SMTP server like [smtp4dev](https://github.com/rnwood/smtp4dev) or [Papercut SMTP](https://github.com/ChangemakerStudios/Papercut-SMTP) to receive the email notifications locally.

In order to connect LocalStack with the SMTP server, you need to [configure the following SMTP environment variables](https://docs.localstack.cloud/aws/ses/#pro) when starting LocalStack:
 * `SMTP_HOST` this should contain the hostname and the port of your mock SMTP server
 * `SMTP_USER` optional, if there is user to connect
 * `SMTP_PASS` optional

For example, when using smtp4dev, simply run:

    docker run --rm -it -p 3000:80 -p 2525:25 rnwood/smtp4dev

and set `SMTP_HOST=localhost:2525`.
Navigating to `http://localhost:3000` will open a UI to access the email notifications.


## CloudWatch Basics
CloudWatch can help you to get a better understanding about how your AWS infrastructure resources behave over time. While some metrics are collected automatically, e.g., the execution of Lambdas, you can also define custom metrics you would like to monitor. To that end, you can use the CloudWatch API [`put-metric-data`](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/cloudwatch/put-metric-data.html).

Here are some basic commands to get started:
```sh
# add new metric data
$ awslocal cloudwatch put-metric-data \
   --namespace test \
   --metric-data '[{"MetricName": "Orders", "Value": 20}]' 

# get information about all collected metrics
$ awslocal cloudwatch list-metrics
{
    "Metrics": [
        {
            "Namespace": "test",
            "MetricName": "Orders",
            "Dimensions": []
        }
    ]
}

# query metric data
$ awslocal cloudwatch get-metric-data \
   --metric-data-queries '[{"Id": "my-id","MetricStat": {"Metric": {"Namespace": "test","MetricName": "Orders"},"Period": 3600, "Stat": "Sum" }}]' \
   --start-time 2022-05-04T08:00:00Z \
   --end-time  2022-05-04T19:00:00Z
{
    "MetricDataResults": [
        {
            "Id": "my-id",
            "Label": "Orders Sum",
            "Timestamps": [
                "2022-05-04T09:00:00Z"
            ],
            "Values": [
                20.0
            ],
            "StatusCode": "Complete"
        }
    ]
}
```
You can also use our **LocalStack WebApp** and navigate to [https://app.localstack.cloud/resources/monitoring](https://app.localstack.cloud/resources/monitoring). Here you can add metrics (and alarms) as well, supported by a nice UI, which already gives you configurable parameters.


In order to create an alarm, you need to define what kind of metrics the alarm should evaluate. 
LocalStack supports metric alarms with simple statics. This typically includes:
* **metric-name**
* **namespace**
* **threshold** - a double value
* **comparison-operator** - e.g. _GreaterThanThreshold_, _LessThanThreshold_, _GreaterThanOrEqualToThreshold_, _LessThanOrEqualToThreshold_
* **statistic** - e.g. _SampleCount_, _Average_, _Sum_, _Minimum_, _Maximum_
* **period** - the interval in seconds used to calculate the metric
* **evaluation-periods** - defines the number of periods that will be evaluated to check the threshold
* **treat-missing-data** - defines how missing data points should be evaluated: _missing_, _ignore_, _notBreaching_, _breaching_

For a deeper understanding of alarm evaluation, we advice to consult the official [AWS docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation).

Even though LocalStack's implementation of CloudWatch is not yet feature complete, you can already cover a range of use-cases. Next, we look into how we can make use of CloudWatch alarms with Lambdas.

## Setup a Lambda Function
For the sake of simplicity, we will create a Lambda that will always fail. This will make it easier to demonstrate the alarms functionality. If you are interested in further learning about Lambdas, you can check our previous blog post on [Hot Swapping Python Lambda Functions using LocalStack](../2022-03-07-hot-swapping-python-lambda-functions-using-localstack), which also gives a solid introduction to Lambdas.

```py
# failing-lambda.py
import json

def lambda_handler(event, context): 
    raise Exception('fail on purpose')
```

Next we zip `failing-lambda.py` and create our lambda-function:
```sh
$ zip failing-lambda.zip failing-lambda.py

$ awslocal lambda create-function \
    --function-name my-failing-lambda \
    --zip-file fileb://failing-lambda.zip \
    --handler failing-lambda.lambda_handler \
    --runtime python3.8 \
    --role my-role
```

When this lambda is invoked, it will fail immediately. Also the metrics are collected automatically, so we can now define a metric alarm that will notify us, once this happens.

## Metric alarms
Now let's think about when we want to trigger the alarm. We need to define which metrics we are interested in, and how thresholds should be calculated.
If you invoke the lambda once, and run `list-metrics` you will see that we already have some metrics here:

```sh
$ awslocal cloudwatch list-metrics
{
    "Metrics": [
        {
            "Namespace": "AWS/Lambda",
            "MetricName": "Invocations",
            "Dimensions": [
                {
                    "Name": "FunctionName",
                    "Value": "my-failing-lambda"
                }
            ]
        },
        {
            "Namespace": "AWS/Lambda",
            "MetricName": "Errors",
            "Dimensions": [
                {
                    "Name": "FunctionName",
                    "Value": "my-failing-lambda"
                }
            ]
        }
    ]
}
```
Obviously, there are metrics reported for every invocation of a Lambda - we can see the metric name "Invocations". 

Additionally, there is a metric for "Errors". This is the one we want to track.
For the alarm, we will need the `Namespace`, `MetricName`, and the `Dimensions`. The latter one will make sure we only consider alarms for the lambda _my-failing-lambda_.

Now, we just need to think about reasonable evaluation criteria - what is reasonable will depend a lot on your specific use case.

Let's say we want to get notified if the lambda fails at least once within the past minute.
Then the `evaluation-periods` would be 1, and `period` would be 60. 

For the `statistic` we use _Sum_ (failing invocation within the last minute will be summed up), and our `threshold` is 1, with the `comparison-operator` _GreaterThanOrEqualToThreshold_. 

In case the lambda was not invoke, we assume everything is fine. So we set `treat-missing-data` to _notBreaching_.

At this time we know how we want to evaluate the metrics. So the only thing left is configuring the action that should be executed, once the alarm changes its state to _ALARM_.

## Alarm actions
Actions are optional parameters that can be configured for alarms. There is one configuration for every state: `alarm-actions`, `ok-actions`, and `insufficient-data-actions`. The action will be executed once the alarm state changes. 

LocalStack supports SNS Topics as actions. 
The topic must be created beforehand, and we need to know the topic's ARN for the metric-alarm configuration.

Before we can use the email feature, we have to do some preparations: We need to verify the email address where you want to send the messages to:
```sh
$ awslocal ses verify-email-identity --email-address stefanie@example.com
```

Next, we can create the SNS topic. Remember: we need this ARN for the alarm configuration.
We also need to create a subscription to this topic, so the that the email will be sent to our address.
```sh
$ awslocal sns create-topic --name my-topic-alarm
{
    "TopicArn": "arn:aws:sns:us-east-1:000000000000:my-topic-alarm"
}

$ awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:000000000000:my-topic-alarm --protocol email --notification-endpoint stefanie@example.com

```

Finally, we have everything we need to create the metric-alarm:
```sh
$ awslocal cloudwatch put-metric-alarm \
  --alarm-name my-lambda-alarm \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --dimensions "Name=FunctionName,Value=my-failing-lambda" \
  --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --evaluation-periods 1 \
  --period 60 \
  --statistic Sum \
  --treat-missing notBreaching \
  --alarm-actions arn:aws:sns:us-east-1:000000000000:my-topic-alarm 

```

If we invoke the Lambda function now, you should get an email notification after some time:
```sh
$ awslocal lambda invoke --function-name my-failing-lambda out.txt
```

The email will contain plain text, and gives you information about the alarm that was triggered:
```sh
Content-Type: text/plain; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Subject: SNS-Subscriber-Endpoint
From: LocalStack <admin@localstack.com>
To: stefanie@example.com

{"OldStateValue": "OK", "AlarmName": "my-lambda-alarm", "AlarmDescription": "", "AlarmConfigurationUpdatedTimestamp": "2022-05-04T13:58:57.297769000Z", "NewStateValue": "ALARM", "NewStateReason": "Threshold crossed", "StateChangeTime": "2022-05-04T13:59:20.438156000Z", "Region": "us-east-1", "AlarmArn": "arn:aws:cloudwatch:us-east-1:000000000000:alarm:my-lambda-alarm", "OKActions": "", "AlarmActions": ["arn:aws:sns:us-east-1:000000000000:my-topic-alarm"], "InsufficientDataActions": "", "Trigger": {"MetricName": "Errors", "Namespace": "AWS/Lambda", "Unit": "", "Period": 60, "EvaluationPeriods": 1, "ComparisonOperator": "GreaterThanOrEqualToThreshold", "Threshold": 1.0, "TreatMissingData": "notBreaching", "EvaluateLowSampleCountPercentile": "", "Dimensions": [{"value": "my-failing-lambda", "name": "FunctionName"}], "StatisticType": "Statistic", "Statistic": "SUM"}}
```

## Conclusion
CloudWatch is an integral part of infrastructure management to monitor and react to operational metrics. Metric alarms are periodically evaluated and make you aware if thresholds of metrics are breached.

The configured actions trigger automatically once the alarm state changes and can therefore help to respond quick to any anomalies.

In our example we showed how to use email notifications, but this is just one way to do it. You could also use webhooks, SQS queues, or other SNS topic subscribers.
