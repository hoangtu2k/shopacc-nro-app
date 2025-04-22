import logo from '../../assets/images/logo.webp';
import Button from '@mui/material/Button';
import { MdMenuOpen } from "react-icons/md";
import { CiLight } from "react-icons/ci";

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMenu } from "react-icons/md";
import { IoMenu, IoShieldHalfSharp } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { Divider } from "@mui/material";
import { FaUser } from "react-icons/fa";

import { MyContext } from "../../App";

import { AuthContext } from "../../services/auth/AuthService";

import defaultImage from '../../assets/images/logo.png'; // Đường dẫn tương đối từ file hiện tại


function Header() {

    const { logout } = useContext(AuthContext);

    const { user } = useContext(AuthContext); 

    const userName = user?.name || "Tên không xác định";
    const roleName = user?.roleName || "Chức vụ không xác định";

    const [userImage, setUserImage] = useState('');

    useEffect(() => {
        if (user && user.image) {
            setUserImage(user?.image); // Giả sử user.image chứa link ảnh
        }
    }, [user]);


    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpenNotificationsDrop, setisOpenNotificationsDrop] = useState(false);
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpenNotificationsDrop);

    const navigate = useNavigate(); // Khai báo hook navigate

    const handleLogout = () => {
        logout(); // Gọi hàm logout
        navigate("/admin/login"); // Điều hướng về trang login
    };

    const context = useContext(MyContext);

    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMyAccDrop = (event) => {
        setAnchorEl(null);
    };

    const handleOpenNotificationsDrop = () => {
        setisOpenNotificationsDrop(true);
    };

    const handleCloseNotificationsDrop = () => {
        setisOpenNotificationsDrop(false);
    };

    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/*Logo wraooer */}
                        <div className="col-sm-2 part1">
                            <Link to={"/admin"} className="d-flex align-items-center logo">
                                <img src={logo} alt="" />
                                <span className="ml-2">HOTASH</span>
                            </Link>
                        </div>

                        {context.windowWidth > 992 && (
                            <div className="col-sm-3 d-flex align-items-center part2 res-hide">
                                <Button
                                    className="rounded-circle mr-3"
                                    onClick={() =>
                                        context.setIsToggleSidebar(!context.isToggleSidebar)
                                    }
                                >
                                    {context.isToggleSidebar === false ? (
                                        <MdMenuOpen />
                                    ) : (
                                        <MdOutlineMenu />
                                    )}
                                </Button>

                            </div>
                        )}

                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            <Button
                                className="rounded-circle mr-3"
                                onClick={() => context.setThemeMode(!context.themeMode)}
                            >
                                <CiLight />
                            </Button>

                            <div className="dropdownWrapper position-relative">
                                <Button
                                    className="rounded-circle mr-3"
                                    onClick={handleOpenNotificationsDrop}
                                >
                                    <FaRegBell />
                                </Button>

                                <Button
                                    className="rounded-circle mr-3 rounded-circle-nav"
                                    onClick={() => context.openNav()}
                                >
                                    <IoMenu />
                                </Button>

                                <Menu
                                    anchorEl={isOpenNotificationsDrop}
                                    className="notifications dropdown_list"
                                    id="notifications"
                                    open={openNotifications}
                                    onClose={handleCloseNotificationsDrop}
                                    onClick={handleCloseNotificationsDrop}
                                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                >
                                    <div className="head pl-3 pb-0">
                                        <h4>Orders (12)</h4>
                                    </div>
                                    <Divider className="mb-1" />

                                    <div className="scroll">
                                        <MenuItem onClick={handleCloseNotificationsDrop}>
                                            <div className="d-flex">
                                                <div>
                                                    <div className="userImg">
                                                        <span className="rounded-circle">
                                                            <img
                                                                src={logo}
                                                                alt="1"
                                                            />
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="dropdownInfo">
                                                    <h4>
                                                        <span>
                                                            <b>Mahmudul</b>
                                                            added to his favorite list
                                                            <b>Leather belt steve madden</b>
                                                        </span>
                                                    </h4>
                                                    <p className="text-sky mb-0">few seconds ago</p>
                                                </div>
                                            </div>
                                        </MenuItem>
                                    </div>

                                    <div className="pl-3 pr-3 w-100 pt-2 pb-1">
                                        <Button className="btn-blue w-100">
                                            View all Notifications
                                        </Button>
                                    </div>
                                </Menu>
                            </div>

                            {context.isLogin !== true ? (
                                <Link to={"/admin/login"}>
                                    <Button className="btn-blue btn-lg btn-round">
                                        Đăng nhập
                                    </Button>
                                </Link>
                            ) : (
                                <div className="myAccWrapper">
                                    <Button
                                        className="myAcc d-flex align-items-center"
                                        onClick={handleOpenMyAccDrop}
                                    >
                                        <div className="userImg">
                                            <span className="rounded-circle">

                                            <img src={userImage || defaultImage} alt="User  Avatar" /> {/* Hiển thị ảnh người dùng */}

                                            </span>
                                        </div>

                                        <div className="userInfo res-hide">
                                            <h4>{userName}</h4>
                                            <p className="mb-0">{roleName}</p>
                                        </div>
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        id="account-menu"
                                        open={openMyAcc}
                                        onClose={handleCloseMyAccDrop}
                                        onClick={handleCloseMyAccDrop}
                                        slotProps={{
                                            paper: {
                                                elevation: 0,
                                                sx: {
                                                    overflow: "visible",
                                                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                                    mt: 1.5,
                                                    "& .MuiAvatar-root": {
                                                        width: 32,
                                                        height: 32,
                                                        ml: -0.5,
                                                        mr: 1,
                                                    },
                                                    "&::before": {
                                                        content: '""',
                                                        display: "block",
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 14,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: "background.paper",
                                                        transform: "translateY(-50%) rotate(45deg)",
                                                        zIndex: 0,
                                                    },
                                                },
                                            },
                                        }}
                                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                    >
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <ListItemIcon>
                                                <FaUser fontSize="small" />
                                            </ListItemIcon>
                                            Tài khoản của tôi
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <ListItemIcon>
                                                <IoShieldHalfSharp fontSize="small" />
                                            </ListItemIcon>
                                            Đặt lại mật khẩu
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Đăng xuất
                                        </MenuItem>
                                    </Menu>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;