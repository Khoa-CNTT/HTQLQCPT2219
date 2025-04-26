import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketComponent = () => {
    useEffect(() => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',  // URL endpoint WebSocket
            connectHeaders: {
                // Các header nếu cần thiết
            },
            debug: (str) => console.log(str),
            onConnect: () => {
                // Đăng ký lắng nghe sự kiện từ /topic/admin
                client.subscribe('/topic/admin', (message) => {
                    console.log(message.body);  // Xử lý thông báo từ server
                    alert(`Thông báo: ${message.body}`);  // Hiển thị thông báo
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            },
        });

        // Kết nối WebSocket
        client.activate();

        return () => {
            client.deactivate(); // Đảm bảo đóng kết nối khi component bị unmount
        };
    }, []);

    return <div>WebSocket Component</div>;
};

export default WebSocketComponent;
