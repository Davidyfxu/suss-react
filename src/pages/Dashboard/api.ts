import { post } from '../../utils/fetch.tsx';

export const getAllReadData = (p: any = {}) =>
  post('/api/reads/read/get_all_read_data', p);
export const getAllDiscussions = (p: any = {}) =>
  post('/api/discussions/discussion/get_all_discussion_data', p);

export const get_course_overview = (p: any = {}) =>
  post('/api/discussions/course_overview', p);

export const draw_participants_posts = (p: any = {}) =>
  post('/api/discussions/draw_participants_posts', p);

export const draw_wordcloud = (p: any = {}) =>
  post('/api/discussions/draw_wordcloud', p);

export const draw_network = (p: any = {}) =>
  post('/api/discussions/draw_network', p);

export const get_discussion_participation = (p: any = {}) =>
  post('/api/discussions/get_discussion_participation', p);

export const get_active_topics = (p: any = {}) =>
  post('/api/discussions/course_active_topics', p);

export const get_student_options = (p: any = {}) =>
  post('/api/discussions/student_options', p);
export const check_assignment = (p: any = {}) =>
  post('/api/discussions/check_assignment', p);
