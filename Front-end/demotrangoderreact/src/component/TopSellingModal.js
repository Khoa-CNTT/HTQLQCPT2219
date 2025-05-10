// components/TopSellingModal.jsx
import React, { useEffect, useState } from 'react';
import styles from '../Css/TopSellingModal.module.css';
import axios from 'axios';

const TopSellingModal = ({ show, onClose }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (show) {
            axios.get('http://localhost:8081/api/product/top-selling')
                .then(res => setProducts(res.data))
                .catch(err => console.error(err));
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeBtn}>×</button>
                <h3 className={styles.title}>Gợi ý món bán chạy</h3>
                <div className={styles.productList}>
                    <div className={styles.row}>
                        {products.slice(0, 3).map(product => (
                            <div key={product.productId} className={styles.productCard}>
                                <img src={product.productImgUrl} alt={product.productName} />
                                <div className={styles.productInfo}>
                                    <h4>{product.productName}</h4>
                                    <p>{product.productPrice.toLocaleString()} đ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.row}>
                        {products.slice(3, 5).map(product => (
                            <div key={product.productId} className={styles.productCard}>
                                <img src={product.productImgUrl} alt={product.productName} />
                                <div className={styles.productInfo}>
                                    <h4>{product.productName}</h4>
                                    <p>{product.productPrice.toLocaleString('vi-VN')} VND</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 👇 Nút đóng phía dưới */}
                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.closeButtonBottom}>
                        Đóng
                    </button>
                </div>
            </div>

        </div>
    );
};
export default TopSellingModal;
