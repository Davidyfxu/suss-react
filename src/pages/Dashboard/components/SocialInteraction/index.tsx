import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import { useUserStore } from '../../../../stores/userStore';
import { draw_network } from '../../api.ts';
import { Segmented, Spin } from 'antd';
import { debounce } from 'lodash-es';
import SocialTable from './SocialTable.tsx';
import { NodeIndexOutlined, TableOutlined } from '@ant-design/icons';

const SocialGraph: React.FC = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [loading, setLoading] = useState(false);
  const [rawData, setData] = useState<{
    nodes: string[];
    edges: { source: string; target: string; weight: number }[];
  }>({ nodes: [], edges: [] });
  const networkRef = useRef<HTMLDivElement>(null);
  const network = useRef<Network | null>(null);
  const [showType, setShowType] = useState<string>('graph');

  const getNetwork = async () => {
    try {
      setLoading(true);
      const res = await draw_network({ option_course: courseCode });
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    courseCode && getNetwork();
  }, [courseCode]);

  const initNetwork = useCallback(() => {
    if (networkRef.current) {
      // 获取所有边的权重
      const weights = rawData.edges.map((edge) => edge.weight);
      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);

      // 归一化函数：将权重映射到指定范围（例如 1-8）
      const normalizeWeight = (weight: number) => {
        if (maxWeight === minWeight) return 1;
        return 1 + ((weight - minWeight) / (maxWeight - minWeight)) * 7;
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
        (rawData?.edges || []).map((edge) => ({
          from: edge.source,
          to: edge.target,
          value: edge.weight,
          title: `Weight: ${edge.weight}`,
          arrows: 'to',
          width: normalizeWeight(edge.weight)
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
          label: {
            enabled: true // 确保标签显示
          }
        },
        edges: {
          smooth: {
            type: 'continuous',
            forceDirection: 'none'
          },
          color: {
            color: '#848484',
            highlight: '#848484',
            hover: '#848484',
            opacity: 0.5
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
          with_threads: { color: '#5470C6' },
          only_replied: { color: '#EE6666' },
          unknown: { color: '#91CC75' }
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
    if (showType === 'graph') {
      setTimeout(() => {
        initNetwork();
      }, 0);
    }

    return () => {
      if (network.current) {
        network.current.destroy();
        network.current = null;
      }
    };
  }, [showType, rawData, initNetwork]);

  const handleResize = useCallback(
    debounce(() => {
      if (network.current && showType === 'graph') {
        network.current.fit();
      }
    }, 300),
    [showType]
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      handleResize?.cancel?.();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, courseCode]);

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <Segmented
          options={[
            {
              label: 'Graph',
              value: 'graph',
              icon: <NodeIndexOutlined />
            },
            { label: 'Table', value: 'table', icon: <TableOutlined /> }
          ]}
          value={showType}
          onChange={(value) => {
            setShowType(value);
          }}
        />
      </div>

      <Spin
        spinning={loading}
        className={'flex justify-center items-center w-full h-full'}
      >
        {showType === 'graph' ? (
          <div
            ref={networkRef}
            className={'rounded-lg border'}
            style={{
              padding: 16,
              minWidth: 500,
              width: '100%',
              height: '750px'
            }}
          />
        ) : (
          <SocialTable data={rawData} />
        )}
      </Spin>
    </div>
  );
};

export default SocialGraph;
