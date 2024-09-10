import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Input, message, Spin } from 'antd';
import styles from '../Login/index.module.scss';
import { resetPsw } from '../api.ts';
import { useState } from 'react';

const ResetPsw = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const { password, confirmPwd } = form.getFieldsValue();
      if (password !== confirmPwd) return;
      setLoading(true);
      const { status, msg } = await resetPsw({
        new_password: password,
        uid,
        token
      });
      setLoading(false);
      if (status === 'success') {
        message.success(msg + 'Redirect to Login Page...');
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
            <Form form={form}>
              <Spin spinning={loading}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please fill your password' }
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
                  rules={[
                    { required: true, message: 'Please confirm your password' }
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
              </Spin>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPsw;
