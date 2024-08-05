import { useEffect, useState } from "react";
import { Table } from "antd";
import { getAllReadData } from "../../api.ts";

const ReadData = () => {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    getAllReadData().then((d) => setRecords(d));
  }, []);
  const columns = Object.keys(records[0] || {}).map((r, idx) => ({
    key: idx,
    dataIndex: r,
    title: r,
  }));

  return <Table scroll={{ x: 1300 }} columns={columns} dataSource={records} />;
};

export default ReadData;
