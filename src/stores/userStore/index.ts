import { create } from "zustand";
import { message } from "antd";
import { init, login, register } from "../../common/api";
import { isEmpty } from "lodash-es";
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
}
export const useUserStore = create<IUserStoreState>()((set) => ({
  username: "",
  email: "",
  avatar: "",
  loading: false,
  setUser: (props) => set({ ...props }),
  registerUser: async (props): Promise<any> => {
    try {
      set(() => ({ loading: true }));
      await register({
        ...props,
      });
      set(() => ({
        loading: false,
      }));
      message.success("注册成功");
    } catch (e) {
      message.error("注册失败");
      throw new Error("注册失败", e?.message);
    }
  },
  loginUser: async (props): Promise<any> => {
    try {
      set(() => ({ loading: true }));
      const res = await login({
        ...props,
        password: props.password,
      });

      set(() => ({
        ...res,
        loading: false,
      }));
      res?.token && localStorage.setItem("token", `Bearer ${res?.token}`);
      message.success("登录成功，跳转中");
    } catch (e) {
      console.error("loginUser", e);
      message.error("登录失败 ");
    }
  },
  init: async (): Promise<any> => {
    try {
      set(() => ({ loading: true }));
      const res = await init({});

      set(() => ({
        ...res,
        loading: false,
      }));
      return { redirect: isEmpty(res) };
    } catch (e) {
      console.error("loginUser", e);
      set(() => ({
        loading: false,
      }));
      return { redirect: true };
    }
  },
}));
