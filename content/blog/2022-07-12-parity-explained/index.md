---
title: LocalStack and AWS Parity Explained
description: ""
lead: ""
date: 
lastmod: 
images: [""]
contributors: [""]
tags: ['news']
---

Parity has been a major concern for LocalStack since the very beginning. Our goal is to provide the best possible experience for cloud developer. Naturally we want to make sure that LocalStack is reliable - meaning that running the same commands against AWS and LocalStack results in the same outcome. 

Recently we have introduced some mechanics to ensure the parity of AWS and LocalStack increases steadily, and that the implemenation stays up-to-date.

This approach includes weekly, automated updates of API stubs, which verifies the operation definitions of each service in LocalStack are compatible with the latest changes in `botocore`.
Further, we have been working on a new testing approach, called "snapshot testing", that enables compatibility checks of LocalStack vs. AWS.
Additionally, we have started to collect parity metrics, which will give a handy overview of operations that are covered with LocalStack's integration tests, alongside with information about implementation status for each supported service. 


## Automated ASF Updates

Our AWS Service Framework (ASF) contains the service and operations definitions of all AWS services supported by LocalStack.
To generate these APIs LocalStack uses the definitions of the python package `botocore` - which is also a major part of the AWS CLI, and `boto3`. 
We have a Github action in place, that checks for any API changes and will raise a pull request (PR) automatically in case changes are detected. As the PR still runs all integration tests, and further has to be approved and merged manually, we ensure that nothing breaks accidentially. 
Of course, newly added operations will not work out-of-the box - by default all operations that are not implemented will throw a `NotImplementedError` upon calling. However, we ensure that the declaration of each operation is compatible with AWS.


## Parity Tests with Snapshot Testing

Parity tests are a special form of integration tests that should verify the correctness of LocalStack compared to AWS. Recently, we have introduced this type of AWS compatible tests, with an approach that we call "snapshot testing".

Over time, as more parity tests are added, LocalStack's parity will be improved significantly.  

### Importance of Parity

Parity helps build trust in LocalStack's service implementation. While this should already be reason enough, to put focus on parity tests, there are sometimes also internals that rely on responses in a certain format, or an exact wording.

