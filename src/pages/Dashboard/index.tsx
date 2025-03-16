import { useUserStore } from '../../stores/userStore';
import StudentModule from './components/StudentModule';
import TeacherModule from './components/TeacherModule';

const Dashboard = () => {
  const version = useUserStore((state) => state.version);

  return version === 'Teacher' ? <TeacherModule /> : <StudentModule />;
};

export default Dashboard;
