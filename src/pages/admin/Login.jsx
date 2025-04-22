import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import Logo from "../../assets/images/logo.png";
import patern from "../../assets/images/patern.jpg";
import googleIcon from "../../assets/images/googleIcon.png";

import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import { MyContext } from "../../App";
import { AuthContext } from "../../services/auth/AuthService";

import { loginAdmin, fetchCurrentUser } from "../../services/api/authAPI";

const Login = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { setisHideSidebarAndHeader } = useContext(MyContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setisHideSidebarAndHeader(true);
  }, []);

  const validateForm = () => {
    let valid = true;
    if (!username) {
      setUsernameError('Tên tài khoản không được để trống.');
      valid = false;
    } else setUsernameError('');

    if (!password) {
      setPasswordError('Mật khẩu không được để trống.');
      valid = false;
    } else setPasswordError('');

    return valid;
  };

  const handleLogin = async (redirectPath = "/admin") => {
    if (!validateForm()) return;

    try {
      const res = await loginAdmin(username, password);
      const token = res.data.token;
      const userRes = await fetchCurrentUser(token);
      login(token, userRes.data);
      navigate(redirectPath);
    } catch (err) {
      if (err.response?.status === 401) {
        setPasswordError('Tên tài khoản hoặc mật khẩu không hợp lệ.');
      } else {
        setPasswordError('Đăng nhập không thành công. Vui lòng thử lại.');
      }
    }
  };

  return (
    <>
      <img src={patern} className="loginPatern" alt="" />
      <section className="loginSection">
        <div className="loginBox">
          <div className="logo text-center">
            <img src={Logo} width="60px" alt="Logo" />
            <h5 className="font-weight-bold">Login to Hotash</h5>
          </div>

          <div className="wrapper mt-3 card border">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Username input */}
              <div className={`form-group position-relative ${inputIndex === 0 && "focus"}`}>
                <span className="icon"><MdEmail /></span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Nhập email"
                  onFocus={() => setInputIndex(0)}
                  onBlur={() => setInputIndex(null)}
                />
                {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
              </div>

              {/* Password input */}
              <div className={`form-group position-relative ${inputIndex === 1 && "focus"}`}>
                <span className="icon"><RiLockPasswordFill /></span>
                <input
                  type={isShowPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  onFocus={() => setInputIndex(1)}
                  onBlur={() => setInputIndex(null)}
                />
                <span
                  className="toggleShowPassword"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                </span>
                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
              </div>

              {/* Buttons */}
              <div className="form-group">
                <div className="row">
                  <div className="col-md-6">
                    <Button className="btn-blue btn-lg w-100" onClick={() => handleLogin("/admin")}>
                      Quản lý
                    </Button>
                  </div>
                  <div className="col-md-6">
                    <Button className="btn-blue btn-lg w-100" onClick={() => handleLogin("/sale")}>
                      Bán hàng
                    </Button>
                  </div>
                </div>
              </div>

              {/* Extra options */}
              <div className="form-group text-center mb-0">
                <Link to={"/forgot-password"} className="link">Quên mật khẩu</Link>
                <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                  <span className="line"></span>
                  <span className="txt">or</span>
                  <span className="line"></span>
                </div>
                <Button variant="outlined" className="w-100 btn-lg btn-big loginWithGoogle">
                  <img src={googleIcon} width="25px" alt="logo" /> &nbsp; Đăng nhập với Google
                </Button>
              </div>
            </form>
          </div>

          <div className="wrapper mt-3 card border footer p-3">
            <span className="text-center">
              Bạn chưa có tài khoản?
              <Link to={"/admin/signUp"} className="link color ml-2">Đăng ký ngay</Link>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;