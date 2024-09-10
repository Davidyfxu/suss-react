import { post } from '../../utils/fetch.tsx';

export const update_user = (p: any = {}) => post('/api/users/user_update/', p);
