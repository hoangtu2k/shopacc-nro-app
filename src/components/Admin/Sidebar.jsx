import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";

import { FaAngleRight, FaBell, FaCartArrowDown } from "react-icons/fa6";
import { FaProductHunt, FaShoppingCart, FaUserTie } from "react-icons/fa";
import { MdDashboard, MdMessage } from "react-icons/md";
import { IoIosSettings, IoMdSwap } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from '../../App';
import { HiUsers } from "react-icons/hi";

function Sidebar() {

    const [activeTab, setActiveTab] = useState(null);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const context = useContext(MyContext);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    }

    const navigate = useNavigate(); // Khai báo hook navigate

    const handleLogout = () => {
        // Xoá token khỏi Local Storage
        localStorage.removeItem('token');

        // Điều hướng đến trang đăng nhập hoặc trang chính
        navigate('/admin/login'); // Sử dụng navigate để điều hướng
    };


    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/admin/dashboard">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`}>
                                <span className="icon"><MdDashboard /></span>
                                Tổng quan
                                <span className="arrow"></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className="icon"><FaProductHunt /></span>
                            Sản phẩm
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>

                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'} `}>
                            <ul className="submenu">
                                <li><Link to="/admin/products">Danh sách sản phẩm</Link></li>
                                <li><Link to="/admin/product/details">Chi tiết sản phẩm</Link></li>
                                <li><Link to="/admin/product/upload">Tải lên sản phẩm</Link></li>
                            </ul>
                        </div>

                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                            <span className="icon"><IoMdSwap /></span>
                            Giao dịch
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'} `}>
                            <ul className="submenu">
                                <li><Link to="/orders">Đặt hàng</Link></li>
                                <li><Link to="/invoices">Hóa đơn</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                            <span className="icon"><HiUsers /></span>
                            Nhân viên
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>

                        <div className={`submenuWrapper ${activeTab === 3 && isToggleSubmenu === true ? 'colapse' : 'colapsed'} `}>
                            <ul className="submenu">
                                <li><Link to="/admin/user-management">Danh sách nhân viên</Link></li>
                                <li><Link to="/">Lịch làm việc</Link></li>
                                <li><Link to="/">Thiết lập nhân viên</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                            <span className="icon"><FaUserTie /></span>
                            Đối tác
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>

                        <div className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? 'colapse' : 'colapsed'} `}>
                            <ul className="submenu">
                                <li><Link to="/admin/customers">Khách hàng</Link></li>
                                <li><Link to="/admin">Nhà cung cáp</Link></li>
                            </ul>
                        </div>
                    </li>                 
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 9 ? 'active' : ''}`}>
                                <span className="icon"><MdMessage /></span>
                                Tin nhắn
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 8 ? 'active' : ''}`}>
                                <span className="icon"><FaBell /></span>
                                Thông báo
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}`}>
                                <span className="icon"><IoIosSettings /></span>
                                Cài đặt
                            </Button>
                        </Link>
                    </li>

                </ul>

                <br />

                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button variant="contained" onClick={handleLogout}><IoMdLogOut /> Đăng xuất</Button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Sidebar;