import { Card, Progress, Table, Statistic } from 'antd';
import {
  MessageOutlined,
  ScheduleOutlined,
  BookOutlined,
  BarChartOutlined
} from '@ant-design/icons';

const StudentModule = () => {
  // Mock data for demo
  const courseProgress = 65;
  const assignments = [
    { id: 1, title: 'Week 5 Essay', due: '2024-03-25', status: 'Pending' },
    { id: 2, title: 'Final Project', due: '2024-04-15', status: 'In Progress' }
  ];

  const grades = [
    { id: 1, assignment: 'Midterm Exam', score: 85, date: '2024-02-28' },
    { id: 2, assignment: 'Group Presentation', score: 92, date: '2024-03-14' }
  ];

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {/* Course Progress Card */}
      <Card className="col-span-2" hoverable>
        <div className="flex items-center gap-4 mb-4">
          <BookOutlined className="text-2xl text-blue-600" />
          <h3 className="text-lg font-semibold">Course Progress</h3>
        </div>
        <Progress
          percent={courseProgress}
          status="active"
          strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
        />
        <Statistic
          className="mt-4"
          title="Completed Modules"
          value={7}
          suffix="/ 10"
        />
      </Card>

      {/* Upcoming Assignments */}
      <Card className="col-span-2" hoverable>
        <div className="flex items-center gap-4 mb-4">
          <ScheduleOutlined className="text-2xl text-orange-500" />
          <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
        </div>
        <Table
          dataSource={assignments}
          pagination={false}
          rowKey="id"
          size="small"
        >
          <Table.Column title="Assignment" dataIndex="title" />
          <Table.Column title="Due Date" dataIndex="due" />
          <Table.Column title="Status" dataIndex="status" />
        </Table>
      </Card>

      {/* Recent Grades */}
      <Card className="col-span-2" hoverable>
        <div className="flex items-center gap-4 mb-4">
          <BarChartOutlined className="text-2xl text-green-600" />
          <h3 className="text-lg font-semibold">Recent Grades</h3>
        </div>
        <Table dataSource={grades} pagination={false} rowKey="id" size="small">
          <Table.Column title="Assignment" dataIndex="assignment" />
          <Table.Column
            title="Score"
            dataIndex="score"
            render={(v) => `${v}%`}
          />
          <Table.Column title="Date" dataIndex="date" />
        </Table>
      </Card>

      {/* Discussion Participation */}
      <Card className="col-span-2" hoverable>
        <div className="flex items-center gap-4 mb-4">
          <MessageOutlined className="text-2xl text-purple-600" />
          <h3 className="text-lg font-semibold">Discussion Activity</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Statistic title="Total Posts" value={24} />
          <Statistic title="Replies Received" value={18} />
          <Statistic title="Active Threads" value={5} />
          <Statistic title="Peer Interactions" value={15} />
        </div>
      </Card>
    </div>
  );
};

export default StudentModule;
