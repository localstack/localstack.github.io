We want to show you how easy it is to use LocalStack and get started with local cloud development.
AWS Lambda and S3 are some of the most used Cloud services, and running Lambdas and letting them access S3 Buckets in LocalStack is easy as pie! 

#### Get Ready

All you need is [Docker](https://docs.docker.com/get-docker/), [Python](https://docs.python.org/3/using/index.html), and [pip](https://pip.pypa.io/en/stable/installation/) installed on your machine.
If you want to the full picture, you can read our [Get Started guide](https://docs.localstack.cloud/get-started/).
Keep reading for the fast track!

Next, we will download `localstack` and `awslocal`, which makes working with LocalStack much easier:

```bash
docker pull localstack/localstack
pip install localstack awscli-local
```

To start LocalStack in the background and wait for it to start, simply run:

```bash
localstack start -d
localstack wait
```

#### Download the Lambda code

We've prepared a Lambda function that generates a highly official looking LocalStack local dev certificate for you.
Definitely put it on your CV, companies will be impressed!

You can find the complete source code [in our GitHub repository](https://github.com/localstack/devops-barcelona-2022/tree/main/contest),
but you can also just download the lambda using the following command:

```bash
wget -O demo-lambda.zip https://github.com/localstack/devops-barcelona-2022/raw/main/contest/demo-lambda.zip
```

#### Run the Lambda

To run AWS commands, you can either use the aws CLI directly, by using `aws --endpoint-url http://localhost:4566`, or use our convenience tool `awslocal`.

First we create the Lambda using the provided zip file:
```bash
awslocal lambda create-function \
        --function-name localstack-demo-lambda \
        --runtime python3.8 \
        --handler handler.handler \
        --zip-file fileb://demo-lambda.zip \
        --role arn:aws:iam::000000000000:role/lambda-ex
```

Next, we run the lambda - make sure you use the email address you provided when signing up for Localstack:
```bash
awslocal lambda invoke \
        --function-name localstack-demo-lambda \
        --payload '{"email": "thomas@localstack.cloud"}' /tmp/lambda.out
```

Our Lambda created a new S3 bucket to save the result of our lambda - let's copy back the result to our local machine:
```bash
awslocal s3 cp s3://localstack-demo/certificate.pdf certificate.pdf
```

Now, open the `certificate.pdf` in your PDF viewer. 🪄📜

---

**Come visit our booth with your certificate to enter the raffle for a chance to win a prize! 🏆**
Ok, technically you're already in the pool, but we'd love to talk to you anyway.
