import { create } from 'zustand';
import { message } from 'antd';
import { init, login, register } from '../../common/api';
import { isEmpty } from 'lodash-es';
interface IUserStoreState {
  username: string;
  email: string;
  avatar: string;
  status?: string;
  // setUser: (props: { name: string; email: string }) => void;
  loading: boolean;
  fullName: string;
  initVer: 'Student' | 'Teacher';
  version: 'Student' | 'Teacher';
  is_superuser: boolean;
  is_superuser_verified: boolean;
  handleVer: (v: 'Student' | 'Teacher') => void;
  setLoading: (p: boolean) => void;
  registerUser: (props: {
    username: string;
    email: string;
    password: string;
    last_name: string;
  }) => Promise<any>;
  loginUser: (props: {
    username: string;
    password: string;
  }) => Promise<{ token: string; username: string; is_superuser: boolean }>;
  init: () => Promise<any>;
  courseCode?: string;
  setCourseCode?: (code: string) => void;
  dateRange?: Array<string>;
  setDateRange?: (range: string[]) => void;
  setSuperuserVerified: (verified: boolean) => void;
}
export const useUserStore = create<IUserStoreState>()((set) => ({
  username: '',
  email: '',
  avatar: '',
  fullName: '',
  loading: false,
  initVer: 'Teacher',
  version: 'Teacher',
  is_superuser: false,
  is_superuser_verified: false,
  setLoading: (p: boolean) => set({ loading: p }),
  setCourseCode: (p: string) => set({ courseCode: p }),
  setDateRange: (p: string[]) => set({ dateRange: p }),
  setSuperuserVerified: (verified) => set({ is_superuser_verified: verified }),
  registerUser: async (props): Promise<any> => {
    localStorage.removeItem('token');
    set(() => ({ loading: true }));
    await register({
      ...props
    });
    set(() => ({
      loading: false
    }));
    message.success('register success');
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
        is_superuser: res?.is_superuser || false,
        is_superuser_verified: !res?.is_superuser,
        loading: false
      }));
      res?.token && localStorage.setItem('token', `Bearer ${res?.token}`);
      return res;
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
        status: res['status'],
        version: res['enrollment_type'].replace(/Enrollment$/, ''),
        initVer: res['enrollment_type'].replace(/Enrollment$/, ''),
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
  },
  handleVer: (v: 'Teacher' | 'Student') => set({ version: v })
}));
