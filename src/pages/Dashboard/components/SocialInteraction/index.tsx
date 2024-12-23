import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import { useUserStore } from '../../../../stores/userStore';
import { draw_network } from '../../api.ts';
import { Alert, Button, Empty, Spin, Typography } from 'antd';
import { debounce, isEmpty, round } from 'lodash-es';
import { InfoCircleOutlined } from '@ant-design/icons';
import { SelectSUSS } from '../../../../components';

const { Title, Paragraph } = Typography;

const SocialGraph: React.FC = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState<string>('');
  const [density, setDensity] = useState<number>(0);
  const [clustering, setClustering] = useState<number>(0);
  const [rawData, setData] = useState<{
    nodes: Array<{ id: string; user_type: string; centrality: number }>;
    edges: Array<{ source: string; target: string; weight: number }>;
  }>({ nodes: [], edges: [] });
  const networkRef = useRef<HTMLDivElement>(null);
  const network = useRef<Network | null>(null);

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
      setClustering(res?.clustering || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && getNetwork();
  }, [courseCode, topic, dateRange]);

  useEffect(() => {
    setTopic('');
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
          title: `${node.id} Centrality: ${node.centrality}`
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
      const options = {
        nodes: {
          shape: 'dot',
          scaling: {
            min: 10,
            max: 30,
            label: {
              enabled: true, // 确保标签启用
              min: 8,
              max: 16,
              drawThreshold: 1,
              maxVisible: 30
            }
          },
          font: {
            size: 10, // 减小默认字体大小
            face: 'Tahoma',
            color: '#333333', // 添加字体颜色使其更清晰
            strokeWidth: 2, // 添加描边宽度使文字更清晰
            strokeColor: '#ffffff' // 添加白色描边使文字在任何背景下都清晰可见
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
            forceDirection: 'none'
          },
          color: {
            color: '#A9A9A9',
            highlight: '#648fc9', // 选中时的边颜色
            hover: '#648fc9', // 悬停时的边颜色
            opacity: 0.7
          },
          scaling: {
            min: 1,
            max: 8
          },
          selectionWidth: 2,
          hoverWidth: 2
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
          tooltipDelay: 200
        }
      };

      // 创建网络
      if (network.current) {
        network.current.destroy();
      }
      network.current = new Network(networkRef.current, data, options);
    }
  }, [rawData]);

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
  }, [rawData, initNetwork]);

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

  function renderSocialNetwork() {
    if (loading)
      return (
        <div className="h-full flex items-center justify-center">
          <Spin size="large" />
        </div>
      );

    if (isEmpty(rawData?.edges) && isEmpty(rawData?.edges)) {
      return (
        <Empty
          className={
            'bg-gray-50 flex justify-center items-center flex-col h-full w-full'
          }
          description={'No data available.'}
        />
      );
    }

    return (
      <div className="h-full flex flex-col">
        {topic && (
          <div className="text-sm text-gray-600 mb-4 flex flex-col gap-2">
            <span className="font-medium">
              The interactivity (network density) of selected topic is:{' '}
              {round(density, 3)}
            </span>
            <span className="text-xs text-gray-500">
              Higher interactivity score indicates the discussion is more
              interactive.
            </span>
            <br />
            <span className="font-medium">
              The Clustering Coefficient of selected topic is:{' '}
              {round(clustering, 3)}
            </span>
            <span className="text-xs text-gray-500">
              Higher clustering implies more tightly connected discussions or
              communities.
            </span>
          </div>
        )}
        <div ref={networkRef} className="flex-1 max-h-[500px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-sm">
      {/* Title and Description Section */}
      <div className="space-y-4">
        <Title level={5}>
          Social Interaction (Social Network Analysis Graph)
        </Title>
        <Paragraph
          ellipsis={{
            rows: 2,
            expandable: 'collapsible'
          }}
          copyable
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
          onClick={() =>
            window.open(
              'https://visiblenetworklabs.com/guides/social-network-analysis-101/'
            )
          }
          icon={<InfoCircleOutlined />}
        >
          Know more about Social Network Analysis!
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Controls and Instructions */}
        <div className="w-full lg:w-96 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Please select the topic title here
            </label>
            <SelectSUSS
              handleSelect={(v) => setTopic(v)}
              allowClear
              value={topic}
              className="w-full"
              placeholder="Select topic title"
            />
          </div>
          <Alert
            showIcon
            message="Instructions"
            description={
              <ol className="list-decimal list-inside space-y-2">
                <li className="transition-all duration-200 hover:translate-x-1">
                  Select a topic title from above selection box.
                </li>
                <li className="transition-all duration-200 hover:translate-x-1">
                  Each node represents a user, and node size represents the
                  importance (in-degree centrality) of the node.
                </li>
                <li className="transition-all duration-200 hover:translate-x-1">
                  Each line with an arrow (called edge) represents the
                  connection. Edge arrow direction means replying to, and edge
                  thickness represents interaction level between two users.
                </li>
                <li className="transition-all duration-200 hover:translate-x-1">
                  Hover over the edge to see the exact edge thickness value.
                </li>
              </ol>
            }
            type="info"
          />
        </div>
        {/* Right Panel - Network Graph */}
        <div className="flex-1 bg-gray-50 rounded-xl shadow-inner p-6 min-h-[600px] border border-gray-100">
          {renderSocialNetwork()}
        </div>
      </div>
    </div>
  );
};

export default SocialGraph;
