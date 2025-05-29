import React, { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }: { children: React.ReactNode }): any => {
  const navigate = useNavigate();

  const loading = useUserStore((state) => state.loading);
  const init = useUserStore((state) => state.init);
  const is_superuser = useUserStore((state) => state.is_superuser);
  const is_superuser_verified = useUserStore(
    (state) => state.is_superuser_verified
  );

  const checkToken = async () => {
    try {
      const { redirect } = await init();
      if (redirect) {
        navigate('/login');
        return;
      }

      // If user is superuser but not verified, redirect to login
      if (is_superuser && !is_superuser_verified) {
        navigate('/login');
        return;
      }
    } catch (e) {
      console.error('checkToken', e);
    }
  };

  useEffect(() => {
    void checkToken();
  }, [is_superuser, is_superuser_verified]);

  return loading ? <Spin className={'w-full mt-8'} size={'large'} /> : children;
};

export default ProtectedRoute;
