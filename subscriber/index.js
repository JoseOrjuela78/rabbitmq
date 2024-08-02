'use strict'

const amqp = require('amqplib');
const queue = process.env.QUEUE || 'hello';
const oper = require('../let');



const intensiveOperation = () => {

    let i = 1e9
    while (i--) {

    }
};



const subscriber = async() => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    await channel.prefetch(1);



    channel.consume(queue, async(message) => {


        if (message !== null) {

            const content = JSON.parse(message.content.toString());
            //   console.log(`Received message from "${queue}" queue`)
            // console.log(content);
            const queueStatus = await channel.checkQueue(queue);



            oper.fetchData(content.id).then((result) => {
                setTimeout(() => {

                    console.log(result);

                    if (!result.completed) {
                        oper.reintentos.push(content)
                    } else {
                        oper.reintentos = oper.reintentos.filter(item => item.code !== content.code);
                    };



                    channel.ack(message)


                    console.log(`Queue: ${queue}, Messages: ${queueStatus.messageCount}`);

                }, 5000)
            });

            console.log(oper.reintentos);

        };

    }, {
        noAck: false
    });

};


subscriber().catch(error => {
    console.error(error);
    process.exit(1);
});