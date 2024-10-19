import { useState } from 'react';
import { Form, InputNumber, Button, message, Table, Empty } from 'antd';
import { check_assignment } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { SelectSUSS } from '../../../../components';

const CheckAssignment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const courseCode = useUserStore((state) => state.courseCode);
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const params = { ...values, option_course: courseCode };
      const response = await check_assignment(params);
      setResult(response);
    } catch (error) {
      message.error('Failed to check assignment');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'user_name',
      key: 'user_name'
    }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Check Assignment Completion</h1>
      <Form
        className="justify-between gap-4"
        form={form}
        layout="inline"
        onFinish={handleSubmit}
      >
        <Form.Item
          className={'min-w-96'}
          label="Topics"
          name="option_topics"
          rules={[
            { required: true, message: 'Please select at least one topic' }
          ]}
        >
          <SelectSUSS
            mode="multiple"
            placeholder="Select topics"
            handleSelect={() => {}}
          />
        </Form.Item>
        <Form.Item
          label="Minimum Replies"
          name="num"
          rules={[
            {
              required: true,
              message: 'Please enter the minimum number of replies'
            }
          ]}
        >
          <InputNumber
            className={'min-w-60'}
            min={1}
            placeholder="Enter minimum replies"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Check Assignment
          </Button>
        </Form.Item>
      </Form>

      {result ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          {result.result === 1 && (
            <p className="text-green-600">{result.reason}</p>
          )}
          {result.result === 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2">Not Completed Students</h3>
              <Table
                dataSource={result.detail.not_completed_students}
                columns={columns}
                rowKey="user_name"
                pagination={false}
              />
              <h3 className="text-lg font-bold mt-4 mb-2">
                Completed Students
              </h3>
              <Table
                dataSource={result.detail.completed_students}
                columns={columns}
                rowKey="user_name"
                pagination={false}
              />
            </div>
          )}
          {result.result === 2 && (
            <p className="text-red-600">{result.reason}</p>
          )}
        </div>
      ) : (
        <Empty className={'p-20'} />
      )}
    </div>
  );
};

export default CheckAssignment;
