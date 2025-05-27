import { Button, Form, Input, message, Spin } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { useState } from 'react';
import { updateUser } from './api.ts';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

interface FormValues {
  username: string;
  email: string;
  last_name: string;
  password?: string;
  confirmPwd?: string;
}

const Profile = () => {
  const [form] = Form.useForm<FormValues>();
  const username = useUserStore((state) => state.username);
  const email = useUserStore((state) => state.email);
  const fullName = useUserStore((state) => state.fullName);
  const [loading, setLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const handleValuesChange = () => {
    const currentValues = form.getFieldsValue();
    const initialValues: FormValues = {
      username,
      email,
      last_name: fullName,
      password: undefined,
      confirmPwd: undefined
    };

    const hasChanges = Object.keys(currentValues).some(
      (key) =>
        currentValues[key as keyof FormValues] !==
        initialValues[key as keyof FormValues]
    );

    setFormChanged(hasChanges);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const { username, email, password, confirmPwd, last_name } =
        form.getFieldsValue();

      if (password && password !== confirmPwd) {
        return message.error(
          'Confirmation password must match the original password.'
        );
      }

      setLoading(true);
      await updateUser({
        username,
        email,
        password: password || undefined,
        last_name
      });
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
        <Form
          name="basic"
          form={form}
          layout="vertical"
          className="space-y-4"
          onValuesChange={handleValuesChange}
        >
          <Spin spinning={loading}>
            <Form.Item label="User ID" name="username" initialValue={username}>
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                disabled
                placeholder="Please fill your Canvas User ID"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              initialValue={email}
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                allowClear
                disabled
                placeholder="Please fill your SUSS email address"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="User Name"
              name="last_name"
              initialValue={fullName}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                allowClear
                placeholder="Please fill your user name"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                  message:
                    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number and one special character.'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                allowClear
                placeholder="Please fill your password (optional)"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPwd"
              dependencies={['password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !getFieldValue('password') ||
                      !value ||
                      getFieldValue('password') === value
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('The two passwords do not match!')
                    );
                  }
                })
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                allowClear
                placeholder="Confirm your password (optional)"
                className="rounded-md"
              />
            </Form.Item>
            <Button
              block
              type="primary"
              onClick={handleSubmit}
              disabled={!formChanged}
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
