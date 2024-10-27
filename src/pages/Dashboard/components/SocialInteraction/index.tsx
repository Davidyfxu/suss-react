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
import { Spin } from 'antd';

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

  useEffect(() => {
    if (chartRef.current) {
      myChartRef.current = echarts.init(chartRef.current);
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
            layout: 'force', // 使用力导向布局
            symbolSize: 50,
            roam: true,
            label: {
              show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              fontSize: 20
            },
            data: rawData.nodes.map((node, index) => ({
              name: node,
              category: index % 2 === 0 ? 'Topic Poster' : 'Discussion Student', // 根据索引分配类别
              itemStyle: {
                color: index % 2 === 0 ? '#5470C6' : '#EE6666'
              }
            })),
            links: rawData.edges.map((edge) => ({
              source: edge.source,
              target: edge.target,
              label: {
                show: true,
                formatter: edge.weight.toString()
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
            force: {
              repulsion: 100,
              gravity: 0.03,
              edgeLength: [100, 200] // 调整边的长度范围
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
  }, [rawData]);

  const handleResize = useCallback(() => {
    if (myChartRef.current) {
      myChartRef.current.resize();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <Spin
      spinning={loading}
      className={'flex justify-center items-center w-full h-full'}
    >
      <div
        ref={chartRef}
        style={{
          minWidth: 500,
          width: '100%', // 可以调整宽度
          height: '500px',
          margin: '0 auto' // 自动水平居中
        }}
      />
    </Spin>
  );
};

export default SocialGraph;
