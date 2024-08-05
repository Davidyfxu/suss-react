import React, { useEffect, useState } from "react";
import { Table, Descriptions } from "antd";
import { getAllDiscussions } from "../../api.ts";

const DiscussionData = () => {
  const [discussions, setDiscussions] = useState({});
  useEffect(() => {
    getAllDiscussions({ course_id: 101 }).then((d) => setDiscussions(d));
  }, []);
  return (
    <Descriptions
      title={"Discussion Data"}
      items={Object.entries(discussions).map(([k, v]) => ({
        key: k,
        label: k,
        children: v,
      }))}
    />
  );
};

export default DiscussionData;
