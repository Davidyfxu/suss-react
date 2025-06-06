import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Spin, message, Row, Col } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import styles from '../Login/index.module.scss';
import { get } from 'lodash-es';
import { get_captcha, verify_captcha } from '../api.ts';

const Register = () => {
  const [form] = Form.useForm();
  const registerUser = useUserStore((state) => state.registerUser);
  const username = useUserStore((state) => state.username);
  const loading = useUserStore((state) => state.loading);
  const setLoading = useUserStore((state) => state.setLoading);
  const [captchaKey, setCaptchaKey] = useState();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const sendVerificationCode = async () => {
    try {
      const userID = form.getFieldValue('username');
      if (!userID) {
        message.error('Please enter your User ID first');
        return;
      }
      setLoading(true);
      const { captcha_key } = await get_captcha({ userID });
      message.success('Verification code has been sent to your SUSS email');
      setCountdown(60);
      setCaptchaKey(captcha_key);
    } catch (error) {
      console.error('Failed to send verification code:', error);
      message.error(
        `Failed to send verification code. ${get(error, 'response.data.message') || get(error, 'message')}`
      );
    } finally {
      setLoading(false);
    }
  };

  function handleSubmit(): void {
    form
      .validateFields()
      .then(async (value) => {
        const { username, password, confirmPwd, verificationCode, last_name } =
          value;

        if (password !== confirmPwd) {
          message.error('Passwords do not match');
          return;
        }

        try {
          setLoading(true);
          // Verify the email verification code
          await verify_captcha({
            captcha_key: captchaKey,
            captcha_value: verificationCode
          });
          // Only proceed with registration if verification was successful
          await registerUser({
            username,
            password,
            last_name
          });
          // Navigate to login page after successful registration
          setTimeout(() => {
            navigate('/login');
          }, 500);
        } catch (error) {
          console.error('Registration error:', error);
          message.error(
            `Registration failed. ${get(error, 'response.data.message') || get(error, 'message')}`
          );
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
                label="User ID"
                name="username"
                rules={[
                  { required: true, message: 'Please fill your Canvas User ID' }
                ]}
              >
                <Input placeholder="Please fill your Canvas User ID" />
              </Form.Item>
              <Form.Item
                label="User Name"
                name="last_name"
                rules={[
                  { required: true, message: 'Please fill your user name' }
                ]}
              >
                <Input placeholder="Please fill your user name" />
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
                      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number and one special character.'
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
                label="Verification Code"
                name="verificationCode"
                rules={[
                  {
                    required: true,
                    message: 'Please input the verification code'
                  }
                ]}
                extra={
                  <Row gutter={16} align="middle" style={{ marginTop: 8 }}>
                    <Col>
                      <Button
                        type="primary"
                        onClick={sendVerificationCode}
                        disabled={countdown > 0}
                      >
                        {countdown > 0
                          ? `Resend in ${countdown}s`
                          : 'Send Code'}
                      </Button>
                    </Col>
                  </Row>
                }
              >
                <Input.OTP length={6} />
              </Form.Item>
              <div className={'flex justify-between items-center'}>
                <Link to={'/login'}>
                  <Button className="ml-2">Login</Button>
                </Link>

                <Button type="primary" onClick={handleSubmit}>
                  Register
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
