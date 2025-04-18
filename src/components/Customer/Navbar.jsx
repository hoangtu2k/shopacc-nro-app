import { Button } from "@mui/material";
import { FaDollarSign, FaUser } from "react-icons/fa6";

import "../../styles/nav.css"
import Logo from "../../assets/images/logo.png";

function Navbar() {
    return (
        <header className="header">
            <div className="left-container">
                <a href="/" className="logo">
                    <img src={Logo} alt="Logo" className="logo-image" />
                </a>
                <nav className="navbar">
                    <a href="/">Trang chủ</a>
                    <a href="/">Danh mục game</a>
                    <a href="/">Tin tức</a>
                </nav>
            </div>

            <div className="right-container">
                <Button className="price-button mr-4">
                <FaDollarSign className="naptien mr-1"/><span className="mt-1">Nạp tiền</span>
                </Button>
                <Button className="login-button">
                <FaUser className="mr-1 mb-1"/><span>Đăng nhập / Đăng ký</span>
                </Button>
            </div>
        </header>
    );
}

export default Navbar;