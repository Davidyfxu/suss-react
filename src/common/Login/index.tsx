import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Spin, Typography, Modal, message } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { verify_otp } from '../api';

const Login = () => {
  const [form] = Form.useForm();
  const loginUser = useUserStore((state) => state.loginUser);
  const loading = useUserStore((state) => state.loading);
  const setSuperuserVerified = useUserStore(
    (state) => state.setSuperuserVerified
  );
  const navigate = useNavigate();
  const [vLoading, setVLoading] = useState(false);
  // superuser 二次验证相关
  const [superuserModal, setSuperuserModal] = useState(false);
  const [otp, setOtp] = useState('');
  const superuserLoginInfo = useRef<{
    username: string;
    password: string;
  } | null>(null);

  async function handleSubmit() {
    await form.validateFields();
    const { username, password } = form.getFieldsValue();
    // 先登录
    const res = await loginUser({ username, password });
    // 如果是superuser，弹窗扫码+验证码
    if (res?.is_superuser) {
      setSuperuserModal(true);
      superuserLoginInfo.current = { username, password };
    }
    // 普通用户自动跳转
    else if (res && !res.is_superuser) {
      navigate('/dashboard/dashboard');
    }
  }

  // superuser 验证码提交
  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      message.error('Please enter the 6-digit code');
      return;
    }
    try {
      setVLoading(true);
      const res = await verify_otp({ captcha_otp: otp });
      if (res?.result) {
        setSuperuserModal(false);
        setSuperuserVerified(true);
        message.success(res.message);
        navigate('/dashboard/dashboard');
      } else {
        message.error(res.message);
      }
      setOtp('');
    } catch (e: any) {
      message.error(e?.response?.data?.message || 'Please try again');
    } finally {
      setVLoading(false);
    }
  };

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
                  label="User ID"
                  name="username"
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
                      <Button>Register</Button>
                    </Link>
                    <Button type={'primary'} onClick={handleSubmit}>
                      Login
                    </Button>
                  </div>
                </div>
              </Spin>
            </Form>
          </div>
        </div>
      </div>
      {/* superuser 二次验证弹窗 */}
      <Modal
        open={superuserModal}
        title="Two-Factor Authentication"
        onCancel={() => setSuperuserModal(false)}
        centered
        width={300}
        footer={null}
      >
        <div className="flex flex-col items-center gap-4">
          <div>Please enter the 6-digit code</div>
          <Input
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            onPressEnter={handleOtpSubmit}
            style={{ width: 180, textAlign: 'center' }}
          />
          <Button
            loading={vLoading}
            type="primary"
            block
            onClick={handleOtpSubmit}
          >
            Verify
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
