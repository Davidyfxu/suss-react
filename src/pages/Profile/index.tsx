import { Button, Form, Input, message, Spin } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { useState } from 'react';
import { updateUser } from './api.ts';

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
    <div className="flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="bg-white m-4 sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update User
          </h2>
        </div>
        <Form
          name="basic"
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 15 }}
          style={{ maxWidth: 800, margin: 32 }}
          form={form}
        >
          <Spin spinning={loading}>
            <Form.Item label="Username" name="username" initialValue={username}>
              <Input disabled placeholder="Please fill your username" />
            </Form.Item>
            <Form.Item rules={[{ type: 'email' }]} label="Email" name="email">
              <Input allowClear placeholder="Please fill your email" />
            </Form.Item>

            <Form.Item label="Password" name="password">
              <Input.Password
                allowClear
                placeholder="Please fill your password"
              />
            </Form.Item>
            <Form.Item label="Confirm Password" name="confirmPwd">
              <Input.Password allowClear placeholder="Confirm your password" />
            </Form.Item>
            <Button block type="primary" onClick={handleSubmit}>
              Update
            </Button>
          </Spin>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
