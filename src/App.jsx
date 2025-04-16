import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/App.css';
import './styles/responsive.css';
import Header from "./components/Admin/Header";
import Sidebar from "./components/Admin/Sidebar";
import RequireAuth from "./hooks/RequireAuth";
import { AuthProvider } from "./hooks/AuthProvider";
import AdminRoutes from './routes/AdminRoutes';
import CustomerRoutes from './routes/CustomerRoutes';

const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [themeMode, setThemeMode] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenNav, setIsOpenNav] = useState(false);

  useEffect(() => {
    if (themeMode) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("themeMode", "light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("themeMode", "dark");
    }
  }, [themeMode]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    themeMode,
    setThemeMode,
    windowWidth,
    openNav,
    isOpenNav,
  };

  return (
    <AuthProvider>
      <Router>
        <MyContext.Provider value={values}>
          {!isHideSidebarAndHeader && <Header />}
          <div className="main d-flex">
            {!isHideSidebarAndHeader && (
              <>
                <div
                  className={`sidebarOverlay d-none ${isOpenNav && "show"}`}
                  onClick={() => setIsOpenNav(false)}
                ></div>
                <div className={`sidebarWrapper ${isToggleSidebar ? "toggle" : ""} ${isOpenNav ? "open" : ""}`}>
                  <Sidebar />
                </div>
              </>
            )}
            <div className={`content ${isHideSidebarAndHeader ? "full" : ""} ${isToggleSidebar ? "toggle" : ""}`}>
              <Routes>
                {/* Admin Routes with RequireAuth */}
                <Route path="/admin/*" element={
                  <RequireAuth>
                    <AdminRoutes />
                  </RequireAuth>
                } />
                {/* Customer Routes */}
                <Route path="/*" element={<CustomerRoutes />} />
              </Routes>
            </div>
          </div>
        </MyContext.Provider>
      </Router>
    </AuthProvider>
  );
}

export default App;
export { MyContext };