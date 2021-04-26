---
title: "Troubleshooting"
description: "Solutions to common problems."
lead: "Solutions to common problems."
date: 2021-04-26T18:56:25+02:00
lastmod: 2021-04-26T18:56:25+02:00
draft: false
images: []
menu: 
  docs:
    parent: "help"
weight: 620
toc: true
---

## Common issues

This section contains a number of common known issues and solutions to fix them.

* If you get an error `proxy: listen udp 0.0.0.0:53: bind: address already in use.` when trying to start the Docker container, there is likely another DNS server already running on your machine. You can configure the `DNS_ADDRESS` environment variable to bind the DNS server to any IP address that does not conflict with the local setup (e.g., `DNS_ADDRESS=22.22.22.22`, or `DNS_ADDRESS=0` to disable the DNS server port entirely).

* If you get an error `ImportError: cannot import name requests` (or similar) on `pip install localstack`, you may have to downgrade your version of `pip` to `9.x.x`, e.g., `pip install --upgrade pip==9.0.3`. See [here](https://stackoverflow.com/a/50991067/5265979) for reference.

* If `pip install ...` fails with an error like the one below, try installing YAML development libs (e.g., `brew install libyaml` under Mac OS).
   ```
   #include <yaml.h>
            ^~~~~~~~
   1 error generated.
   ```