import api from './axiosConfig';

const UserService = {
  // Lấy danh sách users
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin user theo ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo mới user
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật user
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (id, passwordData) => {
    try {
      const response = await api.patch(`/admin/users/${id}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default UserService;