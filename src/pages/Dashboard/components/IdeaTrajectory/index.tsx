import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-network/standalone';
import { Empty, Spin } from 'antd';
import { isEmpty } from 'lodash-es';

interface IdeaNode {
  id: number;
  label: string;
  title?: string;
  group?: string;
}

interface IdeaEdge {
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
    { id: 4, label: 'Final Concept', group: 'concept' },
  ],
  edges: [
    { from: 1, to: 2, arrows: 'to', title: 'Develops into' },
    { from: 2, to: 3, arrows: 'to', title: 'Refines to' },
    { from: 3, to: 4, arrows: 'to', title: 'Finalizes as' },
  ],
};

const options = {
//   configure: {
//     enabled: true,
//   },
  nodes: {
    borderWidthSelected: 5,
    font: {
      size: 10,
    },
    color: {
      background: 'rgba(255,0,0,0)',
      highlight: {
        border: 'rgb(255,0,0)',
        background: 'rgb(255,0,0)',
      },
    },
  },
  edges: {
    selectionWidth: 2,
    color: {
      inherit: true,
    },
    smooth: {
      enabled: true,
      type: 'dynamic',
    },
  },
  interaction: {
    hover: true,
    dragNodes: true,
    hideEdgesOnDrag: false,
    hideNodesOnDrag: false,
  },
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based',
    repulsion: {
      springLength: 500,
      nodeDistance: 100,
    },
    stabilization: {
      enabled: true,
      fit: true,
      iterations: 1000,
      onlyDynamicEdges: false,
      updateInterval: 50,
    },
  },
};

const IdeaTrajectory: React.FC<IdeaTrajectoryProps> = ({ loading = false, data = mockData }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    const nodes = new DataSet(data.nodes);
    const edges = new DataSet(data.edges);

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
    <div className="flex-1 h-full min-h-[400px]">
      <div ref={networkRef} className="h-[450px]" />
    </div>
  );
};

export default IdeaTrajectory;