import React, { useEffect, useRef, useState } from 'react';
import { Network, Edge, Node } from 'vis-network';
import { DataSet } from 'vis-network/standalone';
import { Empty, Spin, Typography, Button, Tooltip } from 'antd';
import { isEmpty } from 'lodash-es';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { draw_idea_trajectory } from '../../api';
import { useUserStore } from '../../../../stores/userStore';

const { Paragraph } = Typography;

interface IdeaNode extends Node {
  id: number;
  label: string;
  title?: string;
  type?: string;
  shape?: string;
}

interface IdeaEdge extends Edge {
  from: number;
  to: number;
}

interface IdeaTrajectoryProps {
  loading?: boolean;
  data?: {
    nodes: IdeaNode[];
    edges: IdeaEdge[];
  };
}

const options = {
  nodes: {
    borderWidthSelected: 5,
    font: {
      size: 10,
      face: 'Tahoma',
      color: '#333333',
      strokeWidth: 2,
      strokeColor: '#ffffff'
    },
    color: {
      background: '#97c2fc', // 节点背景色
      border: '#648fc9', // 节点边框色
      highlight: {
        border: '#648fc9', // 选中时的边框色
        background: '#97c2fc'
      },
      hover: {
        border: '#648fc9', // 悬停时的边框色
        background: '#b3d4fc' // 悬停时的背景色
      }
    },
    shape: 'dot',
    scaling: {
      min: 10,
      max: 30,
      label: {
        enabled: true,
        min: 8,
        max: 16,
        drawThreshold: 1,
        maxVisible: 30
      }
    },
    size: 20, // 默认节点大小
    shadow: {
      enabled: true,
      color: 'rgba(0,0,0,0.1)',
      size: 10,
      x: 0,
      y: 0
    }
  },
  edges: {
    selectionWidth: 2,
    color: {
      color: '#A9A9A9',
      highlight: '#648fc9', // 选中时的边颜色
      hover: '#648fc9', // 悬停时的边颜色
      opacity: 0.7
    },
    smooth: {
      enabled: true,
      type: 'continuous',
      forceDirection: 'none',
      roundness: 0.5
    },
    scaling: {
      min: 1,
      max: 8
    }
  },
  interaction: {
    hover: true,
    tooltipDelay: 200,
    tooltipStyle: {
      backgroundColor: 'white',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      padding: '12px',
      maxWidth: '300px'
    },
    hoverConnectedEdges: true, // 悬停时高亮相连的边
    multiselect: true, // 允许多选
    zoomView: true, // 允许缩放
    dragView: true // 允许拖动
  },
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -26,
      centralGravity: 0.005,
      springLength: 230,
      springConstant: 0.18
    },
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 25
    }
  }
};

const IdeaTrajectory: React.FC<IdeaTrajectoryProps> = ({ loading = false }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<Network | null>(null);
  const courseCode = useUserStore((state) => state.courseCode);
  const [apiData, setApiData] = useState<{
    nodes: IdeaNode[];
    edges: IdeaEdge[];
  } | null>(null);
  const fetchData = async () => {
    try {
      const params = {
        option_course: courseCode
      };
      const response = await draw_idea_trajectory(params);
      setApiData(response);
    } catch (error) {
      console.error('Error fetching idea trajectory data:', error);
    }
  };
  useEffect(() => {
    courseCode && fetchData();
  }, [courseCode]);

  useEffect(() => {
    if (!networkRef.current) return;

    const nodes = new DataSet<IdeaNode>(apiData?.nodes || []);
    const edges = new DataSet<IdeaEdge>(apiData?.edges || []);

    networkInstanceRef.current = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.destroy();
        networkInstanceRef.current = null;
      }
    };
  }, [apiData]);

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isEmpty(apiData?.nodes) && isEmpty(apiData?.edges)) {
    return (
      <Empty
        className="flex-1 flex justify-center items-center flex-col h-full w-full"
        description="No idea trajectory data available."
      />
    );
  }

  return (
    <div
      className={clsx('flex-1 space-y-2 bg-white flex flex-col')}
      style={{ minHeight: 'calc(100vh - 160px)' }}
    >
      <div>
        <Paragraph
          ellipsis={{
            rows: 1,
            expandable: 'collapsible'
          }}
          copyable
          className={'!mb-0'}
        >
          Idea Trajectory visualization shows how ideas evolve and connect over
          time in the discussion forum. Each node represents an idea or concept,
          and the connections show how ideas develop and relate to each other.
        </Paragraph>
        <Button
          className={'mr-2'}
          onClick={() =>
            window.open('https://en.wikipedia.org/wiki/Idea_trajectory')
          }
          icon={<InfoCircleOutlined />}
        >
          Know more about Idea Trajectory!
        </Button>
        <Tooltip
          placement="topLeft"
          title={
            <ol className="list-decimal list-inside space-y-1">
              <li className="transition-all duration-200 hover:translate-x-1 pl-2">
                Each node represents an idea or concept
              </li>
              <li className="transition-all duration-200 hover:translate-x-1 pl-2">
                The arrows show how ideas develop and connect
              </li>
              <li className="transition-all duration-200 hover:translate-x-1 pl-2">
                Hover over nodes and edges to see more details
              </li>
              <li className="transition-all duration-200 hover:translate-x-1 pl-2">
                Drag nodes to rearrange the visualization
              </li>
            </ol>
          }
        >
          <Button icon={<QuestionCircleOutlined />}>Instructions</Button>
        </Tooltip>
      </div>

      <div className="flex-1 bg-white rounded-xl p-2 border border-gray-100">
        <div ref={networkRef} className="h-[600px]" />
      </div>
    </div>
  );
};

export default IdeaTrajectory;
