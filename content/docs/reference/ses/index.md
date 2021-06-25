---
title: "Simple Email Service (SES)"
description: ""
lead: ""
date: 2021-06-25T18:13:30+02:00
lastmod: 2021-06-25T18:13:30+02:00
draft: false
images: []
menu: 
  docs:
    parent: "reference"
weight: 999
toc: true
---

The Pro version ships with extended support Simple Email Service (SES), including a simple user interface to inspect email accounts and sent messages, as well as support for sending SES messages through an actual SMTP email server.

Please refer to the [Configuration section](#configuration) for instructions on how to configure the connection parameters of your SMTP server (`SMTP_HOST`/`SMTP_USER`/`SMTP_PASS`).

Once your SMTP server has been configured, you can use the SES user interface in the Web app to create a new email account (e.g., `user1@yourdomain.com`), and then send an email via the command line (or your SES client SDK):
```
$ awslocal ses send-email --from user1@yourdomain.com --message 'Body={Text={Data="Lorem ipsum dolor sit amet, consectetur adipiscing elit, ..."}},Subject={Data=Test Email}' --destination 'ToAddresses=recipient1@example.com'
```

The [Web user interface](https://app.localstack.cloud) then allows you to interactively browse through the sent email messages, as illustrated in the screenshot below:

{{< img-simple src="sesInterface.png" alt="SES Web Interface" >}}
