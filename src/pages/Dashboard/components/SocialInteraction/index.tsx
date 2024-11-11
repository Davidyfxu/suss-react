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
        rawData.edges.map((edge) => ({
          from: edge.source,
          to: edge.target,
          value: edge.weight,
          title: `Weight: ${edge.weight}`,
          arrows: 'to',
          width: edge.weight * 2
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
              min: 8,
              max: 30,
              drawThreshold: 12,
              maxVisible: 20
            }
          },
          font: {
            size: 12,
            face: 'Tahoma'
          }
        },
        edges: {
          width: 0.15,
          color: { inherit: 'from' },
          smooth: {
            type: 'continuous'
          }
        },
        physics: {
          stabilization: false,
          barnesHut: {
            gravitationalConstant: -80000,
            springConstant: 0.001,
            springLength: 200
          }
        },
        groups: {
          with_threads: { color: '#5470C6' },
          only_replied: { color: '#EE6666' },
          unknown: { color: '#91CC75' }
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
