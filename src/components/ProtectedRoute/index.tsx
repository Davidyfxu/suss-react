import React, { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { usePostHog } from 'posthog-js/react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }): any => {
  const navigate = useNavigate();
  const posthog = usePostHog();

  const {
    init,
    is_superuser,
    loading,
    username,
    is_superuser_verified,
    email,
    fullName
  } = useUserStore();

  useEffect(() => {
    if (username) {
      // Identify sends an event, so you may want to limit how often you call it
      posthog?.identify(username, {
        email,
        is_superuser,

        fullName
      });
    }
  }, [posthog, username, is_superuser, email, fullName]);

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
