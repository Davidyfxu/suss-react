import { post } from '../../utils/fetch.tsx';

export const get_course_options = (p: any = {}) =>
  post('/api/discussions/course_options', p);
