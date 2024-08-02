'use strict'

const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello';
const oper = require('../let');

const messagesAmount = 6;
const wait = 400;

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
};

const sleepLoop = async(number, cb) => {
    while (number--) {
        await sleep(wait)
        cb()
    };
};



const exitAfterSend = async() => {
    await sleep(messagesAmount * wait * 1.2)
    process.exit(0);
};

const subscriber = async() => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
        durable: true
    });


    sleepLoop(messagesAmount, async() => {

        /*
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: `Mi mensaje ..`
        };
        */

        console.log(oper.reintentos.length);

        const message = {
            id: Math.floor(Math.random() * (messagesAmount - 1 + 1)) + 1,
            code: Math.random().toString(32).slice(2, 6),
            text: `usuario..`
        };

        const sent = await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

        sent ? console.log(`Sent message to "${queue}" queue`, message) : console.log(`Fails sending message to "${queue}" queue`, message);

    });

    // Verificar el estado de la cola
    const queueStatus = await channel.checkQueue(queue);
    console.log({ queueStatus });
    console.log(`Queue: ${queue}, Messages: ${queueStatus.messageCount}`);



};

subscriber().catch(error => {
    console.error(error);
    process.exit(1);
});

exitAfterSend();