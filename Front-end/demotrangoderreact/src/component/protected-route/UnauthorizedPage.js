import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
    const navigate = useNavigate(); // Hook điều hướng

    const handleLoginRedirect = () => {
        navigate("/login"); // Điều hướng đến trang đăng nhập
    };

    return (
        <div style={{
            textAlign: "center",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#f8f9fa"
        }}>
            <h1 style={{ color: "#dc3545", marginBottom: "1rem" }}>403 - Bạn không có quyền truy cập</h1>
            <p style={{ fontSize: "1.1rem", color: "#555" }}>
                Vui lòng đăng nhập với tài khoản có quyền phù hợp.
            </p>
            <button
                onClick={handleLoginRedirect} // Không dùng async ở đây!
                style={{
                    marginTop: "1rem",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    color: "#fff",
                    backgroundColor: "#007bff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
            >
                🔑 Đăng nhập
            </button>
        </div>
    );
};

export default UnauthorizedPage;
