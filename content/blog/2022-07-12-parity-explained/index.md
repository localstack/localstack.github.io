---
title: LocalStack and AWS Parity Explained
description: "At LocalStack we are committed to constantly improve the cloud dev experience. Here is how our AWS Service Framework and a new snapshot testing framework help us to stay on top of AWS changes."
lead: "At LocalStack we are committed to constantly improve the cloud dev experience. Here is how our AWS Service Framework and a new snapshot testing framework help us to stay on top of AWS changes."
date: 2022-07-14
lastmod: 2022-07-14
images: []
contributors: ["Dominik", "Stefanie", "Thomas"]
tags: ['news']
---

Parity for LocalStack means that, when you as a cloud developer make an AWS API call to LocalStack's cloud emulator, it behaves the same way as AWS would.

Keeping parity with AWS has been our mission at LocalStack since day one.
This is essential for building a reliable cloud emulator that provides a great experience for cloud application developers.

Recently we introduced new mechanisms to scale the endeavor, and ensure that parity of LocalStack with AWS increases continuously over time, while keeping our service implementations up-to-date.

Here are the three key things we have been working on:

 - **Automated server-side code generation and API evolution:** Facilitated by our new AWS Server Framework (ASF), this approach includes weekly, automated updates of API stubs, which verifies the operation definitions of each service in LocalStack are compatible with the latest changes in `botocore`
 - **Parity Tests with Snapshot Testing:** Further, we have been working on a new testing approach, called "snapshot testing", that enables compatibility checks of LocalStack vs. AWS
 - **Parity Metrics:** Additionally, we started to collect detailed parity metrics in order to track test coverage and implementation status for services 


## AWS Service Framework

Distributed cloud systems like AWS have immense inherent complexity. Some people are skeptical when we tell them that LocalStack behaves in the same way AWS does. 

How are we dealing with all that complexity? Since LocalStack runs on your local machine, many of the problems of distributed systems go away, and we can make simplifying assumptions about the implementation of services. 

This makes emulating some services like Lambda, or SQS, that are normally a complex distributed system, much easier. Moreover, for many services, providing CRUD (Create, Read, Update, Delete) functionality is often sufficient to enable most use cases.

Each AWS service has a well-defined API and protocol specification. We have built a framework around these specs, which we call the AWS Server Framework (ASF).

ASF generates server-side stubs for services and all their supported operations. In order to create these APIs LocalStack uses the definitions of the python package `botocore` - which is also a major part of the AWS CLI, and `boto3`.

All service requests are then routed to their respective server-side implementation through ASF, which implements the AWS protocol in a generalized way.


### ASF Updates

