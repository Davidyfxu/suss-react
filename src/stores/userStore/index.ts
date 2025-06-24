import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
    email?: string;
    password: string;
    last_name: string;
  }) => Promise<any>;
  loginUser: (props: {
    username: string;
    password: string;
  }) => Promise<{ token: string; username: string; is_superuser: boolean }>;
  init: () => Promise<any>;
  courseCode?: string;
  setCourseCode?: (code: string | undefined) => void;
  dateRange?: string[];
  setDateRange?: (range: string[]) => void;
  setSuperuserVerified: (verified: boolean) => void;
}

export const useUserStore = create<IUserStoreState>()(
  persist(
    (set) => ({
      username: '',
      email: '',
      avatar: '',
      fullName: '',
      loading: false,
      initVer: 'Teacher',
      version: 'Teacher',
      is_superuser: false,
      courseCode: undefined,
      is_superuser_verified: false,
      setLoading: (p: boolean) => set({ loading: p }),
      setCourseCode: (p: string | undefined) => set({ courseCode: p }),
      setDateRange: (p: string[]) => set({ dateRange: p }),
      setSuperuserVerified: (verified) =>
        set({ is_superuser_verified: verified }),
      registerUser: async (props): Promise<any> => {
        localStorage.removeItem('token');
        set(() => ({ loading: true }));
        const { message: resMessage } = await register({
          ...props
        });
        set(() => ({
          loading: false
        }));
        if (resMessage) {
          throw new Error(resMessage);
        } else {
          message.success('register success');
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
    }),
    {
      name: 'user-storage', // 存储的key名称
      partialize: (state) => ({
        // 只持久化这些字段，排除loading等临时状态
        username: state.username,
        email: state.email,
        avatar: state.avatar,
        fullName: state.fullName,
        initVer: state.initVer,
        version: state.version,
        is_superuser: state.is_superuser,
        is_superuser_verified: state.is_superuser_verified,
        // courseCode: state.courseCode,
        // dateRange: state.dateRange,
        status: state.status
      })
    }
  )
);
