import React, { useEffect, useRef, useState } from 'react';
import { Network, Edge, Node, Options } from 'vis-network';
import { DataSet } from 'vis-network/standalone';
import { Spin, Typography, Button, Tooltip } from 'antd';
import { isNumber, set } from 'lodash-es';
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
const DEFAULT_FONT_SIZE = 10;
const LARGE_FONT_SIZE = 16;
const FONT_RATE = 1.5;
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
        option_course: courseCode
      };
      topic && set(params, 'topic_title', topic);
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

  useEffect(() => {
    setTopic(null);
  }, [courseCode]);

  const canZoomView = () =>
    networkInstanceRef.current?.setOptions?.({
      interaction: {
        zoomView: true
      }
    });

  const options: Options = {
    autoResize: true,
    configure: true,
    width: '100%',
    height: '100%',
    nodes: {
      borderWidthSelected: 5,
      font: {
        multi: 'html',
        size: DEFAULT_FONT_SIZE,
        face: 'Tahoma',
        color: 'gray',
        strokeWidth: 2,
        strokeColor: '#ffffff',
        ital: {
          size: DEFAULT_FONT_SIZE * FONT_RATE,
          color: '#648fc9'
        }
      },
      labelHighlightBold: false,
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
      selectionWidth: 1.5,
      color: {
        color: '#97c2fc',
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
      hideNodesOnDrag: false,
      zoomView: false
    },
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        springLength: 200
      },
      minVelocity: 0.75
    }
  };

  useEffect(() => {
    if (!networkRef.current) return;

    const nodes = new DataSet<IdeaNode>(
      (apiData?.nodes || []).map((n) => {
        const [title, subtitle] = n.label.split('\n');
        return {
          ...n,
          label: `<i>${title}</i>\n${subtitle || ''}`
        };
      })
    );
    const edges = new DataSet<IdeaEdge>(apiData?.edges || []);

    networkInstanceRef.current = new Network(
      networkRef.current,
      { nodes, edges },
      options
    );

    const updateNodeFont = (id: number, fontSize: number) => {
      nodes.update({
        id: id,
        font: { size: fontSize, ital: { size: fontSize * FONT_RATE } }
      });
    };

    // 监听节点悬停事件
    networkInstanceRef.current.on('hoverNode', function (params) {
      setHoverNode(params.node);
      canZoomView();
      updateNodeFont(params.node, LARGE_FONT_SIZE);
    });

    // 监听节点失去悬停事件
    networkInstanceRef.current.on('blurNode', function (params) {
      if (params.node !== selectedNode) {
        setHoverNode(null);
      }
      updateNodeFont(params.node, DEFAULT_FONT_SIZE);
    });

    // // 监听节点选中事件
    networkInstanceRef.current.on('selectNode', function (params) {
      canZoomView();
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

      <Spin size="large" spinning={loading} className="flex-1 p-2">
        <div
          ref={networkRef}
          className="h-[calc(100vh-260px)] border rounded-xl"
        />
      </Spin>
    </div>
  );
};

export default IdeaTrajectory;
