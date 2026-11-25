const grpc = require('@grpc/grpc-js'); // grpc library
const protoLoader = require('@grpc/proto-loader'); // proto loader library
const packageDef = protoLoader.loadSync("todo.proto", {}); // load the proto file
const grpcObject = grpc.loadPackageDefinition(packageDef); // load the package definition
const todoPackage = grpcObject.todoPackage; // get the todo package

const server = new grpc.Server();

server.addService(todoPackage.Todo.service, {
        createTodo: createTodo,
        readTodos: readTodos,
        readTodosStream: readTodosStream
    })

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
    },
);

const todos = [];

function createTodo(call, callback) {
    const todoItem = 
    {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem);
    callback(null, todoItem);
}

function readTodosStream(call, callback) {
    
    todos.forEach(t => call.write(t));
    call.end();
}

function readTodos(call, callback) {
    callback(null, {"items": todos})
}