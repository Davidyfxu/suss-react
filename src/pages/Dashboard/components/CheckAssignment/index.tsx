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
import { isEmpty } from 'lodash-es';

const CheckAssignment = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>({});
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const params = { ...values, option_course: courseCode };
      dateRange?.[0] && (params['end_date'] = dateRange?.[0]);
      dateRange?.[1] && (params['end_date'] = dateRange?.[1]);
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
    <div
      className="flex flex-row gap-6"
      style={{ minHeight: 'calc(100vh - 160px)' }}
    >
      <div className="w-80 flex flex-col gap-6">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Please select the topic title to check the assignment completion status."
            name="option_topics"
            rules={[
              { required: true, message: 'Please select at least one topic' }
            ]}
          >
            <SelectSUSS
              mode="multiple"
              placeholder="Multiselect"
              handleSelect={() => {}}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="For selected topic(s), how many replies each student is required to post?"
            name="num"
            rules={[
              {
                required: true,
                message: 'Please enter the minimum number of replies'
              }
            ]}
          >
            <InputNumber
              className="w-full"
              min={1}
              placeholder="Type a number..."
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={loading}>
              Check Assignment
            </Button>
          </Form.Item>
        </Form>

        <Alert
          description={
            <>
              If instructors have requirement that students have to post a
              certain number of posts in one or more than one discussion topics,
              this is to facilitate instructors to check which students have
              posted according to the requirements.
            </>
          }
        />
      </div>

      {isEmpty(result) ? (
        <Empty
          className={
            'flex-1 bg-white border border-gray-100 rounded-xl flex justify-center items-center flex-col'
          }
          description={'No data available. Please select at least one topic.'}
        />
      ) : (
        <div className={'flex-1 rounded-xl p-6 border'}>
          <Space className={'mb-4'}>
            <h2 className="text-xl font-bold">Results</h2>
            <Button onClick={exportToExcel} icon={<DownloadOutlined />} />
          </Space>
          {result.result === 0 && (
            <div>
              <div className={'mb-2 text-lg'}>
                Based on inputs,{' '}
                <span className="text-green-600 font-bold bg-amber-200 p-1 rounded">
                  {result?.detail?.completed_students?.length || 0}
                </span>{' '}
                out of{' '}
                <span className="text-red-600 font-bold">
                  {(result?.detail?.completed_students?.length || 0) +
                    (result?.detail?.not_completed_students?.length || 0)}
                </span>{' '}
                students have posted replies according to requirements.
              </div>

              <div className={'w-full flex gap-4 justify-between'}>
                <div className={'flex-1'}>
                  <h3 className="text-lg font-bold mb-2">Completed Students</h3>
                  <div>
                    Below table shows the{' '}
                    <span className="text-green-600 font-bold">
                      {result?.detail?.completed_students?.length}
                    </span>{' '}
                    students who have completed.
                  </div>
                  <Table
                    scroll={{ y: 'calc(100vh - 400px)', x: 300 }}
                    dataSource={result?.detail?.completed_students || []}
                    columns={columns}
                    rowKey="completed_students"
                    pagination={false}
                  />
                </div>
                <div className={'flex-1'}>
                  <h3 className="text-lg font-bold mb-2">
                    Not Completed Students
                  </h3>
                  <div>
                    Below table shows the{' '}
                    <span className="text-red-600 font-bold">
                      {result?.detail?.not_completed_students?.length}
                    </span>{' '}
                    students who have not completed.
                  </div>
                  <Table
                    scroll={{ y: 'calc(100vh - 400px)', x: 300 }}
                    dataSource={result?.detail?.not_completed_students || []}
                    columns={columns}
                    rowKey="not_completed_students"
                    pagination={false}
                  />
                </div>
              </div>
            </div>
          )}
          {[1, 2].includes(result.result) && (
            <p className="text-red-600">{result.reason}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckAssignment;
