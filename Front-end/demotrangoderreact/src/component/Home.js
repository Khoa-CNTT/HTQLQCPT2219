import React, {useEffect, useState} from "react";
import Slider from "react-slick"; // Import thư viện react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../Css/TrangChu.module.css"; // Import CSS module
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaArrowDown,
    FaCoffee,
    FaWifi,
    FaTruck,
    FaGift,
    FaChalkboardTeacher, FaClock, FaMusic, FaRegStar, FaUsers
} from "react-icons/fa";
import {animateScroll as scroll, scroller} from 'react-scroll';
import {Link, useNavigate} from "react-router-dom"; // Import useNavigate
import logoImage from '../img/logo.jpeg';
import { FaHome, FaInfoCircle, FaBoxOpen, FaConciergeBell, FaUtensils } from "react-icons/fa"; // Import icons
import 'font-awesome/css/font-awesome.min.css';
import arrowImage from '../img/con.jfif'; // Điều chỉnh đường dẫn nếu cần
import '@fortawesome/fontawesome-free/css/all.min.css';

import sliderImage1 from "../img/banner_4.jpg.png";
import sliderImage2 from "../img/banner_1.jpg.png";
import sliderImage3 from "../img/banner_2.jpg.png";
import sliderImage4 from "../img/banner_3.jpg.png";
import infoImage from "../img/anh_1.webp"; // Đường dẫn tới ảnh bên phải
import cafeImage1 from "../img/anh_quan_cafe_1.jpg";
import cafeImage2 from "../img/anh_quan_cafe_2.jpg";
import cafeImage3 from "../img/anh_quan_cafe_3.jpg";
import cafeImage4 from "../img/anh_quan_cafe_4.jpg";
import cafeImage5 from "../img/anh_quan_cafe_5.jpg";
import lycafe from "../img/anh-cafe_2.jpg";
import lycafe1 from "../img/footer1.png";
import phache from "../img/cach-pha-ca-phe-kieu-pour-over.webp";
import khonggian from "../img/khong_gian.jpg";
import amnhac from "../img/thegioimayphacfacoustic1.jpeg";
import uudai from "../img/ưu đãi.png";
import hocphache from "../img/pha-che-chuyen-nghiep-1.jpg";
import phongcach from "../img/quan-cafe-phong-cach-co-dien.webp";
import footerLogo from "../img/footer_3.png"; // Logo trong footer
import avatar from "../img/tải xuống.jpg"; // Logo trong footer
import avatar1 from "../img/tải xuống1.jpg"; // Logo trong footer
import avatar2 from "../img/tải xuống2.jpg"; // Logo trong footer
import avatar3 from "../img/images3.jpg"; // Logo trong footer
import spnb1 from "../img/spnb1.jpg"; // Logo trong footer
import spnb2 from "../img/spnb2.jpg"; // Logo trong footer
import spnb3 from "../img/spnb3.jpg"; // Logo trong footer
import spnb4 from "../img/spnb5.jpg"; // Logo trong footer
import spnb5 from "../img/spnb6.jpg"; // Logo trong footer
import { FaFacebook, FaTwitter, FaInstagram, FaArrowUp } from "react-icons/fa";
import {getAllProduct} from "../service/ProductService";
import {GiCoffeeBeans, GiCoffeeCup} from "react-icons/gi";
import axios from "axios"; // Thư viện icon

