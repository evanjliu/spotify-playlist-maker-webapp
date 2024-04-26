const zmq = require('zeromq');
const readline = require('readline');
const { stdout } = require('process');

async function testClient(){
    console.log('Trying to connect to the test server...\n');

    const api = new zmq.Request();
    api.connect('tcp://localhost:1234');
    
    const read = readline.createInterface({
        input: process.stdin,
        output: stdout
    });

    console.log('Connected!\n')

    read.question('Please type something to send to the server: ', (string) => {
        console.log('Sending: [', string, ']');      
        api.send(string);

        api.receive().then((response) => {
            console.log('Received: [', response.toString(), ']\n');
            read.close();
            process.exit();
        })
    });        
};

testClient();