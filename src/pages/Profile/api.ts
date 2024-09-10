import { post } from '../../utils/fetch.tsx';

export const updateUser = (p: any = {}) => post('/api/users/user_update/', p);
