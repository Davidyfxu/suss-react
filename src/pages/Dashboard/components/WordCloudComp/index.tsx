import React, { useEffect, useState, useCallback } from 'react';
import { draw_wordcloud } from '../../api.ts';
import { useUserStore } from '../../../../stores/userStore';
import ReactWordcloud from 'react-wordcloud';
import { Empty, Spin, Typography } from 'antd';
import { SelectSUSS } from '../../../../components';

const WordCloudComp: React.FC = () => {
  const courseCode = useUserStore((state) => state.courseCode);
  const dateRange = useUserStore((state) => state.dateRange);
  const [words, setWords] = useState<{ value: number; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const getWords = useCallback(async () => {
    try {
      setLoading(true);
      const { entry_contents = {} } = await draw_wordcloud({
        option_course: courseCode,
        active_topic: topic,
        start_date: dateRange?.[0],
        end_date: dateRange?.[1]
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
  }, [courseCode, topic, dateRange]);

  useEffect(() => {
    courseCode && getWords();
  }, [courseCode, topic, dateRange]);

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div>
        <Typography.Title level={5} className="!m-0">
          Word Cloud
        </Typography.Title>
        <span className="text-gray-600">
          Please select the topic title to view the Word Cloud
        </span>
        <SelectSUSS
          allowClear
          placeholder={'Please select a topic from the course.'}
          className={'w-full'}
          handleSelect={(v) => setTopic(v)}
        />
      </div>

      <div className="flex-1 bg-gray-50 rounded-xl p-2 border border-gray-100 overflow-hidden">
        {loading ? (
          <Spin size="large" />
        ) : words.length > 0 ? (
          <div className="w-full h-full">
            <ReactWordcloud
              words={words}
              options={{
                enableTooltip: true,
                deterministic: false,
                fontSizes: [14, 80],
                padding: 3,
                rotations: 2,
                rotationAngles: [0, 0],
                scale: 'log',
                spiral: 'archimedean',
                transitionDuration: 300,
                fontFamily: 'Inter, system-ui, sans-serif',
                colors: [
                  '#1f2937',
                  '#2563eb',
                  '#7c3aed',
                  '#2dd4bf',
                  '#0891b2',
                  '#4f46e5'
                ]
              }}
            />
          </div>
        ) : (
          <Empty
            className={
              'flex-1 bg-gray-50 flex justify-center items-center flex-col h-full w-full'
            }
            description={'No data available. Please select a topic.'}
          />
        )}
      </div>
    </div>
  );
};

export default WordCloudComp;
