import React, { useState, useEffect } from 'react';
import UserService from '../../api/user.service'
import { Button, Table, Modal, Form, Input, message } from 'antd';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý tạo/cập nhật user
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (currentUser) {
        // Cập nhật user
        await UserService.updateUser(currentUser.id, values);
        message.success('Cập nhật người dùng thành công');
      } else {
        // Tạo mới user
        await UserService.createUser(values);
        message.success('Tạo người dùng thành công');
      }
      
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Xóa user
  const handleDelete = async (id) => {
    try {
      await UserService.deleteUser(id);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      message.error('Xóa người dùng thất bại');
    }
  };

  // Mở modal thêm/sửa
  const showModal = (user = null) => {
    setCurrentUser(user);
    form.setFieldsValue(user || {});
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()}>
        Thêm người dùng
      </Button>

      <Table 
        columns={columns} 
        dataSource={users} 
        loading={loading} 
        rowKey="id" 
      />

      <Modal
        title={currentUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>
          {!currentUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;