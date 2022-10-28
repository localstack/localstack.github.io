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

We've prepared a Lambda function that generates a highly official looking LocalStack participation certificate for you.
You can find the complete source code here, but can also just download from here, or using the following command:

```bash
wget -O cert-lambda.zip https://... TODO
```

#### Run the Lambda
First we create the Lambda using the provided zip file:
```bash
awslocal lambda create-function \
        --function-name ls-lambda-func \
        --runtime python3.8 \
        --handler handler.handler \
        --zip-file fileb://cert-lambda.zip \
        --role arn:aws:iam::000000000000:role/lambda-ex
```

Next, we run the lambda - make sure you use the email address you provided when signing up for Localstack:
```bash
awslocal lambda invoke \
        --function-name ls-lambda-func \
        --payload '{"email": "thomas@localstack.cloud"}' /tmp/lambda.out
```

Our Lambda created a new S3 bucket to save the result of our lambda - let's copy back the result to our local machine:
```bash
awslocal s3 cp s3://test-bucket//certificate.pdf certificate.pdf
```

Now, open the `certificate.pdf` in your PDF viewer. 🪄📜

---

**Come visit our booth with your certificate to enter the raffle for a chance to win a prize! 🏆**
(Technically you're already in the pool, but we'd love to talk to you).
