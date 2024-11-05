import { useEffect, useState, useCallback } from 'react';
import { draw_wordcloud } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import { Column, WordCloud } from '@ant-design/charts';
import { Empty, Segmented, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  BarChartOutlined,
  CloudOutlined,
  TableOutlined
} from '@ant-design/icons';
import { isEmpty } from 'lodash-es';
enum DisplayEnum {
  WordCloud = 'wordcloud',
  Bar = 'bar',
  Table = 'table'
}
const WordCloudComp = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const [words, setWords] = useState<{ value: number; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayType, setDisplayType] = useState<DisplayEnum>(
    DisplayEnum.WordCloud
  );

  const getWords = useCallback(async () => {
    try {
      setLoading(true);
      const { entry_contents = {} } = await draw_wordcloud({
        option_course: courseCode
      });
      setWords(
        Object.keys(entry_contents)
          .map((e) => ({
            text: e,
            value: (entry_contents?.[e] || 0) as number
          }))
          .sort((a, b) => b.value - a.value)
      );
    } catch (e) {
      console.error('getWords', e);
    } finally {
      setLoading(false);
    }
  }, [courseCode]);

  useEffect(() => {
    courseCode && getWords();
  }, [courseCode, getWords]);

  const columns: ColumnsType<{ text: string; value: number }> = [
    {
      title: 'Word',
      dataIndex: 'text',
      key: 'text'
    },
    {
      title: 'Frequency',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value
    }
  ];

  // 柱状图配置
  const barConfig = {
    data: words.slice(0, 30), // 只显示前30个词
    title: `Words Frequency Top ${words.slice(0, 20).length}`,
    xField: 'text',
    yField: 'value',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6
      }
    },
    xAxis: {
      label: {
        autoRotate: true
      }
    }
  };
  // 词云配置
  const wordCloudConfig = {
    width: 900,
    data: words,
    layout: { spiral: 'rectangular' },
    colorField: 'text',
    wordStyle: {
      rotation: 0, // 固定旋转角度为0，使词云更紧凑
      rotationSteps: 2, // 减少旋转步数，使词云更紧凑
      fontSize: [12, 60], // 设置字体大小范围
      padding: 2 // 设置单词之间的间距
    },
    mask: {
      width: 900, // 设置词云的宽度
      height: 600 // 设置词云的高度
    }
  };

  const renderContent = () => {
    if (isEmpty(words)) return <Empty className={'mt-5'} />;

    switch (displayType) {
      case DisplayEnum.WordCloud:
        return <WordCloud loading={loading} {...wordCloudConfig} />;
      case DisplayEnum.Bar:
        return <Column loading={loading} {...barConfig} />;
      case DisplayEnum.Table:
        return (
          <Table
            loading={loading}
            columns={columns}
            dataSource={words}
            rowKey="text"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={'flex justify-center items-center flex-col gap-4'}>
      <div style={{ textAlign: 'center' }}>
        <Segmented
          options={[
            {
              label: 'Word Cloud',
              value: DisplayEnum.WordCloud,
              icon: <CloudOutlined />
            },
            {
              label: 'Chart',
              value: DisplayEnum.Bar,
              icon: <BarChartOutlined />
            },
            {
              label: 'Table',
              value: DisplayEnum.Table,
              icon: <TableOutlined />
            }
          ]}
          value={displayType}
          onChange={(value) => setDisplayType(value)}
        />
      </div>
      {renderContent()}
    </div>
  );
};

export default WordCloudComp;
