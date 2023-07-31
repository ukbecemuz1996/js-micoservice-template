import express from "express";
import http from "http";
import { Kafka } from "kafkajs";

const app = express();
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "test-group" });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello from service 2");
    console.log("hello from service 2");
});

app.get("/test", (req, res) => {
    res.json({
        data: "test",
    });
});

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
};

run().catch((error) => console.log(error));
const server = http.createServer(app);
server.listen(2000, () => {
    console.log(`Server is up and running on port ${2000}`);
});