To keep up with AWS API evolution, and [there is a lot of it](https://awsapichanges.info/), we have a weekly we have a weekly running Github action in place, that checks for any API changes and will raise a pull request (PR) automatically in case changes are detected. 

The PR also triggers our integration tests, and further has to be approved, and merged manually. Thus we ensure that nothing breaks accidentially.

{{< img src="screenshot_update_asf_api.png" >}}


Of course, newly added operations will not work out-of-the box. By default all operations that are not implemented will throw a `NotImplementedError` upon calling. However, we ensure that the declaration of each operation is compatible with AWS.


## Parity Tests with Snapshot Testing

Parity tests are a special form of integration tests that verify the correctness of LocalStack compared to AWS. Recently, we have introduced this type of AWS compatible tests, with an approach that we call "snapshot testing".

Over time, as more parity tests are added, LocalStack's parity will be improved significantly.  

### Importance of Parity

Parity helps to build trust in LocalStack's service implementation. While this should already be reason enough to put focus on parity tests, there are sometimes also internals relying on a response to be in a certain format, or to have an exact wording.

To give you one example: recently, [we had a case](https://github.com/localstack/localstack/pull/5978), where a slightly different message from a `ValidationException` caused an entire cdk-deployment to fail. The only thing that had changed was the wording of the message contained in that exception. 

In turned out that the [aws-cdk verified the message of the exception](https://github.com/aws/aws-cdk/blob/v1-main/packages/aws-cdk/lib/api/util/cloudformation.ts#L35) like this:

```typescript

} catch (e) {
    if (e.code === 'ValidationError' && e.message === `Stack with id ${stackName} does not exist`) {
        return new CloudFormationStack(cfn, stackName, undefined);
    }
    throw e;
}
```

This highlights the importance of parity tests as a technique to ensure consistency and boost the confidence in LocalStack.

### Parity Tests in a Nutshell

Initially, a parity test is designed to run against AWS. Certain responses in the test will be marked to be part of the "snapshot". Those responses are collected and stored in json-format in a separate file, which we call the snapshot. 

The snapshot will be used to verify the behavior of LocalStack later on. 
As the initial test runs against AWS, we record the "ground truth". Consequent test runs will run against LocalStack.

During the test execution against LocalStack the responses will be collected, and then compared to the recorded snapshot from AWS. This way we can ensure that LocalStack behaves just like AWS.


### Snapshot Testing Framework

Of course, it is not possible to compare the response bit-by-bit or character-by-character. Obviously there might be unique identifiers in place (like region, account-id, ARNs, timestamps), that will be different for every execution. 

Thus we prepared a snapshot testing framework that on one hand replaces some common, pre-defined values with placeholders. On the other hand, it also allows to specify more complex replacements for specific API calls.

For this kind of replacement we use "transformers" that do the same kind of transformation when recording the original response from AWS, and when running the test against LocalStack.

Let's see in an example how this framework can be used.


#### Example of a Snapshot Integration Test

Assume we want to verify that the creation and invocation of a Lambda function has the same outcome in AWS and LocalStack:

- We construct our test case by adding the fixture _snapshot_.
- Next, we define all responses that should be part of the recorded snapshot.

```python
# add the fixture 'snapshot'
def test_basic_invoke(
        self, lambda_client, create_lambda, snapshot
    ):
			
    # custom transformers
    snapshot.add_transformer(snapshot.transform.lambda_api())

    # predefined name
    fn_name = f"ls-fn-{short_uid()}"

    # create the function
    response = create_lambda(FunctionName=fn_name, ...  )
    # record the response as part of the snapshot
    snapshot.match("lambda_create_fn", response)

    # invoke function
    invoke_result = lambda_client.invoke(FunctionName=fn_name, Payload=bytes("{}", "utf-8"))
    snapshot.match("lambda_invoke_result", invoke_result)

```

- Now, we need to [configure the AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- Additionally, we need to:
  - set the environment variable `TEST_TARGET=AWS_CLOUD`. 
    This instructs the framework to run the test against AWS.
  - enable the snapshot file creation, by running the test with the parameter `--snapshot-update`

The snapshot recording will look similar to this one:
```json
{
  "test_lambda_api.py::TestLambda::test_basic_invoke": {
    "recorded-date": ...,
    "recorded-content": {
      "lambda_create_fn": {
        "ResponseMetadata": {
          "HTTPStatusCode": 201,
          "HTTPHeaders": {}
        },
        "FunctionName": "<function-name:1>",
        "FunctionArn": "arn:aws:lambda:<region>:111111111111:function:<function-name:1>",
        "Runtime": "python3.9",
        "Role": "arn:aws:iam::111111111111:role/<resource:1>",
        "Handler": "index.handler",
        "CodeSize": 276,
        "Description": "",
        "Timeout": 3,
        "MemorySize": 128,
        "LastModified": "date",
        "CodeSha256": "zMYxuJ0J/jyyHt1fYZUuOqZ/Gc9Gm64Wp8fT6XNiXro=",
        "Version": "$LATEST",
        "TracingConfig": {
          "Mode": "PassThrough"
        },
        "RevisionId": "<uuid:1>",
        "State": "Pending",
        "StateReason": "The function is being created.",
        "StateReasonCode": "Creating",
        "PackageType": "Zip",
        "Architectures": [
          "x86_64"
        ],
        "EphemeralStorage": {
          "Size": 512
        }
      },
      "lambda_invoke_result": {
        "ResponseMetadata": {
          "HTTPStatusCode": 200,
          "HTTPHeaders": {}
        },
        "StatusCode": 200,
        "ExecutedVersion": "$LATEST",
        "Payload": {}
      }
    }
  }
}

```

For each `snapshot.match` call in the test, we see a corresponding json-response in the snapshot-file. 

The snapshot also indicates that some kind of transformation was applied on the actual response.

To outline a few transformations:
- The function names were replaced with `<function-name:1>` and allows to distinguish functions without revealing the actual name.
  - This can be very useful, e.g., when names are randomly generated in a test case.
  - We can see that the `FunctionName` is also contained in the `FunctionArn`, meaning that the function names were replaced everywhere.  
- The actual region was replaced by the placeholder `<region>`.
- The account-id was replaced by dummy account-id.
- The role-name was also replaced with a reference in the field `Role`. 



Next, the test can be run with LocalStack. Simply remove the ENV for `TEST_TARGET` and the parameter `--snapshot-update`.

When running this example against LocalStack, any differences between the recorded snapshots will be outlined:

{{< img src="blog-snapshot-diff.png" >}}

As you can see, there are some additional parameters in the AWS snapshot, that are missing in the LocalStack response, and vice versa. 

This information is very important and helps us to access, improve, and fix expected responses. 

While this is a just a simplified example, it showcases the power of the snapshot recording and testing. 

#### Parity Tests in Action

Snapshot tests should be the preferred way of writing new tests. However, some tests require additional preparation and setup to work against AWS, which naturally slows down the process of migration. 

We already have some snapshot tests included in our repository. 
In order to make the migration easier, we also added a marker `pytest.mark.skip_snapshot_verify` to temporarly disable the verification, which can be helpful when preparing or re-writing a test case. 

With this marker it is also possible to specify a list of json-paths, which would disable the verification of the snapshot only for the specified paths:

```python
@pytest.mark.skip_snapshot_verify(paths=["$..User.Tags"])
def test_iam_username_defaultname(deploy_cfn_template, iam_client, snapshot):
    snapshot.add_transformer(snapshot.transform.iam_api())
    snapshot.add_transformer(snapshot.transform.cloudformation_api())

    template = json.dumps(
        {
            "Resources": {
                "DefaultNameUser": {
                    "Type": "AWS::IAM::User",
                }
            },
            "Outputs": {"DefaultNameUserOutput": {"Value": {"Ref": "DefaultNameUser"}}},
        }
    )
    stack = deploy_cfn_template(template=template)
    user_name = stack.outputs["DefaultNameUserOutput"]
    assert user_name

    get_iam_user = iam_client.get_user(UserName=user_name)
    snapshot.match("get_iam_user", get_iam_user)
```

This can be helpful in a situation like in the test case `test_iam_username_defaultname` above: one attribute is added in the output, e.g., it is not returned by AWS, but returned by LocalStack. 

This strategy allows us to collect and outline deviations, while making sure that existing behavior is not broken accidentially. 


## Outlook
With the new AWS Server Framework we also introduced a metric collection utility. It enables us to collect details during the test execution, including used parameter values, or raised exceptions.

This information will help us to increase test coverage and consequently improve the parity with AWS. 

Additionally, we will provide regular metric updates and insights about supported services and operations. Thus our communication will be more transparent in terms of implemented APIs, and further improve the confidence overall. 

We hope you are as excited as we are about our AWS Framework, that ensures latest compatibility with AWS, and the new snapshot testing framework, that will help us to write validated test cases.