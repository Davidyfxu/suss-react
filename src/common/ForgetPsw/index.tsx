import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Modal, Spin } from 'antd';
import styles from '../Login/index.module.scss';
import { forgetPsw } from '../api.ts';
import { useState } from 'react';
const ForgetPsw = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const { email } = form.getFieldsValue();
      setLoading(true);
      const { status, msg } = await forgetPsw({ email });
      setLoading(false);
      if (status === 'success') {
        Modal.success({
          content: msg,
          okText: 'Back to Login Page',
          onOk: () => navigate('/login')
        });
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
