---
title: CloudWatch in Action - Get Notified when your Lambda suddenly fails
description: "Understanding AWS CloudWatch and configuring simple metric alarms with LocalStack"
lead: "Understanding AWS CloudWatch and configuring simple metric alarms with LocalStack"
date: 2022-05-04
lastmod: 2022-05-04
draft: true
images: []
contributors: ["Stefanie"]
tags: ["tutorial"]
---


AWS CloudWatch enables easy monitoring of AWS resources by collecting metrics. If you are interested in certain metrics (e.g. the disk or CPU usage) and you want to react to these metrics immediately, you can configure an alarm with actions. These actions will be triggered automatically when the defined thresholds are hit.

LocalStack now supports CloudWatch metric alarms with `statistic` and `comparison-operator`. 
In this article, we will discuss how you can use a CloudWatch metric alarm to get automatically notified when your Lambda function starts failing for whatever reason. In our example, we want to get notified via email. 

## Prerequesites
In order to follow to this tutorial, you will need to run LocalStack Pro, as sending emails is only supported in the Pro version.

You will also need to prepare a SMTP server, if you want to receive the notification via email. If you are just getting started and exploring this functionality, we would advice using a simple SMTP mock. 

There are some opensource tools available, for example [smtp4dev](https://github.com/rnwood/smtp4dev) or [Papercut SMTP](https://github.com/ChangemakerStudios/Papercut-SMTP). Those tools can be started with docker, and are instantly ready to use.

In order to connect LocalStack with the SMTP server, you need [configure some SMTP environment variables](https://docs.localstack.cloud/aws/cognito/#smtp-integration): 
 * `SMTP_HOST` this should contain the hostname and the port
 * `SMTP_USER` optional, if there is user to connect
 * `SMTP_PASS` optional 


## CloudWatch Basics
CloudWatch can help you to get a better understanding about how your resources behave over time. While some metrics are collected automatically, e.g., the execution of Lambdas, you can also define custom metrics you would like to monitor. Therefore you can use the CloudWatch API [`put-metric-data`](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/cloudwatch/put-metric-data.html).

If you want to get started with Cloudwatch, here are some basic commands:
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
* **period** - the intervall in seconds used to calculate the metric
* **evaluation-periods** - defines the number of periods that will be evaluated to check the threshold
* **treat-missing-data** - defines how missing data points should be evaluated: _missing_, _ignore_, _notBreaching_, _breaching_

For a deeper understanding of alarm evaluation, we advice to consult the official [AWS docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation).

Eventhough LocalStack's implementation of CloudWatch is not yet feature complete, you can already cover a range of use-cases. Next, we look into how we can make use of Cloudwatch alarms with Lambdas.

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
$ awslocal lambda invoke --function-name my-failing-lambda out.txt
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

Let's say we want to get notified, if the lambda fails at least once within the past minute.
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

If we invoke the lamba now, you should get an email notification after some time:
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
CloudWatch can be very useful for monitoring metrics of interest. Metric-alarms are periodically evaluated and make you aware if thresholds are breached. 

The configured actions trigger automatically once the alarm state changes and can therefore help to respond quick to any anomalies.

In our example we showed how to use email notifications, but this is just one way to do it. You could also use webhooks, SQS queues, or other SNS topic subscribers. 


