import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Spin, Typography } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
const Login = () => {
  const [form] = Form.useForm();
  const loginUser = useUserStore((state) => state.loginUser);
  const username = useUserStore((state) => state.username);
  const loading = useUserStore((state) => state.loading);
  const navigate = useNavigate();
  function handleSubmit(): void {
    form.validateFields().then(() => {
      const { username, password } = form.getFieldsValue();
      void loginUser({ username, password });
    });
  }
  useEffect(() => {
    if (username) {
      setTimeout(() => {
        navigate('/dashboard/dashboard');
      }, 100);
    }
  }, [username, navigate]);

  return (
    <div className={styles.bg}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/*<img src={png} alt="" />*/}
        <div className="bg-white m-4 sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-xl">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Login
            </h2>
          </div>
          <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form form={form}>
              <Spin spinning={loading}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: 'Please fill your username' }
                  ]}
                >
                  <Input placeholder="Please fill your username" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please fill your password' }
                  ]}
                >
                  <Input.Password
                    placeholder="Please fill your password"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit();
                      }
                    }}
                  />
                </Form.Item>
                <div className={'flex justify-between items-center'}>
                  <Link to={'/forgetPsw'}>
                    <Typography.Link>Forget Password?</Typography.Link>
                  </Link>
                  <div className={'flex gap-4'}>
                    <Link to={'/register'}>
                      <Button>Sign up</Button>
                    </Link>
                    <Button type={'primary'} onClick={handleSubmit}>
                      Log in
                    </Button>
                  </div>
                </div>
              </Spin>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
