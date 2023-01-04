---
title: Introducing LocalStack Docker Extension for Docker Desktop
description: LocalStack's Docker Extension allows developers to easily manage and run cloud applications locally within Docker Desktop. With a fully-integrated experience with features such as configuration profiles, container logs and more, developers can now easily manage their LocalStack instance.
lead: LocalStack's Docker Extension allows developers to easily manage and run cloud applications locally within Docker Desktop. With a fully-integrated experience with features such as configuration profiles, container logs and more, developers can now easily manage their LocalStack instance.
date: 2023-01-04T4:18:20+05:30
lastmod: 2023-01-04T4:18:20+05:30
images: []
contributors: ["Harsh Mishra"]
tags: ['news']
leadimage: "header.png"
---

We are excited to announce the release of the LocalStack Docker Extension to help developers run their cloud & serverless applications locally. With our Docker Extension, developers can capitalize on a fully-integrated experience to manage their LocalStack image, configuration profiles, and container logs directly within the Docker Desktop. Docker Extensions was officially announced last year to help communities integrate new functionalities with the Docker Desktop, and we have worked closely with the Docker team to develop our extension!

At LocalStack, we aim to provide the best possible cloud development experience by enabling a highly efficient and fully local development & testing loop. Our cloud emulation (currently focused on AWS cloud) is shipped as a Docker image and has been pulled 120,000,000 times! With LocalStack’s Docker Extension, we aim to bring ease of management and an improved user experience to developers with a simple yet intuitive user interface as we continue to grow its capabilities for millions of Docker users!

To know more about Docker Extensions, check it out at [docs.docker.com/desktop/extensions](https://docs.docker.com/desktop/extensions/)!

{{< img-simple src="localstack-docker-extension-system-status.png" >}}

## Key Features

With LocalStack’s Docker Extension, we have focused on quicker deploy-test-redeploy cycles & better reproducibility. Developers always find themselves packaging, uploading, and deploying their code multiple times, and with LocalStack, they can create ephemeral resources locally, which can automatically be destroyed without inferring any costs. LocalStack provides [core cloud emulation](https://localstack.cloud/solutions/cloud-emulation/), [team collaboration](https://localstack.cloud/solutions/team-collaboration/), and [enterprise features](https://localstack.cloud/solutions/enterprise-integration/) to make it possible for developers to use and consume a local cloud stack.

The key features of LocalStack’s Docker Extension include:

-   **Control LocalStack instance**: With our Docker Extension, you can manage your LocalStack instance by starting, stopping, and restarting it from Docker Desktop. You can easily visualize the current status of the container and tear down resources at will.
-   **Manage configuration profiles**: You can also create, use and manage profiles for your LocalStack instance through configurations. It allows you to easily set up your API keys or any other environment variable without needing to load it from CLI.
- **View LocalStack logs**: You can view log information for your LocalStack instance and see the available services and their status on the service page.

## Installation

To install LocalStack’s Docker Extension, you need to have the latest version of Docker Desktop (at least v4.8+) installed on your machine. Navigate to the **Preferences** tab, and check the **Enable Docker Extensions** under the **Extensions** tab. To set up the Docker Extension by building the image locally, you can clone our Docker Desktop extension repository and run the following command:

```sh
git clone https://github.com/localstack/localstack-docker-extension
```

To install the extension, run the following command:

```sh
make install-extension
```

Alternatively, you can install the LocalStack Extension for Docker Desktop by pulling our public Docker image from Docker Hub:


```sh
docker extension install localstack/localstack-docker-desktop:0.3.0
```

> Note: LocalStack’s Docker Extension is not yet available on the Docker Desktop marketplace, and we continue to work with the Docker team to make it available.

Once the extension is installed, you will need to initialize a few settings before getting started! Navigate to our [official documentation](https://docs.localstack.cloud/user-guide/tools/docker-desktop-extension/) to start the initialization process, which involves setting up a new configuration profile, creating a mount point, and adding LocalStack’s cache to be bind-mounted into our running container!

After a successful installation, click on **Start** to get started using LocalStack. If LocalStack’s Docker image isn’t present, the extension will pull it automatically (which will take some time). After making some API calls, you will notice the services that are running currently.

{{< img-simple src="localstack-docker-extension-running-services.png" >}}

You can also navigate the **Logs** tab to see if a particular API request has gone wrong and further debug it through the logs. To get further visibility into your logs, set `DEBUG=1` or `LS_LOG=trace` in your configuration profile.

{{< img-simple src="localstack-docker-extension-logs.png" >}}

Finally, you can create a configuration profile, under **Configurations** tab, which you can select before starting the Docker container. The configuration profiles can contain specific LocalStack Configuration variables or API keys which would be directly passed to the running LocalStack container and alter the behaviour of LocalStack!

{{< img-simple src="localstack-docker-extension-configuration-profile.png" >}}

## Conclusion

We have released an initial version of LocalStack’s Docker Extension, and we will continue adding more features to it to make your local cloud development workflow as smooth as possible. Our upcoming plans include the following:

- Bring you more visibility inside your LocalStack instance runs
- Enable more seamless compatibility with our [LocalStack Web App](https://app.localstack.cloud/)
- Provide an intuitive integration with LocalStack tools, like [Cloud Pods](https://docs.localstack.cloud/user-guide/tools/cloud-pods/)!

LocalStack’s Docker Extension is an [open-source, community-focused project](https://github.com/localstack/localstack-docker-extension) to help our users control their LocalStack container via a user interface. If you'd like to learn more, share your feedback, and contribute to the development of the Extension, reach out to us via [Discussion Pages](https://discuss.localstack.cloud/).

## Acknowledgements

Huge kudos go out to Luca Pivetta for working on the LocalStack's Docker Extension, and making invaluable contributions by navigating across the Extensions SDK and building the first version. We would also like to thank the Docker team for their invaluable feedback on the user-interface and functionality, which improved our Extension significantly.
