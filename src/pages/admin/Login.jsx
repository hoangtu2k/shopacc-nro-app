

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { AuthContext } from "../../hooks/AuthProvider";
import AuthService from '../../api/auth.service';

// Assets và icons
import Logo from '../../assets/images/logo.png';
import patern from '../../assets/images/patern.jpg';
import googleIcon from '../../assets/images/googleIcon.png';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';


const Login = () => {
  // State management (chỉ khai báo một lần)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Hooks
  const { login } = useContext(AuthContext);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  // Hide sidebar và header khi vào trang login
  context.setisHideSidebarAndHeader(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Tên tài khoản không được để trống';
    if (!formData.password.trim()) newErrors.password = 'Mật khẩu không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (redirectPath) => {
    if (!validateForm()) return;

    try {
      const { token } = await AuthService.login(formData.username, formData.password);
      const userData = await AuthService.getUserInfo(token);
      login(token, userData);
      navigate(redirectPath);
    } catch (error) {
      setErrors({
        password: error.response?.status === 401
          ? 'Tên tài khoản hoặc mật khẩu không hợp lệ'
          : 'Đăng nhập không thành công. Vui lòng thử lại'
      });
    }
  };

  return (
    <>
      <img src={patern} className="loginPatern" alt="" />
      <section className="loginSection">
        <div className="loginBox">
          <div className="logo text-center">
            <img src={Logo} width="60px" alt="" />
            <h5 className="font-weight-bold">Login to Hotash</h5>
          </div>

          <div className="wrapper mt-3 card border ">
            <form>
              <div className="form-group position-relative">
                <span className="icon">
                  <MdEmail />
                </span>
                <input
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập email"
                />
                {errors.username && <p className="error">{errors.username}</p>}
              </div>

              <div className="form-group position-relative">
                <span className="icon">
                  <RiLockPasswordFill />
                </span>
                <input
                  className="form-control"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                />
                <span className="toggleShowPassword" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </span>
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <Button className="btn-blue btn-lg w-100 " onClick={() => handleLogin('/admin')}>Quản lý</Button>
              </div>

              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </form>
          </div>

          <div className="wrapper mt-3 card border footer p-3">
            <span className="text-center">
              Bạn chưa có tài khoản?
              <Link to={"/admin/signUp"} className="link color ml-2">
                Đăng ký ngay
              </Link>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;