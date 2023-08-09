---
title: OpenFABR leverages LocalStack for Infrastructure as Code for local development & validation
description: OpenFABR leverages LocalStack for Infrastructure as Code for local development & validation
lead: OpenFABR leverages LocalStack for Infrastructure as Code for local development & validation
date: 2023-07-05
lastmod: 2023-07-05
contributors: ["LocalStack Team"]
leadimage: "localstack-openfabr-case-study-lead-image.png"
tags: ["case-study"]
layout: case-study
properties:
  - key: Name
    value: OpenFABR
  - key: Description
    value: OpenFABR is a group of open source projects developed and sponsored by FABR, a developer experience and tooling company specialising in cloud infrastructure
  - key: Location
    value: London, England
  - key: Industry
    value: Technology, Information and Media
  - key: AWS Services
    value:
      - S3
      - Lambda
      - EKS
      - ECS
      - RDS
      - DynamoDB
  - key: Integrations
    value:
      - Cloud Development Kit
      - Pulumi
---
<div class="quote-container mt-4">

  > _“LocalStack has revolutionized our development process by providing seamless Infrastructure-as-Code validation, rapid resource spin-up, and streamlined testing. It's an essential component of our development toolkit and has greatly enhanced our team's agility & efficiency.”_
  <div class="quote-author">
    <p><a href="https://www.linkedin.com/in/janakaabeywardhana/">Janaka Abeywardhana</a>,</p>
    <p>Co-Founder — CPTO at <a href="https://fabrhq.com/">FABR</a></p>
  </div>
</div>

<div class="lead-content">
  <p>FABR is a cloud infrastructure and tooling company that addresses critical challenges in building and managing cloud infrastructure for application development across multiple public cloud providers. The company takes an open-source approach by establishing the OpenFABR Cloud Development Framework (CDF), an open-source project aimed at assisting developers in constructing cloud infrastructure using Infrastructure-as-Code (IaC) foundations. While various IaC frameworks have been developed, there has been a recent trend toward imperative programming languages with  CDK and Pulumi. OpenFABR CDF provides a modular and customizable solution, emphasizing cloud abstractions and open specifications for building cloud infrastructure.</p>

  <p>Various IaC tools, imperative languages, testing libraries, and artifacts are integrated by leveraging CDF. CDF packages serve as building blocks, offering abstractions for common scenarios and use cases. For example, developers can use CDF to build a container-based runtime on EKS or ECS, consolidating all the necessary specifications into a single configuration file. FABR Infra enables the combining these packages with a configuration file and facilitates infrastructure deployment through a CI/CD pipeline fully managed by CDF.</p>

  <p>To gain further insights into utilizing LocalStack, we interviewed Janaka Abeywardhana, Co-founder and CPTO at FABR. He highlighted how LocalStack has significantly contributed to the speed and reliability of OpenFABR CDF's package development and the overall stability of their Infrastructure-as-Code pipelines by leveraging LocalStack's blazing-fast local cloud emulation for development and testing purposes.</p>
</div>

## Challenge

The initial challenge for OpenFABR developers was setting up a quick development & testing loop with AWS. Formerly, every developer was supposed to get access to an AWS account and various services which were required to test the multiple APIs available and the packages being built. While this approach of testing directly on AWS provided a verifiable result, quick feedback & iteration was missing where developers can discover and fix bugs locally before re-deploying them.

Moreover, testing directly on the AWS Cloud proved time-consuming and expensive. Many of the CDF packages being developed took several minutes to deploy and test against real AWS resources. This caused friction, slowed review cycles, and hindered the ability to detect bugs locally before deploying it to AWS while using real resources. 

To address these challenges, Janaka explored different options to enable developers to safely test various AWS services, build and test their CDF packages reliably, and establish a rapid feedback loop that saves time and money. This was when Janaka discovered LocalStack, a cloud development platform that emulates a high-fidelity environment similar to AWS, providing all the advantages of a first-class local cloud stack, seamlessly integrating with popular Infrastructure-as-Code providers.

## Solution

