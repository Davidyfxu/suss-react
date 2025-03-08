import { post } from '../utils/fetch';

export const login = (p: any = {}) => post('/api/users/no_auth/login/', p);
export const register = (p: any = {}) =>
  post('/api/users/no_auth/register/', p);
export const forgetPsw = (p: any = {}) =>
  post('/api/users/no_auth/password_reset_request/', p);
export const resetPsw = (p: any = {}) =>
  post('/api/users/no_auth/password_reset_confirm/', p);
export const get_captcha = (p: any = {}) =>
  post('/api/users/no_auth/get_captcha', p);
export const verify_captcha = (p: any = {}) =>
  post('/api/users/no_auth/verify_captcha', p);
export const refresh_captcha = (p: any = {}) =>
  post('/api/users/no_auth/refresh_captcha', p);
export const init = (p: any = {}) => post('/api/users/init/', p);
