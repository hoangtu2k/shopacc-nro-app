import Login from "../pages/admin/Login";
import SignUp from "../pages/admin/SignUp";

import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";

import Home from "../pages/customer/Home";
import ProductList from "../pages/customer/ProductList";
import ProductDetail from "../pages/customer/ProductDetail";
import Cart from "../pages/customer/Cart";
import CheckOut from "../pages/customer/CheckOut";

const publicRouters = [

        { path: '/admin/login', component: Login},
        { path: '/admin/signUp', component: SignUp},

        { path: '/admin/', component: Dashboard , private: true},
        { path: '/admin/dashboard', component: Dashboard, private: true},
        { path: '/admin/user-management', component: UserManagement, private: true},

        { path: '/', component: Home },
        { path: '/product-list', component: ProductList},
        { path: '/product-detail', component: ProductDetail},
        { path: '/cart', component: Cart },
        { path: '/check-out', component: CheckOut},

      ];

export { publicRouters};