Recently, [we had a case](https://github.com/localstack/localstack/pull/5978), where a slightly different message from a `ValidationException` caused a cdk-deployment to fail. In turned out that [aws-cdk verified the message of the exception](https://github.com/aws/aws-cdk/blob/v1-main/packages/aws-cdk/lib/api/util/cloudformation.ts#L35), e.g. 

```typescript
...

} catch (e) {
    if (e.code === 'ValidationError' && e.message === `Stack with id ${stackName} does not exist`) {
        return new CloudFormationStack(cfn, stackName, undefined);
    }
    throw e;
}
```

Thus parity tests are even important when verifying error messages.


### Parity Tests in a Nutshell

Initially, a parity test is executed against AWS. In the test certain responses are marked to be part of the "snapshot". Those responses will be collected and stored in json-format in a separate *<test_file_name>.snapshot.json* file. This snapshot contains the recorded responses that will be used to verify the behavior of LocalStack later on.
In general this initial test run against AWS is executed for the sake of collecting the "ground truth". Consequent test runs will only run against LocalStack.

During the test execution against LocalStack, the test collects the same responses that are marked in the test, and then compares the result with the recorded snapshot from AWS. This way we can ensure that LocalStack behaves just like AWS.


### Snapshot Testing Framework

Of course, it is not possible to compare the response bit-by-bit or character-by-character. There might be unique identifiers in place (like region, account-id, ARNs, timestamps), that will be different for every execution. 
Thus we prepared a snapshot testing framework that on one hand replaces some common, pre-defined values with placeholders. On the other hand, it also allows to specify more complex replacements for specific API calls. 
For this kind of replacement we use "transformers" that do the same kind of transformation when recording the original response from AWS, and when running the test against LocalStack.

Let's see in an example how this framework can be used.


### Example of a Snapshot Integration Test
Assume we want to verify that creation of two Lambda functions and their invocations has the same outcome in AWS and LocalStack:

- We construct our test case by adding the fixture _snapshot_.
- Next, we define all responses that should be part of the recorded snapshot.

```python
# add the fixture 'snapshot'
def test_basic_invoke(
        self, lambda_client, create_lambda, snapshot
    ):
			
    # custom transformers
    snapshot.add_transformer(snapshot.transform.lambda_api())

    # predefined names for functions
    fn_name = f"ls-fn-{short_uid()}"
    fn_name_2 = f"ls-fn-{short_uid()}"

    # create function 1
    response = create_lambda(FunctionName=fn_name, ...  )
    # record the response as part of the snapshot
    snapshot.match("lambda_create_fn", response)

    # create function 2
    response = create_lambda(FunctionName=fn_name_2, ...  )
    # record the response as part of the snapshot
    snapshot.match("lambda_create_fn_2", response)

    # get function 1
    get_fn_result = lambda_client.get_function(FunctionName=fn_name)
    # record the response as part of the snapshot
    snapshot.match("lambda_get_fn", get_fn_result)

    # get function 2
    get_fn_result_2 = lambda_client.get_function(FunctionName=fn_name_2)
    # record the response as part of the snapshot
    snapshot.match("lambda_get_fn_2", get_fn_result_2)
```

- Now, we need to [configure out AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- Additionally, we need to:
  - set the environment variable `TEST_TARGET=AWS_CLOUD` - this constructs the framework to run the test against AWS.
  - run the test with the parameter `--snapshot-update` - which will create the actual snapshot file.

The (simplified) snapshot recording will look similar to this one:
```json
{
  "test_lambda_api.py::TestLambda::test_basic_invoke": {
    "recorded-date": ...,
    "recorded-content": {
      "lambda_create_fn": {
       ...
        "FunctionName": "<function-name:1>",
        "FunctionArn": "arn:aws:lambda:<region>:111111111111:function:<function-name:1>",
        "Runtime": "python3.9",
        "Role": "arn:aws:iam::111111111111:role/<resource:1>",
        ...
      },
      "lambda_create_fn_2": {
        ...
        "FunctionName": "<function-name:2>",
        "FunctionArn": "arn:aws:lambda:<region>:111111111111:function:<function-name:2>",
        "Runtime": "python3.9",
        "Role": "arn:aws:iam::111111111111:role/<resource:1>",
        ...
      },
      "lambda_get_fn": {
        ...
        "Configuration": {
          "FunctionName": "<function-name:1>",
          "FunctionArn": "arn:aws:lambda:<region>:111111111111:function:<function-name:1>",
          "Runtime": "python3.9",
          "Role": "arn:aws:iam::111111111111:role/<resource:1>",
         ...
      },
      "lambda_get_fn_2": {
        ...
        "Configuration": {
          "FunctionName": "<function-name:2>",
          "FunctionArn": "arn:aws:lambda:<region>:111111111111:function:<function-name:2>",
          "Role": "arn:aws:iam::111111111111:role/<resource:1>",
          ....
        },
      },

    }
  }
}

```

For each `snapshot.match` call in the test, we see a corresponding json-response in the snapshot-file. 

This example shows that some form of transformation was applied on the actual response:
- The function name was replaced with references. We can see that the `FunctionName` is also contained in the `FunctionArn`. This allows distinguishing `fn_name` and `fn_name_2` defined the test without revealing the actual name of the function.
- The actual region was replaced by the placeholder `<region>`.
- The account-id was replaced by dummy account-id.
- The role-name was also replaced with a reference in the field `Role`. 

**TODO** -> will we enable `--snapshot-verify` by default?

Next, the test can be run with LocalStack. Simply remove the ENV for `TEST_TARGET` and the parameter `--snapshot-update`.

**TODO** mention decorator for `pytest.mark.skip_snapshot_verify`?

## Parity Metrics



## Outlook


