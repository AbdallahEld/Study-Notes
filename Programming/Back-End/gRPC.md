
# Motivation

## Client Server Communication
- SOAP, REST, GraphQL
- SSE, Web Sockets
- Raw TCP
in late 90S [[SOAP]] was the main thing when you wanna build an web application you would probably use **SOAP** which was a set of guidelines where both client and server should follow so they can communicate and they would probably communicate using an intermediate language like ==🟠XML== (XML is not really a language its just plain text with tags) until JSON Became popular because JavaScript became popular so they start shifting to [[REST]]

then what if i wanted my connection to became Bi-Directional so Web Sockets was invented and it became a standard

## The Problem with Client Libraries
no matter what you choose as communication your server that send this communication and client that receive it have to agree and how do they agree ? **You need client Library**
### Any communication protocol needs client library for the language of choice 
- SOAP Library
- HTTP Client Library

The Browser is the biggest HTTP client library on existence, it handle most of your client library job like negotiates the protocol , does the TLS , check if server support HTTP-2 if not fall back to HTTP-1, etc.

So it simply do everything for you, but if you are not on the browser you will need HTTP Client Library that support the protocol you are communicating and it could get harder cause lets say you wanna update your server to support HTTP-3 But the client library you are using is ditched!!
### Hard to maintain and patch client libraries 
- HTTP/1.1 HTTP/2, new features, security etc.
## Why gRPC was invented
and that's why gRPC was invented
- Client Library: One library for popular languages
- Protocol: HTTP/2
- Message Format: Protocol buffers as format
# gRPC modes of communication
## Unary RPC
Client sends a single request to the server and gets a single response back, just like a normal function call.

```proto
rpc SayHello(HelloRequest) returns (HelloResponse);
```

Client Ask:
```Plain text
GetProduct(ProductId = 10)
```

Server respond
```Plain text
Product {
    Id: 10,
    Name: "Laptop",
    Price: 25000
}
```
## Server streaming RPC
Client Send one request and Server respond with Multiple Responses ,think of it like youtube you click a video one request get sent then server keep responding with the data of that video or like stock market applications you wanna know Nvidia stock prices you click on it you send request the server keep sending response updating the stock price every time it change
## Client Streaming RPC
Client Send multiple requests and server wait for him to finish then respond think of it like google Drive you wanna upload documents so you keep sending chunks of that file until its fully uploaded then the server send you:
```Plain text
UploadResult {
    Success: true,
    FileId: "12345",
    Message: "File uploaded successfully"
}
```
## Bidirectional streaming RPC
Client and Server both send multiple requests
# Coding
we will build a simple Todo application using nodejs and we i will document step by step what i am doing.
- Todo application (server, client) with gRPC
- createTodo()
- readTodos() //Synchronous
- readTodos() //server stream
## Intiate Project
first i will intialize Node.js Project 
```Bash
npm init -y
```

this would generate a package.json file that contain data about the project 
```JSON
{
  "name": "todo-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
## Protocol buffer and .proto file
its a way of serializing structured data into compact binary format it works like JSON or XML but instead of sending the data on JSON format we transfer it to Binary Format but first we need to identify schema to our data first in `.proto` file
```proto
syntax = "proto3"; // specify the protocol buffer version

package todoPackage; // identify package name

service Todo {      // our todo service
    rpc createTodo(TodoItem) returns (TodoItem); // createTodo method
    rpc readTodos(void) returns (TodoItems) // readTodos method // yeah it should // take no param but theres no such a thing as no param
}

message void {} // theres no such a thing as method take no param so you have //create a message for it

message TodoItem {
    int32 id = 1;
    string text = 2;
}

message TodoItems {
    repeated TodoItem items = 1; // repeated to say this is an array of TodoItem
}
```
## Building Our Server
first we need to make `server.js` file were we will expect some listening to be happening here
### server.js
in Node.Js its responsible for runing the Server and managing HTTP Requests and responding to it
we can say its Entry Point for it can contain things like
1. Importing dependencies
   ```js
   const grpc = require('@grpc/grpc-js');
   const protoLoader = require('@grpc/proto-loader');
   ```
   
   `@grpc/grpc-js` this is the main library that proivde to us ability to create and run gRPC Server , Client, through it we can use things like 
   - `groc.Server()` to create Server
   - `grpc.ServerCredentials` to specify secure connection
   - `grpc.loadPackageDefinition()` to load services and messages
   `@grpc/proto-loader` it should read `.proto` file and compile it to JS Package Defination so gRPC library can deal with it
   
2. Loading Proto file
   ```js
   const packageDef = protoLoader.loadSync("todo.proto", {}); // first parameter is     the file path the second is its options
   ```
   
   This is not the package it self but Object that contain definitions for the Messages, Services and Methods 
   
3. Turning the Package Definition to gRPC Object
   ```js
   const grpcObject = grpc.loadPackageDefinition(packageDef);
   ```
   
   now we can reach Services , Messages and Methods in our `.proto` file
4. reaching the Todo Package
   ```js
   const todoPackage = grpcObject.todo;
   ```
   
5.  Creating Server
   ```js
   const server = new grpc.Server();
   ```
   here we make an instance of class `Server`
   
6. Register Service Methods
   ```js
   server.addService(
    todoPackage.Todo.service,
    {
        createTodo: createTodo,
        readTodos: readTodos
    }
   );
   ```
   
   first parameter 
   ```js
   todoPackage.Todo.service
   ```
   
   is the Service Definition that came from .proto file
   second is the Object that contain Implementation for all RPC Method
   
7. Link Server to a port 
   ```js
   server.bindAsync(
    "0.0.0.0:40000",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error(error);
            return;
        }

        console.log(`Server running on port ${port}`);
        server.start();
    }
   );
   ```
check code snippet 
# gRPC Pros & Cons
## Pros
- Fast & Compact
- One Client Library
- Progress Feedback
- Cancel Request
- H2/Protobuf
## Cons
- Schema
- Thick Client
- Proxies
- Still young (support)
- Error Handling
- No native browser support
- Timeouts (pubs/sub)