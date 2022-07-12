---
id: pro-without-internet
question: "Can I use LocalStack PRO features on a computer not connected to the internet?"
tags: ['Product']
---

LocalStack Pro currently requires internet connectivity for a short period of time at start up, to activate the API key. Once the stack is up and running and initialized, you should be able to use it offline as well. We also have a mechanism that caches the activation key for a certain period of time (e.g., ~6hours) on the local machine.