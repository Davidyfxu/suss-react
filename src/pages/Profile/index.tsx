import { Button, Form, Input, message, Spin } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { useState } from 'react';
import { updateUser } from './api.ts';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const Profile = () => {
  const [form] = Form.useForm();
  const username = useUserStore((state) => state.username);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const { username, email, password, confirmPwd } = form.getFieldsValue();
      setLoading(true);
      if (password !== confirmPwd) return;
      await updateUser({ username, email, password });
      setLoading(false);
      message.success('Update user successfully');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e) {
      console.error('forgetPsw', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100"
      style={{ height: 'calc(100vh - 120px)' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Update User
        </h2>
        <Form name="basic" form={form} layout="vertical" className="space-y-4">
          <Spin spinning={loading}>
            <Form.Item label="Username" name="username" initialValue={username}>
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                disabled
                placeholder="Please fill your username"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                allowClear
                placeholder="Please fill your email"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                allowClear
                placeholder="Please fill your password"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item label="Confirm Password" name="confirmPwd">
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                allowClear
                placeholder="Confirm your password"
                className="rounded-md"
              />
            </Form.Item>
            <Button
              block
              type="primary"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Update
            </Button>
          </Spin>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
