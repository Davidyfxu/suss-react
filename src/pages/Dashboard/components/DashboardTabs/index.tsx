import { Tabs } from "antd";
import { useEffect } from "react";
import { getAllReadData } from "../../api.ts";
import DiscussionData from "../DiscussionData";
import ReadData from "../ReadData";

const DASHBOARD_TABS = [
  {
    label: "discussion_data",
    key: "discussion_data",
    children: <DiscussionData />,
  },
  {
    label: "read_data",
    key: "read_data",
    children: <ReadData />,
  },
  {
    label: "others",
    key: "others",
    children: <div>others</div>,
  },
];

const DashboardTabs = () => {
  return <Tabs defaultActiveKey="1" centered items={DASHBOARD_TABS} />;
};

export default DashboardTabs;
