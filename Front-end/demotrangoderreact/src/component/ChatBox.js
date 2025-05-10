

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "../Css/ChatBox.module.css";
const FAQ_DATA = {
    business_hours: { question: "Quán mở tới mấy giờ?", answer: "Quán mở cửa từ 7:00 sáng đến 10:00 tối hàng ngày." },
    location: { question: "Quán ở đâu?", answer: "Quán nằm tại 123 Đường ABC, Quận 1, TP. HCM." },
    menu: { question: "Menu có gì?", answer: "Quán có các loại cà phê, trà sữa, bánh ngọt và nước ép trái cây." }
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null); // Tạo ref để cuộn xuống

    const toggleChat = () => {
        if (!isOpen) {
            // Tin nhắn chào mừng
            const welcomeMessage = { text: "Xin chào, Coffee House có thể giúp gì cho bạn?", sender: "bot" };

            // Khi mở chat box, hiển thị gợi ý câu hỏi từ FAQ_DATA
            const suggestions = Object.values(FAQ_DATA).map((faq) => ({
                text: faq.question,
                sender: "suggestion"
            }));

            setMessages([welcomeMessage, ...suggestions]); // Hiển thị tin nhắn chào kèm gợi ý
        } else {
            setMessages([]); // Đóng chat box thì xóa lịch sử chat
        }
        setIsOpen(!isOpen);
    };


    const handleSendMessage = async (userMessage) => {
        if (!userMessage.trim()) return;

        setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);

        setLoading(true);

        // Kiểm tra xem câu hỏi có trong FAQ không
        const faqEntry = Object.values(FAQ_DATA).find((faq) => faq.question === userMessage);
        if (faqEntry) {
            // Nếu có trong FAQ, trả lời ngay lập tức mà không cần gọi API
            setMessages((prev) => [...prev, { text: faqEntry.answer, sender: "bot" }]);
        } else {
            // Nếu không có trong FAQ, gửi yêu cầu đến API
            try {
                const res = await axios.post("http://localhost:8081/api/chat", { message: userMessage });
                setMessages((prev) => [...prev, { text: res.data, sender: "bot" }]);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setMessages((prev) => [...prev, { text: "Có lỗi xảy ra, vui lòng thử lại!", sender: "bot" }]);
            }
        }

        setMessage("");
        setLoading(false);
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // Mỗi khi messages thay đổi, cuộn xuống tin nhắn mới nhất

    return (
        <div className={styles.chatContainer}>
            {!isOpen ? (
                <button className={styles.chatButton} onClick={toggleChat}>💬 Chat</button>
            ) : (
                <div className={`${styles.chatBox} ${isOpen ? styles.chatBoxOpen : ""}`}>
                    <div className={styles.chatHeader}>
                        <span>Chat với quán ☕</span>
                        <button className={styles.chatClose} onClick={toggleChat}>✖</button>
                    </div>
                    <div className={styles.chatMessages}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={
                                    msg.sender === "user"
                                        ? styles.userMessage
                                        : msg.sender === "bot"
                                            ? styles.botMessage
                                            : styles.suggestionMessage
                                }
                                onClick={() => msg.sender === "suggestion" && handleSendMessage(msg.text)}
                            >
                                <p>
                                    <strong>{msg.sender === "user" ? "Bạn" : msg.sender === "bot" ? "Chatbot" : "💡 Gợi ý"}: </strong>
                                    {msg.text}
                                </p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> {/* Phần tử ẩn để scroll tới */}
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button className={styles.sendButton} onClick={() => handleSendMessage(message)} disabled={loading}>
                            {loading ? "⏳" : "Gửi"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ChatBot;
