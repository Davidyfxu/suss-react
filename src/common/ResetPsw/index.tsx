import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message, Spin } from 'antd';
import styles from '../Login/index.module.scss';
import { resetPsw, verify_reset_token } from '../api.ts';
import { useState, useEffect } from 'react';

const ResetPsw = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const verifyToken = async () => {
    try {
      setLoading(true);
      const { status } = await verify_reset_token({
        uid,
        token
      });
      setIsTokenValid(status === 'success');
    } catch (e) {
      console.error('verifyToken', e);
      setIsTokenValid(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void verifyToken();
  }, [uid, token, navigate]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const { password, confirmPwd } = form.getFieldsValue();
      if (password !== confirmPwd) return;
      setLoading(true);
      const { status, message: msg } = await resetPsw({
        new_password: password,
        uid,
        token
      });
      setLoading(false);
      if (status === 'success') {
        message.success(msg + ' Redirect to Login Page...');
        setTimeout(() => navigate('/login'), 1000);
      }
    } catch (e) {
      console.error('resetPsw', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bg}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="bg-white m-4 sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-xl">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
          </div>
          <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Spin spinning={loading}>
              {isTokenValid === null ? (
                <div className="text-center">Verifying reset token...</div>
              ) : isTokenValid ? (
                <Form form={form}>
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
                      {
                        required: true,
                        message: 'Please confirm your password'
                      },
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

                  <Button type={'primary'} block onClick={handleSubmit}>
                    Submit
                  </Button>
                </Form>
              ) : (
                <div className="text-center text-red-500">
                  Invalid reset link.
                </div>
              )}
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPsw;
