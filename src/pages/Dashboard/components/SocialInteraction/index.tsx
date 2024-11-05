import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption
} from 'echarts/components';
import { GraphChart, GraphSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { useUserStore } from '../../../../stores/userStore';
import { draw_network } from '../../api.ts';
import { Segmented, Spin } from 'antd';
import { debounce } from 'lodash-es';
import SocialTable from './SocialTable.tsx';
import { NodeIndexOutlined, TableOutlined } from '@ant-design/icons';

// Register the components with ECharts
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | GraphSeriesOption
>;

const SocialGraph: React.FC = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [loading, setLoading] = useState(false);
  const [rawData, setData] = useState<{
    nodes: string[];
    edges: { source: string; target: string; weight: number }[];
  }>({ nodes: [], edges: [] });
  const chartRef = useRef<HTMLDivElement>(null);
  const myChartRef = useRef<echarts.ECharts | null>(null);
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

  const initChart = useCallback(() => {
    if (chartRef.current) {
      // 如果已经存在实例，先销毁它
      if (myChartRef.current) {
        myChartRef.current.dispose();
      }
      const container = chartRef.current;
      const width = container?.clientWidth || window.innerWidth - 248;
      const height = container?.clientHeight || 500;
      myChartRef.current = echarts.init(chartRef.current, null, {
        width,
        height
      });
      const option: EChartsOption = {
        title: {
          text: 'Social Interaction Graph'
        },
        tooltip: {},
        legend: {
          data: ['Discussion Student', 'Topic Poster']
        },

        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            name: 'Social Graph',
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 10, // 更大的斥力
              gravity: 0.05, // 更小的向心力
              edgeLength: 50 // 更长的边长
            },
            symbolSize: 16,
            roam: true,
            label: {
              show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [2, 5],
            edgeLabel: {
              fontSize: 10
            },
            data: rawData.nodes.map((node, index) => ({
              name: node,
              category: index % 2 === 0 ? 'Topic Poster' : 'Discussion Student', // 根据索引分配类别
              label: {
                show: index % 2 === 0, // 只有 Topic Poster 显示标签
                position: 'right'
              },
              itemStyle: {
                color: index % 2 === 0 ? '#5470C6' : '#EE6666'
              }
            })),
            links: rawData.edges.map((edge) => ({
              source: edge.source,
              target: edge.target,
              value: edge.weight,
              label: {
                show: false
              },
              lineStyle: {
                color:
                  rawData.nodes.indexOf(edge.source) % 2 === 0
                    ? '#5470C6'
                    : '#EE6666'
              }
            })),
            categories: [
              {
                name: 'Topic Poster',
                itemStyle: {
                  color: '#EE6666'
                }
              },
              {
                name: 'Discussion Student',
                itemStyle: {
                  color: '#5470C6'
                }
              }
            ],
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 6
              },
              label: {
                fontSize: 12
              }
            }
          }
        ]
      };

      // Set the option for the chart
      myChartRef.current.setOption(option);
    }
    // Cleanup on component unmount
    return () => {
      myChartRef.current?.dispose();
    };
  }, [rawData, courseCode]);

  useEffect(() => {
    if (showType === 'graph') {
      // 确保在下一个渲染周期初始化图表
      setTimeout(() => {
        initChart();
      }, 0);
    }

    return () => {
      if (myChartRef.current) {
        myChartRef.current.dispose();
        myChartRef.current = null;
      }
    };
  }, [showType, rawData, initChart]);

  const handleResize = useCallback(
    debounce(() => {
      if (myChartRef.current && showType === 'graph') {
        const container = chartRef.current;
        const width = container?.clientWidth || window.innerWidth - 300;
        const height = container?.clientHeight || 500;

        myChartRef.current.resize({ width, height });
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
            ref={chartRef}
            className={'rounded-lg border'}
            style={{
              padding: 16,
              minWidth: 500,
              width: '100%', // 可以调整宽度
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
