---
title: "Node.js To The Moon 🚀"
date: 2021-05-05T19:12:41+05:30
draft: false
slug: "scaling-your-node.js-app-like-a-boss"
---

# Scaling your Node.js app like a boss

Is Node even Node, if you're not running a Node process on every CPU core of your machine 😁?


So a little history: JavaScript was created out of the rapidly growing demand for dynamic content on the web, it was designed to do simple things like creating a colourful mouse trail or to validate forms. It was only in 2009 that Ryan Dahl, creator of Node.js, made it possible for developers to use JavaScript to write back-end code.

Most backend languages support multithreading and have all kinds of algorithms to sync values between the threads and other thread related features. To add support for such stuff to JavaScript, Dahl needed a workaround...

## How Node.js threading works

When a Node.js process is launched, it runs:

- One process
- One thread
- One event loop
- One JS Engine Instance
- One Node.js Instance

#### One process:

A process is a global object that can be accessed anywhere and has information about what’s being executed at a time.

#### One thread:

Being single-threaded means that only one set of instructions is executed at a time in a given process.

#### One event loop:

This is what allows Node to be asynchronous and have non-blocking I/O, — despite the fact that JavaScript is single-threaded — by offloading operations to the system kernel whenever possible through callbacks, promises and async/await.

#### One JS Engine Instance:

This is a computer program that executes JavaScript code.

#### One Node.js Instance:

The computer program that executes Node.js code.

## Scaling part


### Multiple processes on same machine

Scaling Node.js applications can be a challenge. JavaScript’s single threaded nature prevents Node from taking advantage of modern multi-core machines. For example, the following code implements a bare bones HTTP server, which listens on the port number passed in from the command line. This code will execute in a single thread, whether it’s run on a single core machine or a 1,000 core machine.

```javascript
let http = require("http");
let port = process.env.PORT || 4000;

http.createServer(function(request, response) {
  console.log("Request for:  " + request.url);
  response.writeHead(200);
  response.end("hello world\n");
}).listen(port);

```

With a little work, the previous code can be modified to utilize all of the available cores on a machine. In the following example, the HTTP server is refactored using the [cluster](https://nodejs.org/api/cluster.html) module. Cluster allows you to easily create a network of processes which can share ports. In this example, a separate process is spawned for each system core, as defined by the numCPUs variable. Each of the child processes then implements the HTTP server, by listening on the shared port.

```javascript
let cluster = require("cluster");
let http = require("http");
let numCPUs = require("os").cpus().length;
let port = process.env.PORT || 4000;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", function(worker, code, signal) {
    cluster.fork();
  });
} else {
  http.createServer(function(request, response) {
    console.log("Request for:  " + request.url);
    response.writeHead(200);
    response.end("hello world\n");
  }).listen(port);
}
```

### Scaling Across Machines

Using the cluster module, you can more effectively take advantage of modern hardware. However, you are still limited by the resources of a single machine. If your application receives significant traffic, eventually you will need to scale out to multiple machines. This can be done using a [reverse proxy server](https://en.wikipedia.org/wiki/Reverse_proxy) to [load balance](https://en.wikipedia.org/wiki/Load_balancing_(computing)) the incoming requests among multiple servers.

[Nodejitsu](https://en.wikipedia.org/wiki/Nodejitsu) developed [node-http-proxy](https://github.com/http-party/node-http-proxy), an open source proxy server for Node applications. The module can be installed using the following command.

`npm install http-proxy`

The actual reverse proxy server is shown below. In this example, the load is balanced between two servers running on the local machine. Before testing the reverse proxy, ensure that the original HTTP server application is running on ports 8080 and 8081. Next, launch the reverse proxy and connect to it using a browser. If everything is working properly, you should notice that requests are alternated between the two HTTP servers.

```javascript
let proxyServer = require('http-proxy');
let port = process.env.PORT || 4000;
let servers = [
  {
    host: "localhost",
    port: 8081
  },
  {
    host: "localhost",
    port: 8080
  }
];

proxyServer.createServer(function (req, res, proxy) {
  let target = servers.shift();

  proxy.proxyRequest(req, res, target);
  servers.push(target);
}).listen(port);
```

Of course, this example only uses one machine. However, if you have access to multiple machines, you can run the reverse proxy server on one machine, while one or more machines run the HTTP server.

## Conclusion
This article has shown you how to scale Node.js applications from a single thread to multiple processes executing on multiple machines. You can also set up a load balancer using both Node and nginx. Please note that this article is not intended to be a comprehensive guide to running Node applications in production. If you are using nginx, there are additional tweaks which can increase performance, such as caching. You would also want to use a tool such as [pm2](https://pm2.io/) to restart your Node processes after a crash.

Thanks for reading, and if you liked my blog consider a shoutout on [Twitter @aaryan7476](https://twitter.com/aaryan7476)

Good Bye 💓 !
