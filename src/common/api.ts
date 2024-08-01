import { post } from "../utils/fetch";

export const login = (p: any = {}) => post("/api/users/no_auth/login/", p);
export const register = (p: any = {}) =>
  post("/api/users/no_auth/register/", p);
export const init = (p: any = {}) => post("/api/users/init/", p);
