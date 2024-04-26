const zmq = require('zeromq');

async function testServer(){
    console.log('Test Server Running. \n\nNow waiting for messages...');

    const api = new zmq.Reply();

    await api.bind('tcp://*:1234')
    
    for await (const [msg] of api) {
        console.log('Recieved Message' + ': [' + msg.toString() + ']\n');
        await api.send('Message Received and Processed! (^_^)');
    }
};

testServer();