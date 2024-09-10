import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';
import { GraphChart, GraphSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { useUserStore } from '../../../../stores/userStore';
import { draw_network } from '../../api.ts';
import { Spin } from 'antd';

// Register the components with ECharts
echarts.use([TitleComponent, TooltipComponent, GraphChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  TitleComponentOption | TooltipComponentOption | GraphSeriesOption
>;

const BasicGraph: React.FC = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [loading, setLoading] = useState(false);
  const [rawData, setData] = useState({});
  const chartRef = useRef<HTMLDivElement>(null);
  const myChartRef = useRef<echarts.ECharts | null>(null);

  const getNetwork = async () => {
    try {
      setLoading(true);
      const res = await draw_network({ option_course: courseCode });
      setData(res);
    } catch (err) {
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
          text: 'Basic Graph'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
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
            data: (rawData?.nodes || []).map((node: string) => ({
              name: node,
              x: Math.random() * 100,
              y: Math.random() * 100
            })),
            links: (rawData?.edges || []).map((edge) => ({
              source: edge?.source,
              target: edge?.target,
              label: edge?.weight
            })),
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0
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
          width: '100%', // 可以调整宽度
          height: '400px',
          margin: '0 auto' // 自动水平居中
        }}
      />
    </Spin>
  );
};

export default BasicGraph;
