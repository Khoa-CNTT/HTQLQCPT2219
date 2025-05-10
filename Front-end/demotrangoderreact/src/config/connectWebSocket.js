import { Client } from '@stomp/stompjs';

const client = new Client({
    brokerURL: 'ws://localhost:8080/ws', // URL đến WebSocket backend
    connectHeaders: {},
    debug: (str) => console.log(str),
    reconnectDelay: 5000,
});

export default client;
