import React from 'react';
import { Divider, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface NetworkData {
  source: string;
  target: string;
  weight: number;
}

interface NetworkTableProps {
  data: {
    nodes: string[];
    edges: NetworkData[];
  };
}

const SocialTable: React.FC<NetworkTableProps> = ({ data }) => {
  const columns: ColumnsType<NetworkData> = [
    {
      title: 'Source User',
      dataIndex: 'source',
      key: 'source',
      width: '33%'
    },
    {
      title: 'Target User',
      dataIndex: 'target',
      key: 'target',
      width: '33%'
    },
    {
      title: 'Interaction Weight',
      dataIndex: 'weight',
      key: 'weight',
      width: '33%',
      render: (weight: number) => weight?.toFixed(1) || '-',
      sorter: (a, b) => (a.weight || 0) - (b.weight || 0)
    }
  ];

  return (
    <>
      <Divider>Social Network Summary</Divider>

      <Table
        columns={columns}
        dataSource={(data?.edges || []).map((edge, index) => ({
          ...edge,
          key: index
        }))}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true
        }}
        size="middle"
        bordered
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row className="font-bold">
              <Table.Summary.Cell index={0} colSpan={2}>
                Total Nodes
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {data?.nodes?.length || 0}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row className="font-bold">
              <Table.Summary.Cell index={0} colSpan={2}>
                Total Edges
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                {data?.edges?.length || 0}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </>
  );
};

export default SocialTable;