During his exploration, Janaka discovered LocalStack and the Pro plan, which offered the capability to emulate sophisticated and exotic AWS services such as RDS and Aurora on his local developer machine. The concept of a core cloud emulator running as a Docker container in both local and continuous integration environments intrigued him. Janaka recognized the value of LocalStack Pro and decided to integrate it directly into his development and testing workflow. To support the community maintainers and continue utilizing LocalStack Pro features for the open-source CDF project, Janaka took advantage of the open-source license program offered by LocalStack.

Janaka enthusiastically describes his experience with LocalStack, stating, "Straight away, out of the box — it works! The speed at which you can iterate while developing Infrastructure as Code is incredible, and it allows for easily catching low-hanging fruit in a productive manner." Leveraging LocalStack for end-to-end Infrastructure as Code testing has enabled Janaka to validate configurations, detect early bugs and regressions, and significantly reduce the time and cost associated with deploying infrastructure on the AWS.

<div class="quote-container mt-4">

  > _“With LocalStack, we have been able to build & test our open-source CDF packages with much less reliance on cloud resources. It has reduced our cloud bill and improved our inner development loop speed!”_
  <div class="quote-author">
    <p><a href="https://www.linkedin.com/in/janakaabeywardhana/">Janaka Abeywardhana</a>,</p>
    <p>Co-Founder — CPTO at <a href="https://fabrhq.com/">FABR</a></p>
  </div>
</div>

By adopting LocalStack, the CDF developers have eliminated the additional friction caused by latency and embraced the AWS parity provided by LocalStack. Janaka and his team now utilize LocalStack not only for testing CDF packages but also for building sample applications that demonstrate the usage of the CDF framework with various Infrastructure-as-Code providers, such as Pulumi. This approach allows CDF users to reliably test their packages without deploying to AWS, instead relying on LocalStack's local cloud emulator for infrastructure testing before pushing to production.

## Results

### Accelerating Resource Creation by 70% Compared to AWS

While AWS excels in optimized production workloads and scaling capabilities, it falls short when it comes to local development and testing workflows. Spinning up AWS resources in such environments introduces significant time consumption and latency, hindering the establishment of a rapid feedback loop. Recognizing this challenge, OpenFABR has harnessed the power of LocalStack to streamline resource deployment for development setups.

In traditional AWS setups, some resource creation could  require over  15 minutes, for example sipinning up an RDS instance. However, LocalStack dramatically reduces this deployment time, allowing developers to complete the same process in 1-2 minutes. This remarkable time reduction underscores the efficiency and agility that LocalStack brings to the forefront, enabling developers to accelerate their development cycles and drive productivity.

### Streamlined Testing and Enhanced IaC Code Validation with LocalStack

LocalStack revolutionizes the process of writing Infrastructure-as-Code (IaC) by providing developers with a reliable platform for validating the code's validity and stability. With comprehensive support for major IaC providers such as Terraform, CDK, Pulumi, and CloudFormation, LocalStack empowers developers to shift their focus towards enhancing their application's cloud-native capabilities rather than grappling with the intricacies of AWS testing and IaC code validation.

The capabilities of the OpenFABR Cloud Development Framework (CDF) in abstracting infrastructure while enabling the design, deployment, and maintenance of cloud-native setups on AWS make it essential to leverage a cloud emulation platform like LocalStack. By harnessing LocalStack, CDF developers can rigorously implement an IaC code validation pipeline on their local machines and CI environments (GitHub Actions in this case) to deliver stable packages while continuously building a new framework that is reusable, customizable, and schema-aware.

## Conclusion

LocalStack provides robust support and seamless integration into the development workflow, enabling developers to confidently validate their Infrastructure-as-Code (IaC) code, ensuring reliability and adherence to best practices. This empowers them to focus on innovation and refining their cloud-native solutions while leveraging LocalStack's cloud emulation capabilities throughout the development and testing stages. 

With LocalStack, developers can expedite resource deployment, optimizing cloud infrastructure setup and testing. This enhanced efficiency not only boosts productivity but also enhances the overall agility of the development process. LocalStack serves as an invaluable tool for cloud developers, offering unparalleled speed and effectiveness in local development and testing workflows.
