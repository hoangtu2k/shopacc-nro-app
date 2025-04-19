import React, { useState } from 'react';
import UserService from '../../api/user.service'
import { Form, Input, Button, message } from 'antd';
import { useParams } from 'react-router-dom';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await UserService.changePassword(id, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      message.success('Đổi mật khẩu thành công');
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="oldPassword"
        label="Mật khẩu cũ"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="Mật khẩu mới"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu không khớp'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Đổi mật khẩu
      </Button>
    </Form>
  );
};

export default ChangePassword;