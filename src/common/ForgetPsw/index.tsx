import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Modal, Spin, Row, Col, message } from 'antd';
import styles from '../Login/index.module.scss';
import { forgetPsw, get_captcha, verify_captcha } from '../api.ts';

const ForgetPsw = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [captchaKey, setCaptchaKey] = useState();

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
      const userID = form.getFieldValue('userID');
      if (!userID) {
        message.error('Please enter your User ID first');
        return;
      }
      setLoading(true);
      const { captcha_key } = await get_captcha({ userID });
      message.success('Verification code has been sent to your email');
      setCountdown(60);
      setCaptchaKey(captcha_key);
    } catch (error) {
      console.error('Failed to send verification code:', error);
      message.error(
        `Failed to send verification code. Reason: ${error?.response?.data?.message || error?.message || 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const { userID, verificationCode } = form.getFieldsValue();
      setLoading(true);

      try {
        // First verify the verification code
        await verify_captcha({
          captcha_key: captchaKey,
          captcha_value: verificationCode
        });

        // Only proceed with password reset request if verification was successful
        const response: { status?: string; message?: string } = await forgetPsw(
          { userID }
        );

        if (response?.status === 'success') {
          Modal.success({
            content:
              response?.message ||
              'Password reset link has been sent to your email',
            okText: 'Back to Login Page',
            onOk: () => navigate('/login')
          });
        } else {
          message.error(
            response?.message || 'Failed to send password reset email'
          );
          form.resetFields(['verificationCode']);
        }
      } catch (error: any) {
        console.error('Password reset request error:', error);
        message.error(
          `${error?.response?.data?.message || error?.message || 'Unknown error'} Please try again`
        );
        form.resetFields(['verificationCode']);
      }
    } catch (e) {
      console.error('forgetPsw', e);
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
              Forget Password
            </h2>
          </div>
          <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form form={form}>
              <Spin spinning={loading}>
                <Form.Item
                  label="User ID"
                  name="userID"
                  rules={[
                    {
                      required: true,
                      message: 'Please fill your Canvas User ID'
                    }
                  ]}
                >
                  <Input placeholder="Please fill your Canvas User ID" />
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
                  <Input.OTP length={4} />
                </Form.Item>

                <div className={'flex justify-between items-center gap-4'}>
                  <Link to={'/login'}>
                    <Button>Login</Button>
                  </Link>
                  <Button type={'primary'} onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </Spin>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPsw;
