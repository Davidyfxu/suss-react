import { post } from "../utils/fetch";

export const login = (p: any = {}) => post("/api/init/users/login/", p);
export const register = (p: any = {}) => post("/auth/register", p);
export const init = (p: any = {}) => post("/auth/init", p);
