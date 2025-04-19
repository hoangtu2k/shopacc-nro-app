import api from './axiosConfig';

const AuthService = {
  login: async (username, password) => {
    return api.post('/auth/admin/login', { username, password });
  },
  
  getUserInfo: async () => {
    return api.get('/admin/users');
  }
};

export default AuthService;