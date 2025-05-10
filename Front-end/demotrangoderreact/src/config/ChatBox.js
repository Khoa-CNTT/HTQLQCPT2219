import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../Css/ChatBox.module.css";

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (!question.trim()) return;
        const userMessage = { text: question, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await axios.get("http://localhost:8081/api/chat/ask", {
                params: { question },
            });

            const botMessage = { text: response.data, sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "Xin lỗi, hệ thống đang gặp lỗi.", sender: "bot" },
            ]);
        }

        setQuestion("");
    };

    // Tự động cuộn xuống cuối
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);


    return (
        <div className={styles.chatContainer}>
            {!isOpen ? (
                <button className={styles.chatButton} onClick={toggleChat}>☕ Hỗ trợ</button>
            ) : (
                <div className={styles.chatBox}>
                    <div className={styles.chatHeader}>
                        <span>💬 Chat với quán</span>
                        <button className={styles.chatClose} onClick={toggleChat}>✖</button>
                    </div>
                    <div className={styles.chatMessages} ref={messagesEndRef}>
                        {messages.map((msg, index) => (
                            <p
                                key={index}
                                className={msg.sender === "user" ? styles.userMessage : styles.botMessage}
                            >
                                <strong>{msg.sender === "user" ? "Bạn" : "Quán"}: </strong>
                                {msg.text}
                            </p>
                        ))}

                    {/*<div ref={messagesEndRef}/>*/}
                </div>
                <div className={styles.inputContainer}>
            <input
                type="text"
                className={styles.inputField}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Nhập câu hỏi..."
                        />
                        <button className={styles.sendButton} onClick={handleSend}>Gửi</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
