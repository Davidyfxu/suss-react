import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Modal,
  Spin,
  Image,
  Row,
  Col,
  message
} from 'antd';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from '../Login/index.module.scss';
import {
  forgetPsw,
  get_captcha,
  verify_captcha,
  refresh_captcha
} from '../api.ts';
interface ICaptcha {
  captcha_key: string;
  captcha_image: string;
}

const ForgetPsw = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const { email, captchaInput } = form.getFieldsValue();
      setLoading(true);

      // Verify captcha before sending password reset request
      if (captcha?.captcha_key) {
        try {
          // First verify the captcha
          await verify_captcha({
            captcha_key: captcha.captcha_key,
            captcha_value: captchaInput
          });

          // Only proceed with password reset request if captcha verification was successful
          const response: { status?: string; message?: string } =
            await forgetPsw({ email });

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
            await getCaptcha(true);
          }
        } catch (error: any) {
          console.error('Password reset request error:', error);
          message.error(
            `Password reset request failed. Reason: ${error?.response?.data?.message || error?.message || 'Unknown error'}`
          );
          await getCaptcha(true);
        }
      } else {
        message.error('Captcha not loaded properly');
        await getCaptcha(true);
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
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: 'Please fill your email'
                    }
                  ]}
                >
                  <Input placeholder="Please fill your email" />
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
                        >
                          Refresh
                        </Button>
                      </Col>
                    </Row>
                  }
                >
                  <Input.OTP length={4} />
                </Form.Item>

                <div className={'flex justify-end items-center gap-4'}>
                  <Link to={'/login'}>
                    <Button>Log in</Button>
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
