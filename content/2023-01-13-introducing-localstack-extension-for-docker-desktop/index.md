---
title: Introducing LocalStack Docker Extension for Docker Desktop
description: LocalStack's Docker Extension allows developers to manage and run cloud applications locally within Docker Desktop easily. With a fully-integrated experience with features such as configuration profiles, container logs, and more, developers can now easily manage their LocalStack instance.
lead: LocalStack's Docker Extension allows developers to manage and run cloud applications locally within Docker Desktop easily. With a fully-integrated experience with features such as configuration profiles, container logs, and more, developers can now easily manage their LocalStack instance.
date: 2023-01-13
lastmod: 2023-01-13
contributors: ["Harsh Mishra"]
tags: ['news']
leadimage: "localstack-docker-extension-cover-image.png"
---

{{< img src="localstack-docker-extension-cover-image.png" >}}

We are excited to announce the release of the **LocalStack Docker Extension** to help developers run their cloud & serverless applications locally. With our [Docker Extension](https://www.docker.com/products/extensions/), developers can capitalize on a fully-integrated experience to manage their LocalStack image, configuration profiles, and container logs directly within the Docker Desktop. Docker Extensions was officially announced last year to help communities integrate new functionalities with the Docker Desktop, and we have worked closely with the Docker team to develop our extension!

At LocalStack, we aim to provide the best possible cloud development experience by enabling a highly efficient and fully local development & testing loop. Our [cloud emulation](https://localstack.cloud/solutions/cloud-emulation/) (currently focused on AWS cloud) is shipped as a Docker image and has been pulled 120,000,000 times! With LocalStack’s Docker Extension, we aim to bring ease of management and an improved user experience to developers with a simple yet intuitive user interface as we continue to grow its capabilities for millions of Docker users!

To know more about Docker Extensions, check it out at [docs.docker.com/desktop/extensions](https://docs.docker.com/desktop/extensions/)!

{{< img-simple src="localstack-docker-extension-system-status.png" alt="Screenshot of LocalStack's Docker Extension showing the availability of various AWS services through the Docker image">}}

## Key Features

With LocalStack’s Docker Extension, we have focused on quicker deploy-test-redeploy cycles & better reproducibility. Developers always find themselves packaging, uploading, and deploying their code multiple times, and with LocalStack, they can create ephemeral resources locally, which can automatically be destroyed without inferring any costs. LocalStack provides [core cloud emulation](https://localstack.cloud/solutions/cloud-emulation/), [team collaboration](https://localstack.cloud/solutions/team-collaboration/), and [enterprise features](https://localstack.cloud/solutions/enterprise-integration/) to make it possible for developers to use and consume a local cloud stack.

The key features of LocalStack’s Docker Extension include:

-   **Control LocalStack instance**: With our Docker Extension, you can manage your LocalStack instance by starting, stopping, and restarting it from Docker Desktop. You can easily visualize the current status of the container and tear down resources at will.
-   **Manage configuration profiles**: You can also create, use and manage profiles for your LocalStack instance through configurations. It allows you to easily set up your API keys or any other environment variable without needing to load it from CLI.
- **View LocalStack logs**: You can view log information for your LocalStack instance and see the available services and their status on the service page.

## Installation

To install LocalStack’s Docker Extension, you need to have the latest version of Docker Desktop (at least v4.8+) installed on your machine. Navigate to the **Preferences** tab, and check the **Enable Docker Extensions** under the **Extensions** tab.

{{< img-simple src="localstack-docker-extension-preferences-tab.png" alt="Image of Docker Desktop's Preferences Tab with the 'Enable Docker Extension' option checked, allowing the use of the Docker Extension!">}}

The LocalStack Extension for Docker Desktop is validated and available on the Extensions Marketplace. To get started, search for **Localstack** in the Extensions Marketplace, and click on the **Install** button.

{{< img-simple src="localstack-docker-extension-marketplace.png" alt="Screenshot of LocalStack's Extension on Docker Desktop's Extension Marketplace">}}

Alternatively, you can install the LocalStack Extension for Docker Desktop by pulling our [public Docker image](https://hub.docker.com/r/localstack/localstack-docker-desktop) from [Docker Hub](https://hub.docker.com/):

```sh
docker extension install localstack/localstack-docker-desktop:0.3.1
```

## Getting started

After installation, you will need to initialize a few settings before getting started! While opening the extension for the first time, you’ll be prompted to a mount point for your LocalStack container. You can open the drop-down and choose your username. Additionally, you can change this setting by navigating to the **Configurations** tab and selecting the mount point.

{{< img-simple src="localstack-docker-extension-mount-point.png" alt="Screenshot of LocalStack Extension's drop-down menu prompting the user to set the mount point for the LocalStack container">}}

After a successful installation, click on **Start** to get started using LocalStack. If LocalStack’s Docker image isn’t present, the extension will pull it automatically (which will take some time). After making some API calls, you will notice the services that are running currently.

{{< img-simple src="localstack-docker-extension-running-services.png" alt="Image of LocalStack Docker Extension displaying the services currently running">}}

You can also navigate the **Logs** tab to see if a particular API request has gone wrong and further debug it through the logs. To get further visibility into your logs, set `DEBUG=1` or `LS_LOG=trace` in your configuration profile.

{{< img-simple src="localstack-docker-extension-logs.png" alt="Image of LocalStack Docker Extension displaying log information">}}

Finally, you can create a configuration profile, under **Configurations** tab, which you can select before starting the Docker container. The configuration profiles can contain specific LocalStack Configuration variables or API keys which would be directly passed to the running LocalStack container and alter the behaviour of LocalStack!

{{< img-simple src="localstack-docker-extension-configuration-profile.png" alt="Image of LocalStack Docker Extension displaying configuration profile">}}

## Conclusion

We have released an initial version of LocalStack’s Docker Extension, and we will continue adding more features to it to make your local cloud development workflow as smooth as possible. Our upcoming plans include the following:

- Bring you more visibility inside your LocalStack instance runs
- Enable more seamless compatibility with our [LocalStack Web App](https://app.localstack.cloud/)
- Provide an intuitive integration with LocalStack tools, like [Cloud Pods](https://docs.localstack.cloud/user-guide/tools/cloud-pods/)!

LocalStack’s Docker Extension is an [open-source, community-focused project](https://github.com/localstack/localstack-docker-extension) to help our users control their LocalStack container via a user interface. If you'd like to learn more, share your feedback, and contribute to the development of the Extension, reach out to us via [Discussion Pages](https://discuss.localstack.cloud/).

## Acknowledgements

Huge kudos go out to [Luca Pivetta](https://github.com/Pive01) for working on the LocalStack's Docker Extension, and making invaluable contributions by navigating across the Extensions SDK and building the first version. We would also like to thank the Docker team for their invaluable feedback on the user-interface and functionality, which improved our Extension significantly.
