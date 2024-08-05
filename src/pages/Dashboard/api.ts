import { post } from "../../utils/fetch.tsx";

export const getAllReadData = (p: any = {}) =>
  post("/api/reads/read/get_all_read_data", p);
export const getAllDiscussions = (p: any = {}) =>
  post("/api/discussions/discussion/get_all_discussion_data", p);
