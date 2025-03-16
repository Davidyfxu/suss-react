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
  initVer: 'Student' | 'Teacher';
  version: 'Student' | 'Teacher';
  handleVer: (v: 'Student' | 'Teacher') => void;
  setLoading: (p: boolean) => void;
  registerUser: (props: {
    username: string;
    email: string;
    password: string;
  }) => Promise<any>;
  loginUser: (props: { username: string; password: string }) => Promise<any>;
  init: () => Promise<any>;
  courseCode?: string;
  setCourseCode?: (code: string | null) => void;
  dateRange?: Array<string>;
  setDateRange?: (range: string[] | null) => void;
}
export const useUserStore = create<IUserStoreState>()((set) => ({
  username: '',
  email: '',
  avatar: '',
  loading: false,
  initVer: 'Teacher',
  version: 'Teacher',
  setUser: (props) => set({ ...props }),
  setLoading: (p: boolean) => set({ loading: p }),
  setCourseCode: (p) => set({ courseCode: p }),
  setDateRange: (p) => set({ dateRange: p }),
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
