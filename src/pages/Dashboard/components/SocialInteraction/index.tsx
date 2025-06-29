import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import { useUserStore } from '../../../../stores/userStore';
import { draw_network } from '../../api.ts';
import { Button, Empty, Spin, Typography, Tooltip } from 'antd';
import { debounce, isEmpty, round } from 'lodash-es';
import {
  InfoCircleOutlined,
  QuestionCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';
import clsx from 'clsx';
import { SelectSUSS } from '../../../../components';
import screenfull from 'screenfull';
import { Options } from 'vis-network';
import {
  canZoomView,
  highlightNodesEdges,
  resetNodesColor
} from '../../../../utils/networkUtils.ts';

const { Paragraph } = Typography;

const SocialGraph: React.FC = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);
  const [density, setDensity] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rawData, setData] = useState<{
    nodes: Array<{ id: string; user_type: string; centrality: number }>;
    edges: Array<{ source: string; target: string; weight: number }>;
  }>({ nodes: [], edges: [] });
  const networkRef = useRef<HTMLDivElement>(null);
  const network = useRef<Network | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getNetwork = async () => {
    try {
      setLoading(true);
      const res = await draw_network({
        option_course: courseCode,
        active_topic: topic,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1]
      });
      setData(res);
      setDensity(res?.density || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && getNetwork();
  }, [courseCode, topic, dateRange?.[0], dateRange?.[1]]);

  useEffect(() => {
    setTopic(null);
  }, [courseCode]);

  const initNetwork = useCallback(() => {
    if (networkRef.current) {
      // 获取所有边的权重
      const weights = rawData.edges.map((edge) => edge.weight);
      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);

      // 归一化函数：将权重映射到指定范围（例如 1-8）
      const normalizeWidth = (weight: number) => {
        if (weight === 1) return 1; // 当 weight 为 1 时返回最小宽度
        if (maxWeight === minWeight) return 2;
        return 1 + ((weight - minWeight) / (maxWeight - minWeight)) * 5; // 减小最大宽度范围
      };
      // 创建节点和边的数据集
      const nodes = new DataSet(
        rawData.nodes.map((node) => ({
          id: node.id,
          label: node.id,
          value: node.centrality,
          group: node.user_type,
          size: Math.sqrt(node.centrality) * 10,
          title: `${node.id} Centrality: ${round(node.centrality, 2)}`
        }))
      );

      const edges = new DataSet(
        (rawData?.edges || []).map((edge, idx) => ({
          id: idx,
          from: edge.source,
          to: edge.target,
          value: edge.weight,
          title: `Weight: ${1 + Math.round((edge.weight - 1) / 0.2)}`,
          arrows: 'to',
          width: normalizeWidth(edge.weight)
        }))
      );

      const data = { nodes, edges };
      // 配置选项
      const options: Options = {
        height: '100%',
        width: '100%',
        // configure: true,
        nodes: {
          shape: 'dot',
          scaling: {
            min: 10,
            max: 30,
            label: {
              enabled: true, // 确保标签启用
              min: isFullscreen ? 36 : 30,
              max: isFullscreen ? 44 : 38,
              drawThreshold: 1,
              maxVisible: 30
            }
          },
          font: {
            size: isFullscreen ? 40 : 34, // 减小默认字体大小
            face: 'Tahoma',
            color: '#333333' // 添加字体颜色使其更清晰
            // strokeWidth: 2, // 添加描边宽度使文字更清晰
            // strokeColor: '#ffffff' // 添加白色描边使文字在任何背景下都清晰可见
          },
          // label: {
          //   enabled: true // 确保标签显示
          // },
          color: {
            background: '#ffffff', // 节点背景色
            border: '#ffffff', // 节点边框色
            highlight: {
              border: '#648fc9' // 选中时的边框色
            },
            hover: {
              border: '#648fc9' // 悬停时的边框色
            }
          }
        },
        edges: {
          smooth: {
            type: 'continuous',
            forceDirection: 'none',
            enabled: true,
            roundness: 0.5
          },
          color: {
            inherit: true
          },
          scaling: {
            min: 0.5,
            max: 4
          },
          selectionWidth: 1.5,
          hoverWidth: 1.5
        },
        physics: {
          enabled: true,
          solver: 'hierarchicalRepulsion',
          hierarchicalRepulsion: {
            centralGravity: 0,
            nodeDistance: 200,
            avoidOverlap: 0.3
          },
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 25
          },
          minVelocity: 0.75
        },
        groups: {
          with_threads: { color: '#97c2fc' },
          only_replied: { color: '#97c2fc' },
          // only_replied: { color: '#EE6666' },
          unknown: { color: '#97c2fc' }
          // unknown: { color: '#91CC75' }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          dragNodes: true,
          hideEdgesOnDrag: false,
          hideNodesOnDrag: false,
          zoomView: false
        }
      };

      // 创建网络
      if (network.current) {
        network.current.destroy();
      }
      network.current = new Network(networkRef.current, data, options as any);
      // 监听节点悬停事件
      network.current.on('hoverNode', function () {
        canZoomView(network);
      });
      network.current.on('selectNode', function (params) {
        canZoomView(network);
        highlightNodesEdges(network, params.nodes[0]);
      });
      network.current.on('deselectNode', function () {
        resetNodesColor(network);
      });
    }
  }, [rawData, isFullscreen]);

  useEffect(() => {
    setTimeout(() => {
      initNetwork();
    }, 0);

    return () => {
      if (network.current) {
        network.current.destroy();
        network.current = null;
      }
    };
  }, [rawData, initNetwork, isFullscreen]);

  const handleResize = useCallback(
    debounce(() => {
      if (network.current) {
        network.current.fit();
      }
    }, 300),
    []
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      handleResize?.cancel?.();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, courseCode]);

  const toggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        setIsFullscreen(screenfull.isFullscreen);
      });
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', () => {});
      }
    };
  }, []);

  function renderSocialNetwork() {
    if (loading)
      return (
        <div className="flex-1 h-full flex items-center justify-center">
          <Spin size="large" />
        </div>
      );

    if (isEmpty(rawData?.edges) && isEmpty(rawData?.edges)) {
      return (
        <Empty
          className={
            'flex-1 flex justify-center items-center flex-col h-full w-full'
          }
          description={'No data available.'}
        />
      );
    }

    return (
      <div className="flex-1 h-full min-h-[400px]">
        <div className="flex justify-between items-center">
          <Tooltip
            placement="topRight"
            title={
              'Higher interaction density indicates more interactions, vise versa.'
            }
          >
            <span
              className={clsx('font-medium', isFullscreen ? 'text-xl' : '')}
            >
              Interaction density: {round(density, 3)}{' '}
              <QuestionCircleOutlined />
            </span>
          </Tooltip>
          <Button
            icon={
              isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
            }
            type="text"
            onClick={toggleFullscreen}
          />
        </div>
        <div
          ref={networkRef}
          className={isFullscreen ? 'h-[calc(100vh-50px)]' : 'h-[450px]'}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-2 bg-white rounded-xl shadow-sm flex flex-col">
      <div className="flex justify-between items-center relative">
        <div>
          <Paragraph
            ellipsis={{
              rows: 1,
              expandable: 'collapsible'
            }}
            copyable
            className={'!mb-0'}
          >
            Social Network Analysis (SNA) is the study of social structures
            through the use of networks and graph theory. In our context, it
            reveals how individuals (or nodes) are connected within a class
            community, offering insights into learning dynamics, such as
            identifying highly connected or those who are isolated and may need
            additional support. Educators can also leverage SNA to design and
            evaluate teaching interventions.
          </Paragraph>
          <Button
            className={'mr-2'}
            onClick={() =>
              window.open(
                'https://visiblenetworklabs.com/guides/social-network-analysis-101/'
              )
            }
            icon={<InfoCircleOutlined />}
          >
            Know more about Social Network Analysis!
          </Button>
          <Tooltip
            placement="topLeft"
            title={
              <ol className="list-decimal list-inside space-y-1">
                <li className="transition-all duration-200 hover:translate-x-1 pl-2">
                  Select a topic title from above selection box.
                </li>
                <li className="transition-all duration-200 hover:translate-x-1 pl-2">
                  Each node represents a user, and node size represents the
                  importance (in-degree centrality) of the node.
                </li>
                <li className="transition-all duration-200 hover:translate-x-1 pl-2">
                  Each line with an arrow (called edge) represents the
                  connection. Edge arrow direction means replying to, and edge
                  thickness represents interaction level between two users.
                </li>
                <li className="transition-all duration-200 hover:translate-x-1 pl-2">
                  Hover over the edge to see the exact edge thickness value.
                </li>
              </ol>
            }
          >
            <Button icon={<QuestionCircleOutlined />}>Instructions</Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        {/* Left Panel - Controls and Instructions */}
        <SelectSUSS
          value={topic}
          handleSelect={(v) => setTopic(v)}
          allowClear
          className="w-full"
          placeholder="Please select a topic from the course."
        />
        {/* Right Panel - Network Graph */}
        <div
          ref={containerRef}
          className={clsx(
            'flex-1 bg-white rounded-xl p-2 border border-gray-100 relative',
            isFullscreen ? 'h-[calc(100vh-150px)]' : ''
          )}
        >
          {renderSocialNetwork()}
        </div>
      </div>
    </div>
  );
};

export default SocialGraph;
