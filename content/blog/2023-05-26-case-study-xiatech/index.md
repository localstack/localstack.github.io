---
title: Xiatech accelerates their development workflows on cloud using LocalStack
description: Xiatech uses a complete, localized AWS environment where developers can build, test, profile and debug infrastructure with LocalStack to accelerate their engineering efforts. In this case study, we talk with Xiatech's Head of Engineering, Rick Timmis about their experience using LocalStack to improve their developer experience and cloud feedback loop!
lead: Xiatech uses a complete, localized AWS environment where developers can build, test, profile and debug infrastructure with LocalStack to accelerate their engineering efforts. In this case study, we talk with Xiatech's Head of Engineering, Rick Timmis about their experience using LocalStack to improve their developer experience and cloud feedback loop!
date: 2023-05-26
lastmod: 2023-05-26
contributors: ["LocalStack Team"]
tags: ["case-study"]
leadimage:
layout: case-study
logo: xiatech-logo.png
properties:
  - key: Name
    value: Xiatech
  - key: Description
    value: Xiatech pioneered Xfuze Hyper-Integration Platform, a new category of software that accelerates time to business value for organisations via system integration & data insights
  - key: Location
    value: London, England
  - key: Industry
    value: Technology, Information and Internet
  - key: Employees
    value: 70+
  - key: AWS Services
    value:
      - Lambda
      - SQS
      - Kinesis
      - DocumentDB
      - DynamoDB
  - key: Integrations
    value:
      - Testcontainers
      - Terraform
      - Terragrunt
---
<div class="quote-container mt-4">

  > _“Our engineering team utilizes LocalStack to provide a complete, localized AWS environment where developers can build, test, profile and debug infrastructure and code ahead of deployment to the cloud.”_
  <div class="quote-author">
    <p><a href="https://www.linkedin.com/in/rick-timmis-6a1437/">Rick Timmis</a>,</p>
    <p>Head of Engineering at <a href="https://www.xiatech.co.uk/">Xiatech</a></p>
  </div>
</div>

<div class="lead-content">
  <p>Xiatech helps organizations and users connect systems, unify data, and make data-driven decisions with artificial intelligence via a continuous flow of actionable insights. Xiatech’s flagship platform is Xfuze, a hyper-integration platform that helps customers shorten to insight, create value from data and turbocharge legacy technology investments. Xfuze integrates with various systems like customer relationship management (CRM), enterprise resource planning (ERP), logistics, warehousing, marketing, and different cloud-based systems. Xfuze creates a central, singular view of data which then helps provide automation, data management, continuous insights and advanced analytics — all in one solution.</p>

  <p>Xiatech deploys Xfuze across cloud providers, including Amazon Web Service (AWS) and Google Cloud Platform. Their Hyper-Integration platform utilizes an event driven architecture, and leverages many distributed computing technologies, including SQL/NoSQL databases, cloud functions, and AWS Serverless technologies. Cloud infrastructure is orchestrated using Terraform, and Terragrunt to co-ordinate the compute resources upon which Xfuze stands.</p>

  <p>We spoke with Rick Timmis, Head of Engineering at Xiatech, to learn more about how LocalStack has helped their organization accelerate its cloud development workflows with LocalStack and empowered engineers to be independent of their local development and test toolings.</p>
</div>

## Challenge

The challenge for engineers includes vast amounts of technologies, ranging from SOAP or XML APIs to RESTful services, and the need to provide integrations with Lambda, SQS, Kinesis, DocumentDB, DynamoDB and more. As an engineer, orchestrating these serverless technologies via a command-line interface and developing/debugging the services was very slow and tedious. 

To solve this problem, Xiatech created a developer-experience (DevEx) environment to bring forward a localized environment on the individual machines used by engineers to enable them to run integrations between one system and another. It would allow them to run these simulations and profile, debug, and check the memory state and the stack — all on their IDEs. 

This is where Xiatech came across TestContainers. Given that Xiatech uses Golang as the primary-used language, Testcontainers-Go was picked up to create and clean up container-based dependencies for automated tests. Xiatech started building endpoints to provide multiple functionalities like HTTP replayers to provide simulations for RESTful endpoints for a CRM system, simulating SOAP-API containers, and more.

However, Xiatech was still stuck with running containerized pieces of code for other parts like Lambda functions or DynamoDB, which was challenging. Deciding to explore further options, LocalStack popped up!

## Solution

Xiatech initially explored the open-source, community version of LocalStack through a proof-of-concept with a basic set of AWS APIs. Xiatech had tremendous success with LocalStack, allowing them to create integrations and end-to-end tests. Today, Xiatech’s Testcontainers framework, with LocalStack enabled, allows developers to do unit, interaction, smoke, and end-to-end (E2E) testing.

<div class="quote-container mt-4">

  > _“We have enabled each software engineer to be fully independent with local development and testing tooling, and this has proved to be a key accelerator for our engineering team.”_
  <div class="quote-author">
    <p><a href="https://www.linkedin.com/in/rick-timmis-6a1437/">Rick Timmis</a>,</p>
    <p>Head of Engineering at <a href="https://www.xiatech.co.uk/">Xiatech</a></p>
  </div>
</div>

Enterprise LocalStack now allows Xiatech’s engineers to run end-to-end integrations with multiple simulations, like a CRM system delivering customer information through a serverless stack and then appending the data to an ERP system. Engineers can now visualize this whole workflow on an individual developer machine, allowing an engineer to understand how their code works and acts as a massive accelerator!

## Results

### 10x reduction in infrastructure spin-up with LocalStack in comparison to AWS

LocalStack has simplified and accelerated the infrastructure spin-up for Xiatech’s engineering products by 10-times. The infrastructure is defined using Terraform, allowing for a high level of automation and repeatability in the creation of resources. According to Rick, using the real AWS APIs used to take around 20 minutes to provision all the real cloud resources for the simulation to happen before tearing down everything. With LocalStack, this duration has been reduced to just 2 minutes on an individual developer's machine, thus fostering a culture of frequent testing, and increasing the reliability and efficiency of local testing & debugging.

### An improved development workflow with Testcontainers

Today, Xiatech uses LocalStack with tight integration with the Testcontainers framework, which empowers engineers to develop, test and release without caring about how LocalStack works under the hood. With the level of abstraction provided by Testcontainers, an engineer can use Terragrunt to kick off Terraform and spin up the local AWS infrastructure using LocalStack, which can be further analyzed before tearing the whole infrastructure down.