const TrangChu = function () {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showService, setShowService] = useState(false);
    const avatars = [avatar, avatar1, avatar2, avatar3];

    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProduct(0, 6); // Gọi API
                console.log(data); // Kiểm tra cấu trúc dữ liệu
                setProducts(data.content || []); // Gán danh sách sản phẩm từ trường "content"
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);
    const featuredProducts = [
        {
            id: 1,
            productName: "Cà Phê Cốt Dừa",
            productPrice: 38000,
            productDescription: "Cafe Cốt Dừa là một loại Cafe độc đáo được pha chế từ những hạt cafe nguyên chất của Việt Nam kết hợp cùng với nước cốt dừa, sữa và đá xay mịn. Khi thưởng thức bạn sẽ cảm nhận được vị béo ngậy thơm lừng hòa quyện trong vị đắng đậm đà của cafe không lẫn đi đâu được,là một món dễ uống có vị đắng của cafe dung hòa hoàn hảo bởi độ ngọt vừa phải cùng với vị béo ngậy của cốt dừa và mát lạnh của đá dành cho những ngày trời nóng bức.",
            productImgUrl: spnb1
        },
        {
            id: 2,
            productName: "Sữa tươi matcha",
            productPrice: 42000,
            productDescription: "Matcha sữa tươi là một loại thức uống phổ biến được yêu thích trên toàn thế giới, đặc biệt là trong cộng đồng yêu trà. Sự kết hợp giữa hương vị đặc trưng của matcha và độ béo của sữa tươi tạo ra một trải nghiệm hương vị độc đáo và thơm ngon,Matcha sữa tươi được ưu chuộng không chỉ đến từ hương vị thơm ngon mà còn đến từ những lợi ích sức khỏe mà nó mang lại nến bạn sử dụng 1 cách hợp lý. Matcha chứa nhiều chất chống oxy hóa và L-theanine, giúp cải thiện tâm trạng và tăng cường sự tập trung",
            productImgUrl: spnb2
        },
        {
            id: 3,
            productName: "Trà Sen",
            productPrice: 42000,
            productDescription: "Trà sen vàng đã trở thành một trong những thức uống phổ biến và được ưa chuộng nhiều hiện nay. Được biết đến không chỉ bởi hương vị độc đáo mà còn bởi giá trị dinh dưỡng và tác dụng sức khỏe mà trà sen vàng mang lại.Trà sen vàng hiện nay là một sự hòa trộn giữa các thành phần tự nhiên: Trà ô long, hạt sen, củ năng cùng với lớp milk foam trên cùng. Trà sen vàng không chỉ là một thức ngon mà còn là một liệu pháp hỗ trợ sức khỏe",
            productImgUrl: spnb3
        },
        {
            id: 4,
            productName: "Soda Bạc Hà",
            productPrice: 30000,
            productDescription: "Soda Bạc Hà – Sự mát lạnh đánh thức vị giác\n" +
                "\n" +
                ".Khi những tia nắng đầu ngày bắt đầu len lỏi qua từng tán lá, một ly soda bạc hà chính là lựa chọn hoàn hảo để khởi đầu ngày mới đầy năng lượng. Với sắc xanh tươi mát và hương thơm the dịu đặc trưng, soda bạc hà mang đến cảm giác sảng khoái ngay từ ngụm đầu tiên. Vị ngọt nhẹ của syrup hòa quyện cùng bọt gas mát lạnh khiến cho từng tế bào như được đánh thức, xua tan cái nóng và mỏi mệt. Đây không chỉ là một thức uống, mà còn là một trải nghiệm vị giác nhẹ nhàng nhưng đầy ấn tượng.",
            productImgUrl: spnb4
        },
        {
            id: 5,
            productName: "Dâu tây đá xay",
            productPrice: 50000,
            productDescription: "Dâu đá xay là một loại đồ uống được làm từ quả dâu tây và đá, thường được pha chế trong máy xay sinh tố để tạo ra một hỗn hợp mịn và mát lạnh. Đây là một loại thức uống rất phổ biến trong mùa hè, với hương vị ngọt ngào và hấp dẫn. Ngoài quả dâu tây và đá, có thể thêm vào các thành phần khác như sữa, yogurt hoặc đường để tạo ra nhiều phiên bản khác nhau của dâu đá xay. Đây là một loại đồ uống rất phổ biến tại các quán cà phê, quán sinh tố và quán ăn nhanh",
            productImgUrl: spnb5
        }
    ];
    const services = [
        { icon: <FaCoffee />, title: "Pha chế đặc biệt", description: "Thưởng thức các loại cà phê thượng hạng với công thức đặc biệt.", image: phache },
        { icon: <FaWifi />, title: "Không gian làm việc", description: "Wi-Fi tốc độ cao, không gian thoải mái, phù hợp làm việc và họp nhóm.", image: khonggian },
        { icon: <FaMusic />, title: "Âm nhạc Acoustic", description: "Thưởng thức âm nhạc acoustic mỗi cuối tuần với những giai điệu nhẹ nhàng.", image: amnhac },
        { icon: <FaGift />, title: "Ưu đãi thành viên", description: "Tích điểm đổi quà, giảm giá đặc biệt cho khách hàng thân thiết.", image:uudai },
        { icon: <FaChalkboardTeacher />, title: "Lớp học pha chế", description: "Học pha chế cà phê miễn phí vào mỗi cuối tuần.", image: hocphache}
    ];
    const navigate = useNavigate(); // Hook điều hướng
    const table = { tableId: 3 }; // Ví dụ, bạn có thể lấy thông tin này từ trạng thái hoặc API
    const handleOrderClick = () => {
        if (table) {
            navigate(`/tables/${table.tableId}`);
        } else {
            alert('Vui lòng chọn bàn trước!');
        }
    };
    const handleLoginClick = () => {
        window.open("/login", "_blank"); // "_blank" mở trong tab mới
    };

    const handleScrollToTop = () => {
        scroller.scrollTo('header', {
            duration: 500,    // Thời gian cuộn
            smooth: true,     // Cuộn mượt
            offset: -50,      // Điều chỉnh vị trí cuộn nếu cần
        });
    };
    // Cấu hình hiệu ứng slide
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        arrows: true,
    };
    const scrollToTop = () => {
        scroll.scrollToTop({ duration: 500, smooth: 'easeInOutQuad' });
    };
    const handleProductClick = (product) => {
        setSelectedProduct(product); // Gán sản phẩm được chọn vào state
    };

    const handleScrollToTop1 = () => {
        setActivePage(""); // Reset trước để re-render
        setTimeout(() => setActivePage("home"), 0); // Đảm bảo hiển thị lại đầy đủ
    };
    const closeModal = () => {
        setSelectedProduct(null); // Đóng modal
    };
    const [activePage, setActivePage] = useState("home");

    const handleShowService = () => setActivePage("service");
    const handleShowContact = () => setActivePage("contact");
    const handleShow = () => setActivePage("show");
    const handleShowProduct = () => setActivePage("product");
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8081/api/feedback/top-feedbacks")
            .then((res) => setFeedbacks(res.data))
            .catch((err) => console.error("Lỗi khi gọi API feedback:", err));
    }, []);
    return (
        <div className={styles.sliderWrapper}>
            {/* Phần thông báo nằm trên slider */}
            <div className={styles.header} id="header">
                <div className={styles.coffeeTitle}>
                    <GiCoffeeCup className={styles.coffeeCupIcon}/>
                    <span className={styles.titleText}>
                <GiCoffeeBeans className={styles.coffeeIcon}/>
                Chào mừng bạn đến với Coffee House
                <GiCoffeeBeans className={styles.coffeeIcon}/>
            </span>
                    <GiCoffeeCup className={styles.coffeeCupIcon}/>
                </div>
                {/*<button onClick={handleLoginClick}>Đăng Nhập</button>*/}
            </div>


            {/* Thanh điều hướng */}
            <div className={styles.navigationBar}>
                <div className={styles.navItems}>
        <span className={styles.navItem} onClick={handleScrollToTop1}>
            <FaHome className={styles.icon}/> Trang chủ
        </span>
                    <span className={styles.navItem}
                          onClick={handleShow}>
            <FaInfoCircle className={styles.icon}/> Giới thiệu
        </span>
                    <span className={styles.navItem}
                          onClick={handleShowProduct}>
            <FaBoxOpen className={styles.icon}/> Sản Phẩm
        </span>
                </div>
                <div className={styles.logoWrapper}>
                    <img src={logoImage} alt="Logo Coffee House" className={styles.logoImage}/>
                </div>
                <div className={styles.navItems}>
        <span className={styles.navItem} onClick={handleShowService}>
            <FaConciergeBell className={styles.icon}/> Dịch vụ
        </span>
                    <span className={styles.navItem}
                          onClick={handleShowContact}>
            <FaPhoneAlt className={styles.icon}/> Liên hệ
        </span>
                    <span className={styles.navItem} onClick={handleOrderClick}>
            <FaUtensils className={styles.icon}/> Gọi món
        </span>
                </div>
            </div>

            {/* Hiển thị nội dung theo trạng thái */}
            {/*{activePage === "home" && (*/}
            {/*    <main>*/}
            {/*        <h1>Nội dung chính của trang</h1>*/}
            {/*        <p>Thông tin khác...</p>*/}
            {/*    </main>*/}
            {/*)}*/}

            {/* Trang Dịch vụ */}
            {activePage === "service" && (
                <section className={styles.serviceSection}>
                    <h1 className={styles.title3}>Dịch vụ của chúng tôi</h1>
                    <div className={styles.serviceGrid}>
                        {services.map((service, index) => (
                            <div key={index} className={styles.serviceCard}>
                                <img src={service.image} alt={service.title} className={styles.serviceImage}/>
                                <div className={styles.serviceContent}>
                                    <span className={styles.iconS}>{service.icon}</span>
                                    <h3 className={styles.serviceTitleT}>{service.title}</h3>
                                    <p className={styles.serviceDescription}>{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {activePage === "show" && (
                <section className={styles.aboutContainer}>
                    {/* Phần giới thiệu quán */}
                    <div className={styles.aboutText}>
                        <h2 className={styles.aboutTitle}>☕ Chào mừng đến với <span>Coffee House</span>!</h2>
                        <p className={styles.aboutDescription}>
                            Tọa lạc tại trung tâm thành phố, <strong>Coffee House</strong> là điểm đến lý tưởng dành cho
                            những ai yêu thích hương vị cà phê đích thực.
                            Với không gian ấm áp, sang trọng và đội ngũ nhân viên tận tâm, chúng tôi mong muốn mang đến
                            những giây phút thư giãn tuyệt vời nhất cho bạn.
                        </p>

                        {/* Danh sách ưu điểm của quán */}
                        <ul className={styles.aboutList}>
                            <li><FaCoffee className={styles.aboutIcon}/> Cà phê nguyên chất 100%, pha chế từ hạt cà phê
                                chọn lọc
                            </li>
                            <li><FaUsers className={styles.aboutIcon}/> Không gian thoải mái, thích hợp cho cả làm việc
                                và gặp gỡ bạn bè
                            </li>
                            <li><FaRegStar className={styles.aboutIcon}/> Phục vụ chuyên nghiệp, nhanh chóng và tận tình
                            </li>
                        </ul>
                    </div>

                    {/* Phần hình ảnh quán cà phê */}
                    <div className={styles.aboutImageContainer}>
                        <img src={phongcach} alt="Không gian quán" className={styles.aboutImage}/>
                    </div>
                </section>)

            }
            {activePage === "product" && (
                <section className={styles.productSection6}>
                    <h2 className={styles.productTitle6}>Sản phẩm của quán</h2>
                    <div className={styles.productContainer6}>
                        <div className={styles.productGrid6}>
                            {products.slice(0, 6).map((product) => (
                                <div key={product.id} className={styles.productBox6}>
                                    <img
                                        src={product.productImgUrl || "https://via.placeholder.com/150"}
                                        alt={product.productName}
                                        className={styles.productImage6}
                                    />
                                    <h3 className={styles.productName6}>{product.productName}</h3>
                                    <p className={styles.productPrice6}>
                                        <p className={styles.productPrice6}>
                                            {product.productPrice
                                                ? product.productPrice.toLocaleString("vi-VN", {
                                                minimumFractionDigits: 0, // Bỏ phần thập phân
                                            }) + " VND" // Gắn chữ "VND" ngay sau số
                                                : "Giá chưa có"}
                                        </p>

                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Nút xem thêm */}
                        <div className={styles.viewMoreContainer6}>
                            <button className={styles.viewMoreButton6} onClick={handleOrderClick}>
                                <i className="fas fa-arrow-right"></i> Xem thêm
                            </button>
                        </div>
                    </div>
                </section>
            )}


            {activePage === "contact" && (
                <section className={styles.contactSection}>
                    <h1 className={styles.contactTitle}>📞 Liên hệ với chúng tôi</h1>
                    <p className={styles.contactIntro}>
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn! Nếu bạn có bất kỳ câu hỏi, góp ý hoặc cần hỗ
                        trợ, đừng ngần ngại liên hệ với chúng tôi qua các kênh dưới đây.
                    </p>
                    <div className={styles.contactContainer}>
                        {/* Thông tin liên hệ */}
                        <div className={styles.contactInfo}>
                            <p><FaMapMarkerAlt className={styles.contactIcon}/> <strong>Địa chỉ:</strong> 331B Đường
                                Nguyễn Hoàng, Phường Bình Thuận, Quận Hải Châu, Đà Nẵng</p>
                            <p><FaPhoneAlt className={styles.contactIcon}/> <strong>Hotline:</strong> 0336215616</p>
                            <p><FaEnvelope className={styles.contactIcon}/>
                                <strong>Email:</strong> nguyendinhhauace@gmail.com</p>
                            <p><FaClock className={styles.contactIcon}/> <strong>Giờ làm việc:</strong> 7:00 - 22:00
                                (Thứ 2 - Chủ Nhật)</p>

                            {/* Mạng xã hội */}
                            <div className={styles.socialLinks}>
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                                   className={styles.socialIcon}>
                                    <FaFacebook/>
                                </a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                                   className={styles.socialIcon}>
                                    <FaInstagram/>
                                </a>
                            </div>
                        </div>

                        {/* Hình ảnh liên hệ */}
                        <div className={styles.contactImageContainer}>
                            <img src={cafeImage1} alt="Liên hệ" className={styles.contactImage}/>
                        </div>
                    </div>

                    {/* Phần hỗ trợ khách hàng */}
                    <div className={styles.supportSection}>
                        <h2 className={styles.supportTitle}>Hỗ trợ khách hàng</h2>
                        <p>Chúng tôi cam kết mang đến dịch vụ tốt nhất cho khách hàng. Nếu bạn có bất kỳ vấn đề nào về
                            đơn hàng, chất lượng sản phẩm hoặc trải nghiệm tại cửa hàng, hãy liên hệ ngay với chúng
                            tôi.</p>
                        <ul className={styles.supportList}>
                            <li>📌 Hỗ trợ đơn hàng và thanh toán</li>
                            <li>📌 Chỉnh sửa đơn hàng trước khi xác nhận thanh toán</li>
                            <li>📌 Phản hồi dịch vụ quán cà phê</li>
                            <li>📌 Góp ý về hương vị cà phê</li>
                        </ul>
                    </div>
                </section>
            )}
            {/* Slider */}
            {activePage === "home" && (
                <>
                    <Slider {...settings}>
                        <div>
                            <img src={sliderImage1} alt="Slider 1" className={styles.sliderImage}/>
                        </div>
                        <div>
                            <img src={sliderImage2} alt="Slider 2" className={styles.sliderImage}/>
                        </div>
                        <div>
                            <img src={sliderImage3} alt="Slider 3" className={styles.sliderImage}/>
                        </div>
                        <div>
                            <img src={sliderImage4} alt="Slider 3" className={styles.sliderImage}/>
                        </div>
                    </Slider>
                    {/* Phần thông tin bên dưới slide */}
                    <div className={styles.infoSection} id="infoSection">
                        <div className={styles.infoText}>
                            <h2>Chúng tôi là Coffee House</h2>
                            <p>
                                Thứ hai đến Chủ Nhật 7:00am - 22:00pm | Hotline: 0336215616<br/>
                                Chúng tôi đi khắp thế giới để tìm kiếm cà phê tuyệt vời.
                                Trong quá trình đó, chúng tôi phát hiện ra những hạt đậu đặc biệt và hiếm đến nỗi chúng
                                tôi có
                                thể chờ đợi để mang chúng về.
                            </p>
                        </div>
                        <div className={styles.infoImage}>
                            <img src={infoImage} alt="Thông tin Coffee House"/>
                        </div>
                    </div>

                    {/* Phần sản phẩm nổi bật */}
                    <div className={styles.productSection} id="productSection">
                        <h2 className={styles.productTitle}>Sản phẩm nổi bật</h2>
                        <div className={styles.productGrid}>
                            {featuredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={styles.productCard}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <img
                                        src={product.productImgUrl || "https://via.placeholder.com/150"}
                                        alt={product.productName}
                                        className={styles.productImage}
                                    />
                                    <h3 className={styles.productName}>{product.productName}</h3>
                                    <p className={styles.productPrice}>
                                        {product.productPrice
                                            ? `${product.productPrice.toLocaleString("vi-VN")} VND`
                                            : "Giá chưa có"}
                                    </p>
                                    <p className={styles.productDescription}>
                                        {product.productDescription
                                            ? `${product.productDescription.slice(0, 100)}...`
                                            : "Không có mô tả"}
                                    </p>
                                </div>
                            ))}
                        </div>


                        {/* Modal */}
                        {selectedProduct && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <button className={styles.closeButton} onClick={closeModal}>
                                        &times;
                                    </button>
                                    <img
                                        src={selectedProduct.productImgUrl || "https://via.placeholder.com/150"}
                                        alt={selectedProduct.productName}
                                        className={styles.modalImage}
                                    />
                                    <h3 className={styles.modalProductName}>{selectedProduct.productName}</h3>
                                    <p className={styles.modalProductPrice}>
                                        {selectedProduct.productPrice
                                            ? selectedProduct.productPrice.toLocaleString("vi-VN") + " VND"
                                            : "Giá chưa có"}

                                    </p>
                                    <p className={styles.modalProductDescription}>
                                        {selectedProduct.productDescription || "Không có mô tả"}
                                    </p>
                                </div>
                            </div>

                        )}
                        <div className={styles.orderButtonWrapper}>
                            {/* Thay thế biểu tượng mũi tên bằng ảnh */}
                            {/* Thay thế biểu tượng mũi tên bằng ảnh */}
                            <div className={`${styles.arrowIconWrapper} ${selectedProduct ? styles.hidden : ''}`}>
                                <img
                                    src={arrowImage}
                                    alt="arrow-down"
                                    className={styles.arrowIconImage}
                                />
                            </div>

                            <button className={`${styles.orderButton} ${selectedProduct ? styles.hidden : ''}`}
                                    onClick={handleOrderClick}>
                                Gọi món
                            </button>
                        </div>
                    </div>

                    {/* Hình ảnh quán cà phê */}
                    <div className={styles.cafeImageSection}>
                        <h2 className={styles.sectionTitle}>HÌNH ẢNH QUÁN CAFE</h2>
                        <div className={styles.imageGallery}>
                            <div className={styles.mainImage}>
                                <img src={cafeImage1} alt="Hình ảnh quán cafe lớn" className={styles.cafeImageLarge}/>
                            </div>
                            <div className={styles.subImages}>
                                <img src={cafeImage2} alt="Hình ảnh quán cafe 2" className={styles.cafeImageSmall}/>
                                <img src={cafeImage3} alt="Hình ảnh quán cafe 3" className={styles.cafeImageSmall}/>
                                <img src={cafeImage4} alt="Hình ảnh quán cafe 4" className={styles.cafeImageSmall}/>
                                <img src={cafeImage5} alt="Hình ảnh quán cafe 5" className={styles.cafeImageSmall}/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.customerReviewsSection}>
                        <h2 className={styles.sectionTitle}>Khách hàng nói gì</h2>

                        <div className={styles.feedbackGrid}>
                            {feedbacks.slice(0, 4).map((feedback, index) => (
                                <div className={styles.reviewItem} key={feedback.id}>
                                    <div className={styles.customerAvatar}>
                                        <img
                                            src={avatars[index % avatars.length]}
                                            alt={`Khách hàng ${index + 1}`}
                                            className={styles.avatarImage}
                                        />
                                    </div>
                                    <div className={styles.reviewText}>
                                        <p>"{feedback.content}"</p>
                                        <div className={styles.starRating}>
                                            {Array.from({length: 5}).map((_, i) => (
                                                <span key={i}
                                                      style={{color: i < feedback.rating ? "#FFD700" : "#ccc"}}>★</span>
                                            ))}
                                        </div>
                                        <span className={styles.customerName}>{feedback.reviewerName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Thêm phần thông tin liên hệ với ảnh nền */}
                    <div className={styles.contactInfoSection} id="contact">
                        <div className={styles.leftSection}>
                            <h4><i className="fas fa-building"></i> Công ty cổ phần thương mại Coffee House</h4>
                            <p>Trải qua hơn 15 năm hoạt động & phát triển, đã từng bước khẳng định và tạo sự tín nhiệm
                                trong
                                lòng khách hàng, trở thành một trong những công ty chuyên nghiệp nhất cung cấp Điện
                                thoại, máy
                                tính, thiết bị văn phòng và các giải pháp ứng dụng công nghệ.</p>

                            <h5><i className="fas fa-map-marker-alt"></i> Coffee House Đà Nẵng:</h5>
                            <p>
                                331B Đường Nguyễn Hoàng, Phường Bình Thuận, Quận Hải Châu, Đà Nẵng <br/>
                                Điện thoại: 0336215616 <br/>
                                Fax: (033) 6215616
                            </p>
                            <h5><i className="fas fa-map-marker-alt"></i> Coffee House Cầu Giấy:</h5>
                            <p>
                                Số 152 Trần Duy Hưng, Cầu Giấy, Hà Nội. <br/>
                                Điện thoại: (024) 35737345 <br/>
                                Fax: (024) 35737346
                            </p>
                            <h5><i className="fas fa-phone-alt"></i> Bộ phận tư vấn khách hàng:</h5>
                            <p><i className="fas fa-phone"></i> Hotline: 0336215616</p>
                            <p><i className="fas fa-envelope"></i> Email: nguyendinhhauace@gmail.com</p>
                        </div>
                        <div className={styles.rightSection}>
                            <img src={lycafe} alt="Thông tin liên hệ" className={styles.contactImage}/>
                        </div>
                    </div>
                    {/* Thẻ div chứa ảnh nền */}
                    <div className={styles.backgroundImage}>
                        <img src={lycafe1} className={styles.backround1}/>

                    </div>
                </>
            )}
            {/* Footer */}
            <div className={styles.footer}>
                <div className={styles.footerContent}>
                    {/* Bên trái: Hình ảnh */}
                    <div className={styles.footerLeft}>
                        <img src={footerLogo} alt="Footer Logo" className={styles.footerLogo}/>
                    </div>
                    {/* Bên phải: Thông tin */}
                    <div className={styles.footerRight}>
                        <h3 style={{color: 'white'}}>Chúng tôi là Coffee House</h3>
                        <div className={styles.footerInfo}>
                            <p>
                                <FaMapMarkerAlt className={styles.footerIcon}/>
                                Trụ sở chính: 331B Đường Nguyễn Hoàng, Phường Bình Thuận, Quận Hải Châu, Đà Nẵng
                            </p>
                            <p>
                                <FaPhoneAlt className={styles.footerIcon}/>
                                0336215616
                            </p>
                            <p>
                                <FaEnvelope className={styles.footerIcon}/>
                                nguyendinhhauace@gmail.com
                            </p>
                        </div>
                        <div className={styles.footerIcons}>
                            <FaFacebook className={styles.footerIcon}/>
                            <FaTwitter className={styles.footerIcon}/>
                            <FaInstagram className={styles.footerIcon}/>
                        </div>
                    </div>
                </div>
                {/* Phía dưới cùng */}
                <div className={styles.footerBottom}>
                    <p>
                        @2025 - Bản quyền thuộc về Cafein Team | Cung cấp bởi Hau
                    </p>
                    <button className={styles.backToTop} onClick={scrollToTop}>
                        <FaArrowUp/>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default TrangChu;
