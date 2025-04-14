import React, { useEffect, useRef } from 'react';
import { Network, Edge, Node } from 'vis-network';
import { DataSet } from 'vis-network/standalone';
import { Empty, Spin, Typography, Button, Tooltip } from 'antd';
import { isEmpty } from 'lodash-es';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';

const { Paragraph } = Typography;

interface IdeaNode extends Node {
  id: number;
  label: string;
  title?: string;
  group?: string;
}

interface IdeaEdge extends Edge {
  from: number;
  to: number;
  arrows?: string;
  title?: string;
}

interface IdeaTrajectoryProps {
  loading?: boolean;
  data?: {
    nodes: IdeaNode[];
    edges: IdeaEdge[];
  };
}

const mockData = {
  nodes: [
    { id: 1, label: 'Initial Idea', group: 'concept' },
    { id: 2, label: 'Development', group: 'process' },
    { id: 3, label: 'Refinement', group: 'process' },
    { id: 4, label: 'Final Concept', group: 'concept' }
  ],
  edges: [
    { from: 1, to: 2, arrows: 'to', title: 'Develops into' },
    { from: 2, to: 3, arrows: 'to', title: 'Refines to' },
    { from: 3, to: 4, arrows: 'to', title: 'Finalizes as' }
  ]
};

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
      background: '#ffffff',
      border: '#ffffff',
      highlight: {
        border: '#648fc9',
        background: '#ffffff'
      },
      hover: {
        border: '#648fc9'
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
    }
  },
  edges: {
    selectionWidth: 2,
    color: {
      color: '#A9A9A9',
      highlight: '#648fc9',
      hover: '#648fc9',
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
    tooltipDelay: 200
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

const IdeaTrajectory: React.FC<IdeaTrajectoryProps> = ({
  loading = false,
  data = mockData
}) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    const nodes = new DataSet<IdeaNode>(data.nodes);
    const edges = new DataSet<IdeaEdge>(data.edges);

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
  }, [data]);

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isEmpty(data?.nodes) && isEmpty(data?.edges)) {
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
