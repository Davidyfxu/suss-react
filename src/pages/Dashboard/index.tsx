import { useUserStore } from '../../stores/userStore';
import StudentModule from './components/StudentModule';
import TeacherModule from './components/TeacherModule';
import { useHeartbeat } from '../../utils/useHeartbeat';

const Dashboard = () => {
  const version = useUserStore((state) => state.version);
  useHeartbeat();

  return version === 'Teacher' ? <TeacherModule /> : <StudentModule />;
};

export default Dashboard;
