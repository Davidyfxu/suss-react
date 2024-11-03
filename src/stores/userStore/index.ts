import { create } from 'zustand';
import { message } from 'antd';
import { init, login, register } from '../../common/api';
import { isEmpty } from 'lodash-es';
interface IUserStoreState {
  username: string;
  email: string;
  avatar: string;
  // setUser: (props: { name: string; email: string }) => void;
  loading: boolean;
  registerUser: (props: {
    username: string;
    email: string;
    password: string;
  }) => Promise<any>;
  loginUser: (props: { username: string; password: string }) => Promise<any>;
  init: () => Promise<any>;
  courseCode?: string;
  setCourseCode?: (code: string) => void;
}
export const useUserStore = create<IUserStoreState>()((set) => ({
  username: '',
  email: '',
  avatar: '',
  loading: false,
  setUser: (props) => set({ ...props }),
  setCourseCode: (p) => set({ courseCode: p }),
  registerUser: async (props): Promise<any> => {
    try {
      localStorage.removeItem('token');
      set(() => ({ loading: true }));
      await register({
        ...props
      });
      set(() => ({
        loading: false
      }));
      message.success('register success');
    } catch (e) {
      set(() => ({
        loading: false
      }));
      message.error('register error');
    }
  },
  loginUser: async (props): Promise<any> => {
    try {
      localStorage.removeItem('token');
      set(() => ({ loading: true }));
      const res = await login({
        ...props,
        password: props.password
      });

      set(() => ({
        ...res,
        loading: false
      }));
      res?.token && localStorage.setItem('token', `Bearer ${res?.token}`);
      message.success('login success');
    } catch (e) {
      set(() => ({
        loading: false
      }));
      message.error('login error');
    }
  },
  init: async (): Promise<any> => {
    try {
      set(() => ({ loading: true }));
      const res = await init({});

      set(() => ({
        ...res,
        loading: false
      }));
      return { redirect: isEmpty(res) };
    } catch (e) {
      set(() => ({
        loading: false,
        username: ''
      }));
      return { redirect: true };
    }
  }
}));
