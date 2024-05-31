// ZeroMQ and other modules
const zmq = require('zeromq');
const mail = require('nodemailer');
const { buildEmail } = require('./src/build-email');

// Environment Variables
require('dotenv').config();

// Main function
async function emailService() {
    console.log('Microservice is up and Running. \n');

    // ZeroMQ Setup 
    // Replies to all messages send to port 2222 on local device
    const sock = new zmq.Reply();
    await sock.bind('tcp://*:2222');

    // Nodemailer transporter setup
    let porter = createTransport();

    // Processing ZeroMQ messages
    for await (const [msg] of sock) {
        console.log('Received Message' + ': ' + msg + '\n');
        let request = JSON.parse(msg);
        let success = false;

        // Process the message
        try {
            success = await processMessage(request, porter);
        } catch (error) {
            console.error('Error processing message:', error);
            success = false;
        };

        console.log("Status of Email: ", success);
        sock.send(JSON.stringify(success));
    }
};

// Function to create transport chain
function createTransport() {
    // Nodemailer transporter setup
    let transporter = mail.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    return transporter;
};

function processMessage(request, tporter) {
    return new Promise((resolve, reject) => {
        console.log('Email: ' + request.emailAddress + '\nPlaylist Data: ', request.playlist);
        let email = request.emailAddress;
        let playlist = request.playlist;
        
        // Build and then send email
        const myEmail = buildEmail(email, playlist);

        tporter.sendMail(myEmail, function(error, info) {
            if (error) {
                console.error(error);
                reject(false);  
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);  
            }
        });
    });
};

emailService();