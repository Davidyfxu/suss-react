import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Spin,
  Image,
  message,
  Row,
  Col
} from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import styles from '../Login/index.module.scss';
import { get } from 'lodash-es';
import { get_captcha, verify_captcha, refresh_captcha } from '../api.ts';

interface ICaptcha {
  captcha_key: string;
  captcha_image: string;
}
const Register = () => {
  const [form] = Form.useForm();
  const registerUser = useUserStore((state) => state.registerUser);
  const username = useUserStore((state) => state.username);
  const loading = useUserStore((state) => state.loading);
  const setLoading = useUserStore((state) => state.setLoading);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState<ICaptcha>({} as ICaptcha);

  const getCaptcha = async (isReset = false) => {
    try {
      if (isReset && captcha?.captcha_key) {
        const res = await refresh_captcha(captcha);
        setCaptcha(res);
      } else {
        const res = await get_captcha({});
        setCaptcha(res);
      }
    } catch (e) {
      console.error(e);
      message.error('Failed to load captcha, please refresh the page');
    }
  };

  useEffect(() => {
    void getCaptcha();
  }, []);

  function handleSubmit(): void {
    form
      .validateFields()
      .then(async (value) => {
        const {
          username,
          email,
          password,
          confirmPwd,
          captchaInput,
          last_name
        } = value;

        if (password !== confirmPwd) {
          message.error('Passwords do not match');
          return;
        }

        // Verify captcha before registration
        try {
          setLoading(true);
          if (captcha?.captcha_key) {
            // First verify the captcha
            await verify_captcha({
              captcha_key: captcha.captcha_key,
              captcha_value: captchaInput.toUpperCase()
            });
            // Only proceed with registration if captcha verification was successful
            await registerUser({
              username,
              email,
              password,
              last_name
            });
            // Navigate to login page after successful registration
            setTimeout(() => {
              navigate('/login');
            }, 500);
          } else {
            message.error('Captcha not loaded properly');
            await getCaptcha(true);
          }
        } catch (error) {
          console.error('Registration error:', error);
          message.error(
            `Registration failed. Reason: ${get(error, 'response.data.message') || get(error, 'message')}`
          );
          await getCaptcha(true);
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Form validation error:', err);
      });
  }

  useEffect(() => {
    if (username) {
      setTimeout(() => {
        navigate('/login');
      }, 500);
    }
  }, [username, navigate]);

  return (
    <div className={styles.bg}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                label="UserID"
                name="username"
                rules={[{ required: true, message: 'Please fill your userId' }]}
              >
                <Input placeholder="Please fill your userId" />
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
                label="Name"
                name="last_name"
                rules={[{ required: true, message: 'Please fill your name' }]}
              >
                <Input placeholder="Please fill your name" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please fill your password' },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                    message:
                      'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and symbols'
                  }
                ]}
              >
                <Input.Password
                  allowClear
                  placeholder="Please fill your password"
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPwd"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
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
                  allowClear
                  placeholder="Confirm your password"
                />
              </Form.Item>
              <Form.Item
                label="Captcha"
                name="captchaInput"
                rules={[
                  { required: true, message: 'Please input the captcha' }
                ]}
                extra={
                  <Row gutter={16} align="middle" style={{ marginTop: 8 }}>
                    <Col>
                      {captcha?.captcha_image ? (
                        <Image
                          className={'rounded'}
                          width={160}
                          height={64}
                          src={captcha.captcha_image}
                          preview={false}
                        />
                      ) : (
                        <div
                          className={
                            'w-40 h-16 flex justify-center rounded items-center border mb-1'
                          }
                        >
                          <LoadingOutlined />
                        </div>
                      )}
                    </Col>
                    <Col>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={() => getCaptcha(true)}
                        title="Refresh captcha"
                      >
                        Can't see clearly? Refresh
                      </Button>
                    </Col>
                  </Row>
                }
              >
                <Input.OTP length={4} />
              </Form.Item>
              <Form.Item
                wrapperCol={{ offset: 3, span: 21 }}
                name="agree"
                valuePropName="checked"
              >
                <Checkbox>
                  I have read and agree to the terms of service
                </Checkbox>
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
    </div>
  );
};

export default Register;
