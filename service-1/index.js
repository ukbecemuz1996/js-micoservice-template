import express from "express";
import http from "http";
import { Kafka } from "kafkajs";

const app = express();
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["kafka:9092"],
});

const producer = kafka.producer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello from service 1");
    console.log("Hello World Service 1");
    console.log("hello from service 1");
});

app.get("/send", async (req, res) => {
    await producer.connect();
    await producer.send({
        topic: "test-topic",
        messages: [{ value: "Hi I am Okba" }],
    });

    fetch("http://service-2:2000/test")
        .then((response) => response.json())
        .then((data) => console.log(data));

    res.send("Hi I am Okba");
});

const run = async () => {
    await producer.connect();
    await producer.send({
        topic: "test-topic",
        messages: [{ value: "Hello KafkaJS user!" }],
    });
};

run().catch((error) => console.log(error));
const server = http.createServer(app);
server.listen(1000, () => {
    console.log(`Server is up and running on port ${1000}`);
});
