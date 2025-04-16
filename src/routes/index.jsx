import Login from "../pages/admin/Login";
import SignUp from "../pages/admin/SignUp";

import Dashboard from "../pages/admin/Dashboard";

import Home from "../pages/customer/Home";


const publicRouters = [

        { path: '/admin/login', component: Login },
        { path: '/admin/signUp', component: SignUp },

        { path: '/admin/', component: Dashboard , private: true},
        { path: '/admin/dashboard', component: Dashboard, private: true },
        
        { path: '/', component: Home },

      ];

export { publicRouters};