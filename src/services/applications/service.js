/* eslint-disable linebreak-style */
/* eslint-disable indent */
import amqp from 'amqplib';

const ProducerService = {
    sendMessage: async (queue, message) => {
        try {
            console.log(`\n[Producer] Mencoba mengirim pesan ke queue: ${queue}`);
            console.log('[Producer] Payload:', message);

            const host = process.env.RABBITMQ_HOST || 'localhost';
            const port = process.env.RABBITMQ_PORT || 5672;
            const user = process.env.RABBITMQ_USER || 'guest';
            const pass = process.env.RABBITMQ_PASSWORD || 'guest';

            const amqpUrl = process.env.AMQP_URL || `amqp://${user}:${pass}@${host}:${port}`;

            const connection = await amqp.connect(amqpUrl);
            const channel = await connection.createChannel();

            await channel.assertQueue(queue, {
                durable: true,
            });

            channel.sendToQueue(queue, Buffer.from(message));
            console.log('[Producer] Pesan BERHASIL masuk ke antrean RabbitMQ!\n');

            setTimeout(() => {
                connection.close();
            }, 1000);
        } catch (error) {
            console.error('\n[Producer] GAGAL mengirim pesan ke RabbitMQ:', error.message || error);
        }
    },
};

export default ProducerService;