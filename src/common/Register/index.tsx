import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Form, Input, Spin } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form] = Form.useForm();
  const registerUser = useUserStore((state) => state.registerUser);
  const username = useUserStore((state) => state.username);
  const loading = useUserStore((state) => state.loading);
  const navigate = useNavigate();

  function handleSubmit(): void {
    form
      .validateFields()
      .then((value) => {
        const { username, email, password, confirmPwd } = value;
        if (password !== confirmPwd) return;
        void registerUser({ username, email, password });
      })
      .then(() =>
        setTimeout(() => {
          navigate('/login');
        }, 500)
      );
  }

  useEffect(() => {
    if (username) {
      setTimeout(() => {
        navigate('/');
      }, 500);
    }
  }, [username, navigate]);

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="bg-white m-4 sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register
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
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please fill your username' }]}
            >
              <Input placeholder="Please fill your username" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Please fill your email'
                }
              ]}
            >
              <Input allowClear placeholder="Please fill your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please fill your password' }]}
            >
              <Input.Password
                allowClear
                placeholder="Please fill your password"
              />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPwd"
              rules={[
                { required: true, message: 'Please confirm your password' }
              ]}
            >
              <Input.Password allowClear placeholder="Confirm your password" />
            </Form.Item>
            <Form.Item
              wrapperCol={{ offset: 3, span: 21 }}
              name="agree"
              valuePropName="checked"
            >
              <Checkbox>I have read and agree to the terms of service</Checkbox>
            </Form.Item>

            <div className={'flex justify-between items-center'}>
              <p>
                <span>Or</span>
                <Link to={'/login'}>
                  <Button className="ml-2">Log in</Button>
                </Link>
              </p>

              <Button type="primary" onClick={handleSubmit}>
                Sign up
              </Button>
            </div>
          </Spin>
        </Form>
      </div>
    </div>
  );
};

export default Register;
