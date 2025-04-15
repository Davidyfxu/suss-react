import React, { useEffect, useRef, useState } from 'react';
import { Network, Edge, Node } from 'vis-network';
import { DataSet } from 'vis-network/standalone';
import { Spin, Typography, Button, Tooltip } from 'antd';
import { isNumber } from 'lodash-es';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import { draw_idea_trajectory } from '../../api';
import { useUserStore } from '../../../../stores/userStore';
import parse from 'html-react-parser';
import SelectSUSS from '../../../../components/SelectSUSS';

const { Paragraph } = Typography;

interface IdeaNode extends Node {
  id: number;
  label: string;
  hoverContent?: string;
  type?: string;
  shape?: string;
}

interface IdeaEdge extends Edge {
  from: number;
  to: number;
}

interface IdeaTrajectoryProps {}
const IdeaTrajectory: React.FC<IdeaTrajectoryProps> = () => {
  const [loading, setLoading] = useState(false);
  const [hoverNode, setHoverNode] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const networkInstanceRef = useRef<Network | null>(null);
  const courseCode = useUserStore((state) => state.courseCode);
  const [apiData, setApiData] = useState<{
    nodes: IdeaNode[];
    edges: IdeaEdge[];
  } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        option_course: courseCode,
        topic_title: topic
      };
      const response = await draw_idea_trajectory(params);
      setApiData(response);
    } catch (error) {
      console.error('Error fetching idea trajectory data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && fetchData();
  }, [topic, courseCode]);

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
        background: '#97c2fc',
        border: '#648fc9',
        highlight: {
          border: '#648fc9',
          background: '#97c2fc'
        },
        hover: {
          border: '#648fc9',
          background: '#b3d4fc'
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
      size: 20
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
      },
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5,
          type: 'arrow'
        }
      }
    },
    interaction: {
      hover: true,
      dragNodes: true,
      hideEdgesOnDrag: false,
      hideNodesOnDrag: false
    },
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
      repulsion: {
        springLength: 500,
        nodeDistance: 100
      },
      stabilization: {
        enabled: true,
        fit: true,
        iterations: 1000,
        onlyDynamicEdges: false,
        updateInterval: 50
      }
    }
  };

  useEffect(() => {
    if (!networkRef.current) return;

    const nodes = new DataSet<IdeaNode>(apiData?.nodes || []);
    const edges = new DataSet<IdeaEdge>(apiData?.edges || []);

    networkInstanceRef.current = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    // 监听节点悬停事件
    networkInstanceRef.current.on('hoverNode', function (params) {
      setHoverNode(params.node);
    });

    // 监听节点失去悬停事件
    networkInstanceRef.current.on('blurNode', function (params) {
      if (params.node !== selectedNode) {
        setHoverNode(null);
      }
    });

    // // 监听节点选中事件
    networkInstanceRef.current.on('selectNode', function (params) {
      if (params.nodes.length > 0) {
        setSelectedNode(params.nodes[0]);
      } else {
        setSelectedNode(null);
      }
    });

    // // 监听取消选中事件
    networkInstanceRef.current.on('deselectNode', function () {
      setSelectedNode(null);
    });

    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.destroy();
        networkInstanceRef.current = null;
      }
    };
  }, [apiData]);

  const showNodeContent = isNumber(hoverNode) || isNumber(selectedNode);
  const displayNode = selectedNode || hoverNode;

  return (
    <div
      className={clsx('flex-1 space-y-2 bg-white flex flex-col relative')}
      style={{ minHeight: 'calc(100vh - 160px)' }}
    >
      <div>
        <SelectSUSS
          allowClear
          placeholder={'Please select a topic from the course.'}
          className={'w-full mt-2'}
          handleSelect={(v) => {
            setTopic(v);
            setHoverNode(null);
            setSelectedNode(null);
          }}
          value={topic}
        />
        {showNodeContent && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-80 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-10">
            <div className="flex flex-col mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#97c2fc' }}
                />
                <Typography.Text strong>
                  {
                    apiData?.nodes
                      ?.find?.((n) => n?.id === displayNode)
                      ?.label?.split('\n')[0]
                  }
                </Typography.Text>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg max-h-[calc(100vh-200px)] overflow-y-auto">
              <Typography.Paragraph>
                {parse(
                  (
                    apiData?.nodes?.find?.((n) => n?.id === displayNode)
                      ?.hoverContent || ''
                  ).trim()
                )}
              </Typography.Paragraph>
            </div>
          </div>
        )}
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

      <Spin
        size="large"
        spinning={loading}
        className="flex-1 rounded-xl p-2 border border-gray-100"
      >
        <div ref={networkRef} className="h-[550px]" />
      </Spin>
    </div>
  );
};

export default IdeaTrajectory;
