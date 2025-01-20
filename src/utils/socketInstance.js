import { io } from "socket.io-client";

const socket = io("http://localhost:9000", {
    reconnectionDelay: 500,
    reconnection: true,
    reconnectionAttempts: 100,
    transports: ["websocket"],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false,
});

export default socket;