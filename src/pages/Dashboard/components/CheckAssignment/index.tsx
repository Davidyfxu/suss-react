import React, { useState } from 'react';
import {
  Form,
  InputNumber,
  Button,
  message,
  Table,
  Empty,
  Typography,
  Space,
  Alert
} from 'antd';
import { check_assignment } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { SelectSUSS } from '../../../../components';
import { utils, writeFile } from 'xlsx';
import { DownloadOutlined } from '@ant-design/icons';
const CheckAssignment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>({});
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

  const exportToExcel = () => {
    const workbook = utils.book_new();
    // 准备数据
    const completedStudents = (result?.detail?.completed_students || []).map(
      (student) => student?.user_name
    );

    const notCompletedStudents = (
      result?.detail?.not_completed_students || []
    ).map((student) => student?.user_name);

    // 确定最大行数
    const maxRows = Math.max(
      completedStudents.length,
      notCompletedStudents.length
    );

    // 创建包含标题和数据的数组
    const data = [
      ...Array(maxRows)
        .fill(null)
        .map((_, index) => ({
          'Completed Students': completedStudents[index] || '',
          'Not Completed Students': notCompletedStudents[index] || ''
        }))
    ];

    // 创建工作表
    const worksheet = utils.json_to_sheet(data);

    // 将工作表添加到工作簿
    utils.book_append_sheet(workbook, worksheet, 'Check Assignments Status');

    // 导出文件
    writeFile(workbook, `check_assignment_status_${courseCode}.xlsx`);
  };
  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'user_name',
      key: 'user_name'
    }
  ];

  return (
    <div className="p-4 min-h-[800px]">
      <Alert
        className={'mb-4'}
        message="Important Tips"
        description={
          'If instructors have requirement that students have to post a certain number of posts in one or more than one discussion topics, this is to facilitate instructors to check which students have posted according to the requirements.'
        }
        type="info"
        showIcon
      />
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
          <Space className={'mb-4'}>
            <h2 className="text-xl font-bold">Results</h2>
            <Button onClick={exportToExcel} icon={<DownloadOutlined />} />
          </Space>
          {result.result === 1 && (
            <p className="text-green-600">{result.reason}</p>
          )}
          {result.result === 0 && (
            <div className={'flex gap-4 justify-between'}>
              <div className={'flex-1'}>
                <h3 className="text-lg font-bold mb-2">Completed Students</h3>
                <Table
                  dataSource={result?.detail?.completed_students || []}
                  columns={columns}
                  rowKey="completed_students"
                />
              </div>
              <div className={'flex-1'}>
                <h3 className="text-lg font-bold mb-2">
                  Not Completed Students
                </h3>
                <Table
                  dataSource={result?.detail?.not_completed_students || []}
                  columns={columns}
                  rowKey="not_completed_students"
                />
              </div>
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
